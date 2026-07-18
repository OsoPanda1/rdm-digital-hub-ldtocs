import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/src/data-gateway/**/__tests__/**/*.test.ts'],
    server: {
      deps: {
        inline: [/server\/src/],
      },
    },
  },
});
