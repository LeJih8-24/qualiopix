/**
 * Stockage de fichiers (documents figés, supports, preuves).
 * En production : stockage objet hébergé dans l'UE (S3 compatible), à brancher
 * derrière la même interface. En développement et en test : disque local.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface FileStorage {
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
}

export class LocalStorage implements FileStorage {
  constructor(private root: string) {}

  private resolve(key: string) {
    const full = path.resolve(this.root, key);
    if (!full.startsWith(path.resolve(this.root) + path.sep)) throw new Error("Clé de fichier invalide");
    return full;
  }

  async put(key: string, bytes: Uint8Array) {
    const full = this.resolve(key);
    await mkdir(path.dirname(full), { recursive: true });
    // « wx » : un fichier écrit ne peut pas être écrasé (objets figés).
    try {
      await writeFile(full, bytes, { flag: "wx" });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
      const existing = await readFile(full);
      if (!Buffer.from(bytes).equals(existing)) throw new Error(`Fichier déjà présent et différent : ${key}`);
    }
  }

  async get(key: string) {
    try {
      return new Uint8Array(await readFile(this.resolve(key)));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  }
}

let storage: FileStorage | null = null;

export function getStorage(): FileStorage {
  storage ??= new LocalStorage(process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"));
  return storage;
}

/** Pour les tests. */
export function setStorage(s: FileStorage) {
  storage = s;
}
