import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const envPath = process.cwd();
  const env = loadEnv(mode, envPath, "");
  console.log("env.NODE_ENV", env.NODE_ENV);
  return {
    define: {
      "process.env": { DEBUG: env.NODE_ENV === "development" },
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
        child_process: "process/browser",
        http2: "http-browserify",
      },
    },
    build: {
      sourcemap: env.NODE_ENV === "development",
      target: "esnext",
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    plugins: [react()],
  };
});
