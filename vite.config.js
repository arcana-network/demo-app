import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import polyfillNode from "rollup-plugin-polyfill-node";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      // stream: "stream-browserify",
      // crypto: "crypto-browserify",
    },
  },
  define: {
    "process.env": process.env,
  },
  plugins: [vue(), polyfillNode()],
  build: {
    chunkSizeWarningLimit: 1024,
  },
});
