import { Buffer } from "buffer";

if (typeof window.process === "undefined") {
  (window as any).process = { env: {}, version: "" };
}

// // for csv-parse polyfill
// // https://github.com/vitejs/vite/discussions/2785
// globalThis.Buffer = Buffer;
