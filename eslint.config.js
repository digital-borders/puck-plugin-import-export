import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],

    plugins: {
      react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },

      // 👇 così import/no-unresolved capisce tsconfig paths (@ui, @lib, @/)
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // cleanup
      "unused-imports/no-unused-imports": "warn",

      // import sanity
      "import/no-cycle": "warn",
      "import/no-unresolved": "error",

      // misc
      "no-console": "off",
    },
  },
];
