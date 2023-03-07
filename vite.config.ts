import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import notifier from "vite-plugin-notifier";

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
        child_process: "process/browser",
        http2: "http-browserify",
        stream: "rollup-plugin-node-polyfills/polyfills/stream",
        zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
      },
    },
    build: {
      sourcemap: env.NODE_ENV === "development",
      target: "esnext",
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
    plugins: [react(), notifier()],
  };
});
