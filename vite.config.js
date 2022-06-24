import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import stdLibBrowser from "node-stdlib-browser";
import inject from "@rollup/plugin-inject";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...stdLibBrowser,
    },
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
  plugins: [
    vue(),
    {
      ...inject({
        global: [
          require.resolve("node-stdlib-browser/helpers/esbuild/shim"),
          "global",
        ],
        process: [
          require.resolve("node-stdlib-browser/helpers/esbuild/shim"),
          "process",
        ],
        Buffer: [
          require.resolve("node-stdlib-browser/helpers/esbuild/shim"),
          "Buffer",
        ],
      }),
      enforce: "post",
    },
  ],
  build: {
    chunkSizeWarningLimit: 1024,
    sourcemap: true,
  },
});
