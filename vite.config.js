import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      util: "rollup-plugin-polyfill-node/polyfills/util",
      sys: "util",
      events: "rollup-plugin-polyfill-node/polyfills/events",
      stream: "rollup-plugin-polyfill-node/polyfills/stream",
      path: "rollup-plugin-polyfill-node/polyfills/path",
      querystring: "rollup-plugin-polyfill-node/polyfills/qs",
      punycode: "rollup-plugin-polyfill-node/polyfills/punycode",
      url: "rollup-plugin-polyfill-node/polyfills/url",
      http: "rollup-plugin-polyfill-node/polyfills/http",
      https: "rollup-plugin-polyfill-node/polyfills/http",
      os: "rollup-plugin-polyfill-node/polyfills/os",
      assert: "rollup-plugin-polyfill-node/polyfills/assert",
      constants: "rollup-plugin-polyfill-node/polyfills/constants",
      _stream_duplex:
        "rollup-plugin-polyfill-node/polyfills/readable-stream/duplex",
      _stream_passthrough:
        "rollup-plugin-polyfill-node/polyfills/readable-stream/passthrough",
      _stream_readable:
        "rollup-plugin-polyfill-node/polyfills/readable-stream/readable",
      _stream_writable:
        "rollup-plugin-polyfill-node/polyfills/readable-stream/writable",
      _stream_transform:
        "rollup-plugin-polyfill-node/polyfills/readable-stream/transform",
      timers: "rollup-plugin-polyfill-node/polyfills/timers",
      console: "rollup-plugin-polyfill-node/polyfills/console",
      vm: "rollup-plugin-polyfill-node/polyfills/vm",
      zlib: "rollup-plugin-polyfill-node/polyfills/zlib",
      tty: "rollup-plugin-polyfill-node/polyfills/tty",
      domain: "rollup-plugin-polyfill-node/polyfills/domain",
    },
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1024,
    sourcemap: true,
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
