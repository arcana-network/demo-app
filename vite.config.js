import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// import inject from "@rollup/plugin-inject";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import { viteCommonjs, esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      stream: "stream-browserify",
      crypto: "crypto-browserify",
    },
  },
  plugins: [
    vue(),
    globals(),
    builtins(),
    esbuildCommonjs(["@arcana_tech/arcana-login", "@arcana_tech/storage-sdk"]),
  ],
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      plugins: [
        globals(),
        builtins(),
        nodeResolve(),
        commonjs({
          namedExports: {
            "js-sha3": ["default"],
          },
          include: "node_modules/**", // Default: undefined
        }),
      ],
    },
  },
  define: {
    "process.env": process.env,
  },
});

// export default ({ command, mode }) => {
//   const config = {
//     plugins: [vue()],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "/src"),
//         stream: "stream-browserify",
//         crypto: "crypto-browserify",
//       },
//     },
//   };
//   console.log({ command, mode });
//   if (command === "build") {
//     config.build = {
//       rollupOptions: {
//         plugins: [
//           inject({
//             "process.env": process.env,
//           }),
//         ],
//       },
//       chunkSizeWarningLimit: 1024,
//     };
//   } else {
//     config.define = { "process.env": process.env };
//   }
//   return config;
// };
