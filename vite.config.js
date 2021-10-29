import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// import inject from "@rollup/plugin-inject";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      stream: "stream-browserify",
      crypto: "crypto-browserify",
    },
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1024,
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
