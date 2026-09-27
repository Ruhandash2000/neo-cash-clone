// Pure ESM polyfill for Reflect metadata to prevent Vite CJS wrapper hoisting issues in Cloudflare SSR
if (typeof globalThis.Reflect === "undefined") {
  (globalThis as any).Reflect = {};
}

const MetadataMap = new WeakMap<object, Map<string | symbol, Map<any, any>>>();

if (!Reflect.getMetadata) {
  const getOrCreateTargetMap = (target: object, create = false) => {
    let targetMap = MetadataMap.get(target);
    if (!targetMap && create) {
      targetMap = new Map();
      MetadataMap.set(target, targetMap);
    }
    return targetMap;
  };

  const getOrCreatePropMap = (target: object, propertyKey?: string | symbol, create = false) => {
    const targetMap = getOrCreateTargetMap(target, create);
    if (!targetMap) return undefined;
    const key = propertyKey ?? Symbol.for("undefined");
    let propMap = targetMap.get(key);
    if (!propMap && create) {
      propMap = new Map();
      targetMap.set(key, propMap);
    }
    return propMap;
  };

  (Reflect as any).defineMetadata = (metadataKey: any, metadataValue: any, target: object, propertyKey?: string | symbol) => {
    const propMap = getOrCreatePropMap(target, propertyKey, true)!;
    propMap.set(metadataKey, metadataValue);
  };

  (Reflect as any).getMetadata = (metadataKey: any, target: object, propertyKey?: string | symbol) => {
    const propMap = getOrCreatePropMap(target, propertyKey, false);
    return propMap ? propMap.get(metadataKey) : undefined;
  };

  (Reflect as any).hasMetadata = (metadataKey: any, target: object, propertyKey?: string | symbol) => {
    const propMap = getOrCreatePropMap(target, propertyKey, false);
    return propMap ? propMap.has(metadataKey) : false;
  };

  (Reflect as any).metadata = (metadataKey: any, metadataValue: any) => {
    return (target: object, propertyKey?: string | symbol) => {
      (Reflect as any).defineMetadata(metadataKey, metadataValue, target, propertyKey);
    };
  };
}
