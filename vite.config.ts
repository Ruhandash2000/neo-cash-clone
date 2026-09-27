import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const reflectPolyfillBanner = `if (typeof globalThis.Reflect === "undefined") { globalThis.Reflect = {}; } if (!globalThis.Reflect.getMetadata) { const M = new WeakMap(); globalThis.Reflect.defineMetadata = function(k, v, t, p) { let tm = M.get(t); if (!tm) { tm = new Map(); M.set(t, tm); } const pk = p || Symbol.for("u"); let pm = tm.get(pk); if (!pm) { pm = new Map(); tm.set(pk, pm); } pm.set(k, v); }; globalThis.Reflect.getMetadata = function(k, t, p) { const tm = M.get(t); if (!tm) return undefined; const pm = tm.get(p || Symbol.for("u")); return pm ? pm.get(k) : undefined; }; globalThis.Reflect.hasMetadata = function(k, t, p) { const tm = M.get(t); if (!tm) return false; const pm = tm.get(p || Symbol.for("u")); return pm ? pm.has(k) : false; }; globalThis.Reflect.metadata = function(k, v) { return function(t, p) { globalThis.Reflect.defineMetadata(k, v, t, p); }; }; }`;

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        banner: reflectPolyfillBanner,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    allowedHosts: true,
  },
});
