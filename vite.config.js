import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import inject from "@rollup/plugin-inject";
// import nodePolyfill from "rollup-plugin-node-polyfills";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1024,
  },
  define: {
    process: import.meta,
  },
});

// export default ({ command, mode }) => {
//   const config = {
//     plugins: [vue()],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "/src"),
//       },
//     },
//   };
//   if (command === "build") {
//     config.build = {
//       rollupOptions: {
//         plugins: [
//           inject({
//             process: "process",
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
