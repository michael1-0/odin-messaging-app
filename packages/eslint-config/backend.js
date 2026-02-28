import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export function createBackendConfig({ tsconfigRootDir }) {
  return defineConfig([
    {
      ignores: ["dist/**", "src/db/generated/prisma/**", "prisma.config.ts"],
    },
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      plugins: { js },
      extends: ["js/recommended"],
      languageOptions: { globals: globals.node },
    },
    {
      files: ["**/*.{ts,mts,cts}"],
      extends: [...tseslint.configs.recommended],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir,
          project: "./tsconfig.json",
        },
      },
    },
  ]);
}