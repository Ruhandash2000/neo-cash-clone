import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtimePath = path.resolve(__dirname, "../.output/server/_runtime.mjs");

const reflectPolyfillHeader = `/* Complete Polyfill Reflect metadata for tsyringe / @peculiar/x509 in Cloudflare Workers */
if (typeof globalThis.Reflect === "undefined") { globalThis.Reflect = {}; }
if (!globalThis.Reflect.getMetadata || !globalThis.Reflect.getOwnMetadata) {
  const M = new WeakMap();
  const getOrCreateTargetMap = (t, c) => {
    let tm = M.get(t);
    if (!tm && c) { tm = new Map(); M.set(t, tm); }
    return tm;
  };
  const getOrCreatePropMap = (t, p, c) => {
    const tm = getOrCreateTargetMap(t, c);
    if (!tm) return undefined;
    const pk = p != null ? p : Symbol.for("u");
    let pm = tm.get(pk);
    if (!pm && c) { pm = new Map(); tm.set(pk, pm); }
    return pm;
  };
  globalThis.Reflect.defineMetadata = function(k, v, t, p) {
    const pm = getOrCreatePropMap(t, p, true);
    pm.set(k, v);
  };
  globalThis.Reflect.getOwnMetadata = function(k, t, p) {
    const pm = getOrCreatePropMap(t, p, false);
    return pm ? pm.get(k) : undefined;
  };
  globalThis.Reflect.getMetadata = function(k, t, p) {
    let curr = t;
    while (curr) {
      const pm = getOrCreatePropMap(curr, p, false);
      if (pm && pm.has(k)) return pm.get(k);
      curr = Object.getPrototypeOf(curr);
    }
    return undefined;
  };
  globalThis.Reflect.hasOwnMetadata = function(k, t, p) {
    const pm = getOrCreatePropMap(t, p, false);
    return pm ? pm.has(k) : false;
  };
  globalThis.Reflect.hasMetadata = function(k, t, p) {
    let curr = t;
    while (curr) {
      const pm = getOrCreatePropMap(curr, p, false);
      if (pm && pm.has(k)) return true;
      curr = Object.getPrototypeOf(curr);
    }
    return false;
  };
  globalThis.Reflect.getOwnMetadataKeys = function(t, p) {
    const pm = getOrCreatePropMap(t, p, false);
    return pm ? Array.from(pm.keys()) : [];
  };
  globalThis.Reflect.getMetadataKeys = function(t, p) {
    const keys = new Set();
    let curr = t;
    while (curr) {
      const pm = getOrCreatePropMap(curr, p, false);
      if (pm) { for (const k of pm.keys()) keys.add(k); }
      curr = Object.getPrototypeOf(curr);
    }
    return Array.from(keys);
  };
  globalThis.Reflect.deleteMetadata = function(k, t, p) {
    const pm = getOrCreatePropMap(t, p, false);
    return pm ? pm.delete(k) : false;
  };
  globalThis.Reflect.metadata = function(k, v) {
    return function(t, p) { globalThis.Reflect.defineMetadata(k, v, t, p); };
  };
}
`;

if (fs.existsSync(runtimePath)) {
  const content = fs.readFileSync(runtimePath, "utf-8");
  if (!content.includes("Complete Polyfill Reflect metadata")) {
    fs.writeFileSync(runtimePath, reflectPolyfillHeader + "\n" + content, "utf-8");
    console.log("[patch-reflect-polyfill] Successfully injected complete Reflect metadata polyfill into .output/server/_runtime.mjs");
  } else {
    console.log("[patch-reflect-polyfill] Reflect metadata polyfill already present in .output/server/_runtime.mjs");
  }
} else {
  console.warn("[patch-reflect-polyfill] Warning: .output/server/_runtime.mjs not found at " + runtimePath);
}
