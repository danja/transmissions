import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['tests/**/*.spec.*'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/tests_pending/**'],
    },
});
