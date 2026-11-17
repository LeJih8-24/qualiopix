import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { LocalStorage, setStorage } from "@/server/integrations/storage";
import { LogEmailSender, setEmailSender } from "@/server/integrations/email";

/** Stockage jetable et e-mails capturés pour chaque fichier de test. */
export const testStorageDir = mkdtempSync(path.join(tmpdir(), "qualiopix-test-"));
setStorage(new LocalStorage(testStorageDir));
export const outbox = new LogEmailSender();
setEmailSender(outbox);
