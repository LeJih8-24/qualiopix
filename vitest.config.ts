import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // tsconfig garde « jsx: preserve » pour Next.js ; Vitest doit transformer le JSX lui-même.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "@": r("./src"),
      // « server-only » refuse d'être importé hors de Next.js ; neutralisé en test.
      "server-only": r("./tests/server-only-stub.ts"),
    },
  },
  test: {
    projects: [
      { extends: true, test: { name: "unit", include: ["tests/unit/**/*.test.ts"] } },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/integration/global-setup.ts"],
          fileParallelism: false,
        },
      },
    ],
  },
});
