import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    "window.global": {},
  },
  resolve: {
    alias: {
      path: "path-browserify",
      http: "http-browserify",
      https: "https-browserify",
      os: "os-browserify/browser",
      fs: "browserify-fs",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      process: "process/browser",
    },
  },
  build: {
    rollupOptions: {
      external: ["child_process"],
    },
  },
  plugins: [react()],
});
