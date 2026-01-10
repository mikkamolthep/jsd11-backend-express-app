// vitest.config.js

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: "./src/tests/api/setup/setupTests.js",
    globals: true,
    verbose: true,
  },
});
