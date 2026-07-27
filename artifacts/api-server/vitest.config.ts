import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/middlewares/**/*.ts",
        "src/lib/security.ts",
        "src/lib/env.ts",
        "src/lib/isabella/kernel/**/*.ts",
        "src/routes/isabella-kernel.ts",
      ],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
  },
});
