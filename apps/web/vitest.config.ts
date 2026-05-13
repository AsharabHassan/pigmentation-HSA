import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: false,
  },
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
      "@ui": new URL("../../packages/ui", import.meta.url).pathname,
      "@lib": new URL("../../packages/lib", import.meta.url).pathname,
      "@content": new URL("../../packages/content", import.meta.url).pathname,
    },
  },
});
