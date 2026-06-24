import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage", "playwright-report", ".wrangler", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/*.server", "**/*.server.ts", "**/integrations/supabase/admin.server*"],
              message:
                "Server-only module. Do not import from frontend code. Use it from Edge Functions or *.server.ts files only.",
            },
            {
              group: ["**/integrations/supabase/admin", "**/integrations/supabase/admin.ts"],
              message:
                "Deprecated. Use getSupabaseAdmin() from 'admin.server' in server code only.",
            },
          ],
        },
      ],
    },
  },
  // Server-only files: relax the server-import restriction and allow process.env.
  {
    files: [
      "**/*.server.ts",
      "**/*.server.tsx",
      "services/**/*.{ts,tsx}",
      "supabase/functions/**/*.{ts,tsx}",
      "infra/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
      "no-console": "off",
    },
  },
);
