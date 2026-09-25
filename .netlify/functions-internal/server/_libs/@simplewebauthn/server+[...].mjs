import { n as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
import { t as base64 } from "../hexagon__base64.mjs";
import { n as encodeCBOR, t as decodePartialCBOR } from "../levischuck__tiny-cbor.mjs";
import { a as AsnParser, f as OctetString, n as id_ce_keyDescription, t as KeyDescription } from "../@peculiar/asn1-android+[...].mjs";
import { C as ExtendedKeyUsage, H as id_ce_basicConstraints, V as BasicConstraints, _ as id_ce_subjectAltName, g as SubjectAlternativeName, o as Certificate, w as id_ce_extKeyUsage } from "../@peculiar/asn1-asym-key+[...].mjs";
import { n as ECParameters, t as ECDSASigValue } from "../peculiar__asn1-ecc.mjs";
import { c as id_sha1WithRSAEncryption, f as id_sha256WithRSAEncryption, g as id_sha512WithRSAEncryption, m as id_sha384WithRSAEncryption, n as RSAPublicKey, o as id_rsaEncryption } from "../@peculiar/asn1-pfx+[...].mjs";
import { a as X509ChainBuilder, i as X509Certificate, n as CRLDistributionPointsExtension, o as X509Crl, r as SubjectKeyIdentifierExtension, t as AuthorityKeyIdentifierExtension } from "../peculiar__x509+tsyringe.mjs";
import { n as id_ml_dsa_65, r as id_ml_dsa_87, t as id_ml_dsa_44 } from "../@peculiar/asn1-x509-post-quantum+[...].mjs";
//#region node_modules/reflect-metadata/Reflect.js
var require_Reflect = /* @__PURE__ */ __commonJSMin((() => {
	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0
	
	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.
	
	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	var Reflect;
	(function(Reflect) {
		(function(factory) {
			var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
			var exporter = makeExporter(Reflect);
			if (typeof root.Reflect !== "undefined") exporter = makeExporter(root.Reflect, exporter);
			factory(exporter, root);
			if (typeof root.Reflect === "undefined") root.Reflect = Reflect;
			function makeExporter(target, previous) {
				return function(key, value) {
					Object.defineProperty(target, key, {
						configurable: true,
						writable: true,
						value
					});
					if (previous) previous(key, value);
				};
			}
			function functionThis() {
				try {
					return Function("return this;")();
				} catch (_) {}
			}
			function indirectEvalThis() {
				try {
					return (0, eval)("(function() { return this; })()");
				} catch (_) {}
			}
			function sloppyModeThis() {
				return functionThis() || indirectEvalThis();
			}
		})(function(exporter, root) {
			var hasOwn = Object.prototype.hasOwnProperty;
			var supportsSymbol = typeof Symbol === "function";
			var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
			var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
			var supportsCreate = typeof Object.create === "function";
			var supportsProto = { __proto__: [] } instanceof Array;
			var downLevel = !supportsCreate && !supportsProto;
			var HashMap = {
				create: supportsCreate ? function() {
					return MakeDictionary(Object.create(null));
				} : supportsProto ? function() {
					return MakeDictionary({ __proto__: null });
				} : function() {
					return MakeDictionary({});
				},
				has: downLevel ? function(map, key) {
					return hasOwn.call(map, key);
				} : function(map, key) {
					return key in map;
				},
				get: downLevel ? function(map, key) {
					return hasOwn.call(map, key) ? map[key] : void 0;
				} : function(map, key) {
					return map[key];
				}
			};
			var functionPrototype = Object.getPrototypeOf(Function);
			var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
			var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
			var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
			var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
			var metadataRegistry = GetOrCreateMetadataRegistry();
			var metadataProvider = CreateMetadataProvider(metadataRegistry);
			/**
			* Applies a set of decorators to a property of a target object.
			* @param decorators An array of decorators.
			* @param target The target object.
			* @param propertyKey (Optional) The property key to decorate.
			* @param attributes (Optional) The property descriptor for the target key.
			* @remarks Decorators are applied in reverse order.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Example = Reflect.decorate(decoratorsArray, Example);
			*
			*     // property (on constructor)
			*     Reflect.decorate(decoratorsArray, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.decorate(decoratorsArray, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Object.defineProperty(Example, "staticMethod",
			*         Reflect.decorate(decoratorsArray, Example, "staticMethod",
			*             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
			*
			*     // method (on prototype)
			*     Object.defineProperty(Example.prototype, "method",
			*         Reflect.decorate(decoratorsArray, Example.prototype, "method",
			*             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
			*
			*/
			function decorate(decorators, target, propertyKey, attributes) {
				if (!IsUndefined(propertyKey)) {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsObject(target)) throw new TypeError();
					if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
					if (IsNull(attributes)) attributes = void 0;
					propertyKey = ToPropertyKey(propertyKey);
					return DecorateProperty(decorators, target, propertyKey, attributes);
				} else {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsConstructor(target)) throw new TypeError();
					return DecorateConstructor(decorators, target);
				}
			}
			exporter("decorate", decorate);
			/**
			* A default metadata decorator factory that can be used on a class, class member, or parameter.
			* @param metadataKey The key for the metadata entry.
			* @param metadataValue The value for the metadata entry.
			* @returns A decorator function.
			* @remarks
			* If `metadataKey` is already defined for the target and target key, the
			* metadataValue for that key will be overwritten.
			* @example
			*
			*     // constructor
			*     @Reflect.metadata(key, value)
			*     class Example {
			*     }
			*
			*     // property (on constructor, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticProperty;
			*     }
			*
			*     // property (on prototype, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         property;
			*     }
			*
			*     // method (on constructor)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticMethod() { }
			*     }
			*
			*     // method (on prototype)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         method() { }
			*     }
			*
			*/
			function metadata(metadataKey, metadataValue) {
				function decorator(target, propertyKey) {
					if (!IsObject(target)) throw new TypeError();
					if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
					OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
				}
				return decorator;
			}
			exporter("metadata", metadata);
			/**
			* Define a unique metadata entry on the target.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param metadataValue A value that contains attached metadata.
			* @param target The target object on which to define metadata.
			* @param propertyKey (Optional) The property key for the target.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Reflect.defineMetadata("custom:annotation", options, Example);
			*
			*     // property (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
			*
			*     // method (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
			*
			*     // decorator factory as metadata-producing annotation.
			*     function MyAnnotation(options): Decorator {
			*         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
			*     }
			*
			*/
			function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
			}
			exporter("defineMetadata", defineMetadata);
			/**
			* Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasMetadata", hasMetadata);
			/**
			* Gets a value indicating whether the target object has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasOwnMetadata", hasOwnMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object or its prototype chain.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetMetadata(metadataKey, target, propertyKey);
			}
			exporter("getMetadata", getMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("getOwnMetadata", getOwnMetadata);
			/**
			* Gets the metadata keys defined on the target object or its prototype chain.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "method");
			*
			*/
			function getMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryMetadataKeys(target, propertyKey);
			}
			exporter("getMetadataKeys", getMetadataKeys);
			/**
			* Gets the unique metadata keys defined on the target object.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
			*
			*/
			function getOwnMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryOwnMetadataKeys(target, propertyKey);
			}
			exporter("getOwnMetadataKeys", getOwnMetadataKeys);
			/**
			* Deletes the metadata entry from the target object with the provided key.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata entry was found and deleted; otherwise, false.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.deleteMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function deleteMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				var provider = GetMetadataProvider(target, propertyKey, false);
				if (IsUndefined(provider)) return false;
				return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
			}
			exporter("deleteMetadata", deleteMetadata);
			function DecorateConstructor(decorators, target) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsConstructor(decorated)) throw new TypeError();
						target = decorated;
					}
				}
				return target;
			}
			function DecorateProperty(decorators, target, propertyKey, descriptor) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target, propertyKey, descriptor);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsObject(decorated)) throw new TypeError();
						descriptor = decorated;
					}
				}
				return descriptor;
			}
			function OrdinaryHasMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return true;
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
				return false;
			}
			function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return false;
				return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
			}
			function OrdinaryGetMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
			}
			function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return;
				return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
			}
			function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
				GetMetadataProvider(O, P, true).OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
			}
			function OrdinaryMetadataKeys(O, P) {
				var ownKeys = OrdinaryOwnMetadataKeys(O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (parent === null) return ownKeys;
				var parentKeys = OrdinaryMetadataKeys(parent, P);
				if (parentKeys.length <= 0) return ownKeys;
				if (ownKeys.length <= 0) return parentKeys;
				var set = new _Set();
				var keys = [];
				for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
					var key = ownKeys_1[_i];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
					var key = parentKeys_1[_a];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				return keys;
			}
			function OrdinaryOwnMetadataKeys(O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (!provider) return [];
				return provider.OrdinaryOwnMetadataKeys(O, P);
			}
			function Type(x) {
				if (x === null) return 1;
				switch (typeof x) {
					case "undefined": return 0;
					case "boolean": return 2;
					case "string": return 3;
					case "symbol": return 4;
					case "number": return 5;
					case "object": return x === null ? 1 : 6;
					default: return 6;
				}
			}
			function IsUndefined(x) {
				return x === void 0;
			}
			function IsNull(x) {
				return x === null;
			}
			function IsSymbol(x) {
				return typeof x === "symbol";
			}
			function IsObject(x) {
				return typeof x === "object" ? x !== null : typeof x === "function";
			}
			function ToPrimitive(input, PreferredType) {
				switch (Type(input)) {
					case 0: return input;
					case 1: return input;
					case 2: return input;
					case 3: return input;
					case 4: return input;
					case 5: return input;
				}
				var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
				var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
				if (exoticToPrim !== void 0) {
					var result = exoticToPrim.call(input, hint);
					if (IsObject(result)) throw new TypeError();
					return result;
				}
				return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
			}
			function OrdinaryToPrimitive(O, hint) {
				if (hint === "string") {
					var toString_1 = O.toString;
					if (IsCallable(toString_1)) {
						var result = toString_1.call(O);
						if (!IsObject(result)) return result;
					}
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
				} else {
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
					var toString_2 = O.toString;
					if (IsCallable(toString_2)) {
						var result = toString_2.call(O);
						if (!IsObject(result)) return result;
					}
				}
				throw new TypeError();
			}
			function ToBoolean(argument) {
				return !!argument;
			}
			function ToString(argument) {
				return "" + argument;
			}
			function ToPropertyKey(argument) {
				var key = ToPrimitive(argument, 3);
				if (IsSymbol(key)) return key;
				return ToString(key);
			}
			function IsArray(argument) {
				return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
			}
			function IsCallable(argument) {
				return typeof argument === "function";
			}
			function IsConstructor(argument) {
				return typeof argument === "function";
			}
			function IsPropertyKey(argument) {
				switch (Type(argument)) {
					case 3: return true;
					case 4: return true;
					default: return false;
				}
			}
			function SameValueZero(x, y) {
				return x === y || x !== x && y !== y;
			}
			function GetMethod(V, P) {
				var func = V[P];
				if (func === void 0 || func === null) return void 0;
				if (!IsCallable(func)) throw new TypeError();
				return func;
			}
			function GetIterator(obj) {
				var method = GetMethod(obj, iteratorSymbol);
				if (!IsCallable(method)) throw new TypeError();
				var iterator = method.call(obj);
				if (!IsObject(iterator)) throw new TypeError();
				return iterator;
			}
			function IteratorValue(iterResult) {
				return iterResult.value;
			}
			function IteratorStep(iterator) {
				var result = iterator.next();
				return result.done ? false : result;
			}
			function IteratorClose(iterator) {
				var f = iterator["return"];
				if (f) f.call(iterator);
			}
			function OrdinaryGetPrototypeOf(O) {
				var proto = Object.getPrototypeOf(O);
				if (typeof O !== "function" || O === functionPrototype) return proto;
				if (proto !== functionPrototype) return proto;
				var prototype = O.prototype;
				var prototypeProto = prototype && Object.getPrototypeOf(prototype);
				if (prototypeProto == null || prototypeProto === Object.prototype) return proto;
				var constructor = prototypeProto.constructor;
				if (typeof constructor !== "function") return proto;
				if (constructor === O) return proto;
				return constructor;
			}
			/**
			* Creates a registry used to allow multiple `reflect-metadata` providers.
			*/
			function CreateMetadataRegistry() {
				var fallback;
				if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") fallback = CreateFallbackProvider(root.Reflect);
				var first;
				var second;
				var rest;
				var targetProviderMap = new _WeakMap();
				var registry = {
					registerProvider,
					getProvider,
					setProvider
				};
				return registry;
				function registerProvider(provider) {
					if (!Object.isExtensible(registry)) throw new Error("Cannot add provider to a frozen registry.");
					switch (true) {
						case fallback === provider: break;
						case IsUndefined(first):
							first = provider;
							break;
						case first === provider: break;
						case IsUndefined(second):
							second = provider;
							break;
						case second === provider: break;
						default:
							if (rest === void 0) rest = new _Set();
							rest.add(provider);
					}
				}
				function getProviderNoCache(O, P) {
					if (!IsUndefined(first)) {
						if (first.isProviderFor(O, P)) return first;
						if (!IsUndefined(second)) {
							if (second.isProviderFor(O, P)) return first;
							if (!IsUndefined(rest)) {
								var iterator = GetIterator(rest);
								while (true) {
									var next = IteratorStep(iterator);
									if (!next) return;
									var provider = IteratorValue(next);
									if (provider.isProviderFor(O, P)) {
										IteratorClose(iterator);
										return provider;
									}
								}
							}
						}
					}
					if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) return fallback;
				}
				function getProvider(O, P) {
					var providerMap = targetProviderMap.get(O);
					var provider;
					if (!IsUndefined(providerMap)) provider = providerMap.get(P);
					if (!IsUndefined(provider)) return provider;
					provider = getProviderNoCache(O, P);
					if (!IsUndefined(provider)) {
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return provider;
				}
				function hasProvider(provider) {
					if (IsUndefined(provider)) throw new TypeError();
					return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
				}
				function setProvider(O, P, provider) {
					if (!hasProvider(provider)) throw new Error("Metadata provider not registered.");
					var existingProvider = getProvider(O, P);
					if (existingProvider !== provider) {
						if (!IsUndefined(existingProvider)) return false;
						var providerMap = targetProviderMap.get(O);
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return true;
				}
			}
			/**
			* Gets or creates the shared registry of metadata providers.
			*/
			function GetOrCreateMetadataRegistry() {
				var metadataRegistry;
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) metadataRegistry = root.Reflect[registrySymbol];
				if (IsUndefined(metadataRegistry)) metadataRegistry = CreateMetadataRegistry();
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) Object.defineProperty(root.Reflect, registrySymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: metadataRegistry
				});
				return metadataRegistry;
			}
			function CreateMetadataProvider(registry) {
				var metadata = new _WeakMap();
				var provider = {
					isProviderFor: function(O, P) {
						var targetMetadata = metadata.get(O);
						if (IsUndefined(targetMetadata)) return false;
						return targetMetadata.has(P);
					},
					OrdinaryDefineOwnMetadata,
					OrdinaryHasOwnMetadata,
					OrdinaryGetOwnMetadata,
					OrdinaryOwnMetadataKeys,
					OrdinaryDeleteMetadata
				};
				metadataRegistry.registerProvider(provider);
				return provider;
				function GetOrCreateMetadataMap(O, P, Create) {
					var targetMetadata = metadata.get(O);
					var createdTargetMetadata = false;
					if (IsUndefined(targetMetadata)) {
						if (!Create) return void 0;
						targetMetadata = new _Map();
						metadata.set(O, targetMetadata);
						createdTargetMetadata = true;
					}
					var metadataMap = targetMetadata.get(P);
					if (IsUndefined(metadataMap)) {
						if (!Create) return void 0;
						metadataMap = new _Map();
						targetMetadata.set(P, metadataMap);
						if (!registry.setProvider(O, P, provider)) {
							targetMetadata.delete(P);
							if (createdTargetMetadata) metadata.delete(O);
							throw new Error("Wrong provider for target.");
						}
					}
					return metadataMap;
				}
				function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					return ToBoolean(metadataMap.has(MetadataKey));
				}
				function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return void 0;
					return metadataMap.get(MetadataKey);
				}
				function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
					GetOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
				}
				function OrdinaryOwnMetadataKeys(O, P) {
					var keys = [];
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return keys;
					var iterator = GetIterator(metadataMap.keys());
					var k = 0;
					while (true) {
						var next = IteratorStep(iterator);
						if (!next) {
							keys.length = k;
							return keys;
						}
						var nextValue = IteratorValue(next);
						try {
							keys[k] = nextValue;
						} catch (e) {
							try {
								IteratorClose(iterator);
							} finally {
								throw e;
							}
						}
						k++;
					}
				}
				function OrdinaryDeleteMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					if (!metadataMap.delete(MetadataKey)) return false;
					if (metadataMap.size === 0) {
						var targetMetadata = metadata.get(O);
						if (!IsUndefined(targetMetadata)) {
							targetMetadata.delete(P);
							if (targetMetadata.size === 0) metadata.delete(targetMetadata);
						}
					}
					return true;
				}
			}
			function CreateFallbackProvider(reflect) {
				var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
				var metadataOwner = new _WeakMap();
				return {
					isProviderFor: function(O, P) {
						var metadataPropertySet = metadataOwner.get(O);
						if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) return true;
						if (getOwnMetadataKeys(O, P).length) {
							if (IsUndefined(metadataPropertySet)) {
								metadataPropertySet = new _Set();
								metadataOwner.set(O, metadataPropertySet);
							}
							metadataPropertySet.add(P);
							return true;
						}
						return false;
					},
					OrdinaryDefineOwnMetadata: defineMetadata,
					OrdinaryHasOwnMetadata: hasOwnMetadata,
					OrdinaryGetOwnMetadata: getOwnMetadata,
					OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
					OrdinaryDeleteMetadata: deleteMetadata
				};
			}
			/**
			* Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
			* then this module's metadata provider is assigned to the object.
			*/
			function GetMetadataProvider(O, P, Create) {
				var registeredProvider = metadataRegistry.getProvider(O, P);
				if (!IsUndefined(registeredProvider)) return registeredProvider;
				if (Create) {
					if (metadataRegistry.setProvider(O, P, metadataProvider)) return metadataProvider;
					throw new Error("Illegal state.");
				}
			}
			function CreateMapPolyfill() {
				var cacheSentinel = {};
				var arraySentinel = [];
				var MapIterator = function() {
					function MapIterator(keys, values, selector) {
						this._index = 0;
						this._keys = keys;
						this._values = values;
						this._selector = selector;
					}
					MapIterator.prototype["@@iterator"] = function() {
						return this;
					};
					MapIterator.prototype[iteratorSymbol] = function() {
						return this;
					};
					MapIterator.prototype.next = function() {
						var index = this._index;
						if (index >= 0 && index < this._keys.length) {
							var result = this._selector(this._keys[index], this._values[index]);
							if (index + 1 >= this._keys.length) {
								this._index = -1;
								this._keys = arraySentinel;
								this._values = arraySentinel;
							} else this._index++;
							return {
								value: result,
								done: false
							};
						}
						return {
							value: void 0,
							done: true
						};
					};
					MapIterator.prototype.throw = function(error) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						throw error;
					};
					MapIterator.prototype.return = function(value) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						return {
							value,
							done: true
						};
					};
					return MapIterator;
				}();
				return function() {
					function Map() {
						this._keys = [];
						this._values = [];
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					}
					Object.defineProperty(Map.prototype, "size", {
						get: function() {
							return this._keys.length;
						},
						enumerable: true,
						configurable: true
					});
					Map.prototype.has = function(key) {
						return this._find(key, false) >= 0;
					};
					Map.prototype.get = function(key) {
						var index = this._find(key, false);
						return index >= 0 ? this._values[index] : void 0;
					};
					Map.prototype.set = function(key, value) {
						var index = this._find(key, true);
						this._values[index] = value;
						return this;
					};
					Map.prototype.delete = function(key) {
						var index = this._find(key, false);
						if (index >= 0) {
							var size = this._keys.length;
							for (var i = index + 1; i < size; i++) {
								this._keys[i - 1] = this._keys[i];
								this._values[i - 1] = this._values[i];
							}
							this._keys.length--;
							this._values.length--;
							if (SameValueZero(key, this._cacheKey)) {
								this._cacheKey = cacheSentinel;
								this._cacheIndex = -2;
							}
							return true;
						}
						return false;
					};
					Map.prototype.clear = function() {
						this._keys.length = 0;
						this._values.length = 0;
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					};
					Map.prototype.keys = function() {
						return new MapIterator(this._keys, this._values, getKey);
					};
					Map.prototype.values = function() {
						return new MapIterator(this._keys, this._values, getValue);
					};
					Map.prototype.entries = function() {
						return new MapIterator(this._keys, this._values, getEntry);
					};
					Map.prototype["@@iterator"] = function() {
						return this.entries();
					};
					Map.prototype[iteratorSymbol] = function() {
						return this.entries();
					};
					Map.prototype._find = function(key, insert) {
						if (!SameValueZero(this._cacheKey, key)) {
							this._cacheIndex = -1;
							for (var i = 0; i < this._keys.length; i++) if (SameValueZero(this._keys[i], key)) {
								this._cacheIndex = i;
								break;
							}
						}
						if (this._cacheIndex < 0 && insert) {
							this._cacheIndex = this._keys.length;
							this._keys.push(key);
							this._values.push(void 0);
						}
						return this._cacheIndex;
					};
					return Map;
				}();
				function getKey(key, _) {
					return key;
				}
				function getValue(_, value) {
					return value;
				}
				function getEntry(key, value) {
					return [key, value];
				}
			}
			function CreateSetPolyfill() {
				return function() {
					function Set() {
						this._map = new _Map();
					}
					Object.defineProperty(Set.prototype, "size", {
						get: function() {
							return this._map.size;
						},
						enumerable: true,
						configurable: true
					});
					Set.prototype.has = function(value) {
						return this._map.has(value);
					};
					Set.prototype.add = function(value) {
						return this._map.set(value, value), this;
					};
					Set.prototype.delete = function(value) {
						return this._map.delete(value);
					};
					Set.prototype.clear = function() {
						this._map.clear();
					};
					Set.prototype.keys = function() {
						return this._map.keys();
					};
					Set.prototype.values = function() {
						return this._map.keys();
					};
					Set.prototype.entries = function() {
						return this._map.entries();
					};
					Set.prototype["@@iterator"] = function() {
						return this.keys();
					};
					Set.prototype[iteratorSymbol] = function() {
						return this.keys();
					};
					return Set;
				}();
			}
			function CreateWeakMapPolyfill() {
				var UUID_SIZE = 16;
				var keys = HashMap.create();
				var rootKey = CreateUniqueKey();
				return function() {
					function WeakMap() {
						this._key = CreateUniqueKey();
					}
					WeakMap.prototype.has = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.has(table, this._key) : false;
					};
					WeakMap.prototype.get = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.get(table, this._key) : void 0;
					};
					WeakMap.prototype.set = function(target, value) {
						var table = GetOrCreateWeakMapTable(target, true);
						table[this._key] = value;
						return this;
					};
					WeakMap.prototype.delete = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? delete table[this._key] : false;
					};
					WeakMap.prototype.clear = function() {
						this._key = CreateUniqueKey();
					};
					return WeakMap;
				}();
				function CreateUniqueKey() {
					var key;
					do
						key = "@@WeakMap@@" + CreateUUID();
					while (HashMap.has(keys, key));
					keys[key] = true;
					return key;
				}
				function GetOrCreateWeakMapTable(target, create) {
					if (!hasOwn.call(target, rootKey)) {
						if (!create) return void 0;
						Object.defineProperty(target, rootKey, { value: HashMap.create() });
					}
					return target[rootKey];
				}
				function FillRandomBytes(buffer, size) {
					for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 255 | 0;
					return buffer;
				}
				function GenRandomBytes(size) {
					if (typeof Uint8Array === "function") {
						var array = new Uint8Array(size);
						if (typeof crypto !== "undefined") crypto.getRandomValues(array);
						else if (typeof msCrypto !== "undefined") msCrypto.getRandomValues(array);
						else FillRandomBytes(array, size);
						return array;
					}
					return FillRandomBytes(new Array(size), size);
				}
				function CreateUUID() {
					var data = GenRandomBytes(UUID_SIZE);
					data[6] = data[6] & 79 | 64;
					data[8] = data[8] & 191 | 128;
					var result = "";
					for (var offset = 0; offset < UUID_SIZE; ++offset) {
						var byte = data[offset];
						if (offset === 4 || offset === 6 || offset === 8) result += "-";
						if (byte < 16) result += "0";
						result += byte.toString(16).toLowerCase();
					}
					return result;
				}
			}
			function MakeDictionary(obj) {
				obj.__ = void 0;
				delete obj.__;
				return obj;
			}
		});
	})(Reflect || (Reflect = {}));
}));
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoBase64URL.js
/**
* A runtime-agnostic collection of methods for working with Base64URL encoding
* @module
*/
/**
* Decode from a Base64URL-encoded string to an ArrayBuffer. Best used when converting a
* credential ID from a JSON string to an ArrayBuffer, like in allowCredentials or
* excludeCredentials.
*
* @param buffer Value to decode from base64
* @param to (optional) The decoding to use, in case it's desirable to decode from base64 instead
*/
function toBuffer(base64urlString, from = "base64url") {
	const _buffer = base64.toArrayBuffer(base64urlString, from === "base64url");
	return new Uint8Array(_buffer);
}
/**
* Encode the given array buffer into a Base64URL-encoded string. Ideal for converting various
* credential response ArrayBuffers to string for sending back to the server as JSON.
*
* @param buffer Value to encode to base64
* @param to (optional) The encoding to use, in case it's desirable to encode to base64 instead
*/
function fromBuffer(buffer, to = "base64url") {
	/**
	* Gracefully handle Uint8Array subclass types, like Node's Buffer, that can have a large
	* ArrayBuffer backing it.
	*/
	const _normalized = new Uint8Array(buffer);
	return base64.fromArrayBuffer(_normalized.buffer, to === "base64url");
}
/**
* Convert a base64url string into base64
*/
function toBase64(base64urlString) {
	const fromBase64Url = base64.toArrayBuffer(base64urlString, true);
	return base64.fromArrayBuffer(fromBase64Url);
}
/**
* Decode a base64url string into its original UTF-8 string
*/
function toUTF8String$1(base64urlString) {
	return base64.toString(base64urlString, true);
}
/**
* Confirm that the string is encoded into base64
*/
function isBase64(input) {
	return base64.validate(input, false);
}
/**
* Confirm that the string is encoded into base64url, with support for optional padding
*/
function isBase64URL(input) {
	input = trimPadding(input);
	return base64.validate(input, true);
}
/**
* Remove optional padding from a base64url-encoded string
*/
function trimPadding(input) {
	return input.replace(/=/g, "");
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCBOR.js
/**
* A runtime-agnostic collection of methods for working with CBOR encoding
* @module
*/
/**
* Whatever CBOR encoder is used should keep CBOR data the same length when data is re-encoded
*
* MOST CRITICALLY, this means the following needs to be true of whatever CBOR library we use:
* - CBOR Map type values MUST decode to JavaScript Maps
* - CBOR tag 64 (uint8 Typed Array) MUST NOT be used when encoding Uint8Arrays back to CBOR
*
* So long as these requirements are maintained, then CBOR sequences can be encoded and decoded
* freely while maintaining their lengths for the most accurate pointer movement across them.
*/
/**
* Decode and return the first item in a sequence of CBOR-encoded values
*
* @param input The CBOR data to decode
* @param asObject (optional) Whether to convert any CBOR Maps into JavaScript Objects. Defaults to
* `false`
*/
function decodeFirst(input) {
	const _input = new Uint8Array(input);
	const [first] = decodePartialCBOR(_input, 0);
	return first;
}
/**
* Encode data to CBOR
*/
function encode(input) {
	return encodeCBOR(input);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/cose.js
/**
* A type guard for determining if a COSE public key is an OKP key pair
*/
function isCOSEPublicKeyOKP(cosePublicKey) {
	const kty = cosePublicKey.get(COSEKEYS.kty);
	return isCOSEKty(kty) && kty === COSEKTY.OKP;
}
/**
* A type guard for determining if a COSE public key is an EC2 key pair
*/
function isCOSEPublicKeyEC2(cosePublicKey) {
	const kty = cosePublicKey.get(COSEKEYS.kty);
	return isCOSEKty(kty) && kty === COSEKTY.EC2;
}
/**
* A type guard for determining if a COSE public key is an RSA key pair
*/
function isCOSEPublicKeyRSA(cosePublicKey) {
	const kty = cosePublicKey.get(COSEKEYS.kty);
	return isCOSEKty(kty) && kty === COSEKTY.RSA;
}
/**
* A type guard for determining if a COSE public key is an AKP key pair
*/
function isCOSEPublicKeyAKP(cosePublicKey) {
	const kty = cosePublicKey.get(COSEKEYS.kty);
	return isCOSEKty(kty) && kty === COSEKTY.AKP;
}
/**
* COSE Keys
*
* https://www.iana.org/assignments/cose/cose.xhtml#key-common-parameters
* https://www.iana.org/assignments/cose/cose.xhtml#key-type-parameters
*/
var COSEKEYS;
(function(COSEKEYS) {
	COSEKEYS[COSEKEYS["kty"] = 1] = "kty";
	COSEKEYS[COSEKEYS["alg"] = 3] = "alg";
	COSEKEYS[COSEKEYS["crv"] = -1] = "crv";
	COSEKEYS[COSEKEYS["x"] = -2] = "x";
	COSEKEYS[COSEKEYS["y"] = -3] = "y";
	COSEKEYS[COSEKEYS["n"] = -1] = "n";
	COSEKEYS[COSEKEYS["e"] = -2] = "e";
	COSEKEYS[COSEKEYS["pub"] = -1] = "pub";
})(COSEKEYS || (COSEKEYS = {}));
/**
* COSE Key Types
*
* https://www.iana.org/assignments/cose/cose.xhtml#key-type
*/
var COSEKTY;
(function(COSEKTY) {
	COSEKTY[COSEKTY["OKP"] = 1] = "OKP";
	COSEKTY[COSEKTY["EC2"] = 2] = "EC2";
	COSEKTY[COSEKTY["RSA"] = 3] = "RSA";
	COSEKTY[COSEKTY["AKP"] = 7] = "AKP";
})(COSEKTY || (COSEKTY = {}));
function isCOSEKty(kty) {
	return Object.values(COSEKTY).indexOf(kty) >= 0;
}
/**
* COSE Curves
*
* https://www.iana.org/assignments/cose/cose.xhtml#elliptic-curves
*/
var COSECRV;
(function(COSECRV) {
	COSECRV[COSECRV["P256"] = 1] = "P256";
	COSECRV[COSECRV["P384"] = 2] = "P384";
	COSECRV[COSECRV["P521"] = 3] = "P521";
	COSECRV[COSECRV["ED25519"] = 6] = "ED25519";
	COSECRV[COSECRV["SECP256K1"] = 8] = "SECP256K1";
})(COSECRV || (COSECRV = {}));
function isCOSECrv(crv) {
	return Object.values(COSECRV).indexOf(crv) >= 0;
}
/**
* COSE Algorithms
*
* https://www.iana.org/assignments/cose/cose.xhtml#algorithms
*/
var COSEALG;
(function(COSEALG) {
	COSEALG[COSEALG["ES256"] = -7] = "ES256";
	COSEALG[COSEALG["EdDSA"] = -8] = "EdDSA";
	COSEALG[COSEALG["ES384"] = -35] = "ES384";
	COSEALG[COSEALG["ES512"] = -36] = "ES512";
	COSEALG[COSEALG["PS256"] = -37] = "PS256";
	COSEALG[COSEALG["PS384"] = -38] = "PS384";
	COSEALG[COSEALG["PS512"] = -39] = "PS512";
	COSEALG[COSEALG["ES256K"] = -47] = "ES256K";
	COSEALG[COSEALG["ML_DSA_44"] = -48] = "ML_DSA_44";
	COSEALG[COSEALG["ML_DSA_65"] = -49] = "ML_DSA_65";
	COSEALG[COSEALG["ML_DSA_87"] = -50] = "ML_DSA_87";
	COSEALG[COSEALG["RS256"] = -257] = "RS256";
	COSEALG[COSEALG["RS384"] = -258] = "RS384";
	COSEALG[COSEALG["RS512"] = -259] = "RS512";
	COSEALG[COSEALG["RS1"] = -65535] = "RS1";
})(COSEALG || (COSEALG = {}));
function isCOSEAlg(alg) {
	return Object.values(COSEALG).indexOf(alg) >= 0;
}
function isPQCCOSEAlg(alg) {
	return [
		COSEALG.ML_DSA_44,
		COSEALG.ML_DSA_65,
		COSEALG.ML_DSA_87
	].indexOf(alg) >= 0;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/mapCoseAlgToWebCryptoHashAlgName.js
/**
* Convert a COSE alg ID into a corresponding hash algorithm string value that WebCrypto APIs expect
*
* Unless otherwise specified, mappings were referenced from
* https://w3c.github.io/webcrypto/#jwk-mapping-alg
*/
function mapCoseAlgToWebCryptoHashAlgName(alg) {
	if ([COSEALG.RS1].indexOf(alg) >= 0) return "SHA-1";
	else if ([
		COSEALG.ES256,
		COSEALG.PS256,
		COSEALG.RS256
	].indexOf(alg) >= 0) return "SHA-256";
	else if ([
		COSEALG.ES384,
		COSEALG.PS384,
		COSEALG.RS384
	].indexOf(alg) >= 0) return "SHA-384";
	else if ([
		COSEALG.ES512,
		COSEALG.PS512,
		COSEALG.RS512,
		COSEALG.EdDSA
	].indexOf(alg) >= 0) return "SHA-512";
	throw new Error(`Could not map COSE alg value of ${alg} to a WebCrypto hash alg name`);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/getWebCrypto.js
var webCrypto = void 0;
/**
* Try to get an instance of the Crypto API from the current runtime. Should support Node,
* as well as others, like Deno, that implement Web APIs.
*/
function getWebCrypto() {
	return new Promise((resolve, reject) => {
		if (webCrypto) return resolve(webCrypto);
		/**
		* Naively attempt to access Crypto as a global object, which popular ESM-centric run-times
		* support (and Node v20+)
		*/
		const _globalThisCrypto = _getWebCryptoInternals.stubThisGlobalThisCrypto();
		if (_globalThisCrypto) {
			/**
			* In Deno v2.7.x, TypeScript 5.9 defines `Crypto.getRandomValues()` as the following type:
			*
			* `getRandomValues<T extends ArrayBufferView>(array: T): T;`
			*
			* However in earlier versions of TypeScript, `Crypto.getRandomValues()` is defined as such:
			*
			* `getRandomValues<T extends ArrayBufferView | null>(array: T): T;`
			*
			* Casting to `as unknown as Crypto` here (using this project's `Crypto` types extracted from
			* DOM types in an older, minimum-supported-Deno version of TypeScript) helps bridge the gap.
			*/
			webCrypto = _globalThisCrypto;
			return resolve(webCrypto);
		}
		return reject(new MissingWebCrypto());
	});
}
var MissingWebCrypto = class extends Error {
	constructor() {
		super("An instance of the Crypto API could not be located");
		this.name = "MissingWebCrypto";
	}
};
var _getWebCryptoInternals = {
	stubThisGlobalThisCrypto: () => globalThis.crypto,
	setCachedCrypto: (newCrypto) => {
		webCrypto = newCrypto;
	}
};
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/digest.js
/**
* Generate a digest of the provided data.
*
* @param data The data to generate a digest of
* @param algorithm A COSE algorithm ID that maps to a desired SHA algorithm
*/
async function digest(data, algorithm) {
	const WebCrypto = await getWebCrypto();
	const subtleAlgorithm = mapCoseAlgToWebCryptoHashAlgName(algorithm);
	const hashed = await WebCrypto.subtle.digest(subtleAlgorithm, data);
	return new Uint8Array(hashed);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/getRandomValues.js
/**
* Fill up the provided bytes array with random bytes equal to its length.
*
* @returns the same bytes array passed into the method
*/
async function getRandomValues(array) {
	(await getWebCrypto()).getRandomValues(array);
	return array;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/convertAAGUIDToString.js
/**
* Convert the aaguid buffer in authData into a UUID string
*/
function convertAAGUIDToString(aaguid) {
	const hex = toHex(aaguid);
	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20, 32)
	].join("-");
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/convertCOSEtoPKCS.js
/**
* Takes COSE-encoded public key and converts it to PKCS key
*/
function convertCOSEtoPKCS(cosePublicKey) {
	const struct = decodeFirst(cosePublicKey);
	const tag = Uint8Array.from([4]);
	const x = struct.get(COSEKEYS.x);
	const y = struct.get(COSEKEYS.y);
	if (!x) throw new Error("COSE public key was missing x");
	if (y) return concat([
		tag,
		x,
		y
	]);
	return concat([tag, x]);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/decodeAttestationObject.js
/**
* Convert an AttestationObject buffer to a proper object
*
* @param base64AttestationObject Attestation Object buffer
*/
function decodeAttestationObject(attestationObject) {
	return _decodeAttestationObjectInternals.stubThis(decodeFirst(attestationObject));
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _decodeAttestationObjectInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/decodeClientDataJSON.js
/**
* Decode an authenticator's base64url-encoded clientDataJSON to JSON
*/
function decodeClientDataJSON(data) {
	const toString = toUTF8String$1(data);
	const clientData = JSON.parse(toString);
	return _decodeClientDataJSONInternals.stubThis(clientData);
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _decodeClientDataJSONInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/decodeCredentialPublicKey.js
function decodeCredentialPublicKey(publicKey) {
	return _decodeCredentialPublicKeyInternals.stubThis(decodeFirst(publicKey));
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _decodeCredentialPublicKeyInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/generateChallenge.js
/**
* Generate a suitably random value to be used as an attestation or assertion challenge
*/
async function generateChallenge() {
	/**
	* WebAuthn spec says that 16 bytes is a good minimum:
	*
	* "In order to prevent replay attacks, the challenges MUST contain enough entropy to make
	* guessing them infeasible. Challenges SHOULD therefore be at least 16 bytes long."
	*
	* Just in case, let's double it
	*/
	const challenge = /* @__PURE__ */ new Uint8Array(32);
	await getRandomValues(challenge);
	return _generateChallengeInternals.stubThis(challenge);
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _generateChallengeInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/generateUserID.js
/**
* Generate a suitably random value to be used as user ID
*/
async function generateUserID() {
	/**
	* WebAuthn spec says user.id has a max length of 64 bytes. I prefer how 32 random bytes look
	* after they're base64url-encoded so I'm choosing to go with that here.
	*/
	const newUserID = /* @__PURE__ */ new Uint8Array(32);
	await getRandomValues(newUserID);
	return _generateUserIDInternals.stubThis(newUserID);
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _generateUserIDInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/getCertificateInfo.js
var issuerSubjectIDKey = {
	"2.5.4.6": "C",
	"2.5.4.10": "O",
	"2.5.4.11": "OU",
	"2.5.4.3": "CN"
};
/**
* Extract PEM certificate info
*
* @param pemCertificate Result from call to `convertASN1toPEM(x5c[0])`
*/
function getCertificateInfo(leafCertBuffer) {
	const x509 = AsnParser.parse(leafCertBuffer, Certificate);
	const parsedCert = x509.tbsCertificate;
	const issuer = { combined: "" };
	parsedCert.issuer.forEach(([iss]) => {
		const key = issuerSubjectIDKey[iss.type];
		if (key) issuer[key] = iss.value.toString();
	});
	issuer.combined = issuerSubjectToString(issuer);
	const subject = { combined: "" };
	parsedCert.subject.forEach(([iss]) => {
		const key = issuerSubjectIDKey[iss.type];
		if (key) subject[key] = iss.value.toString();
	});
	subject.combined = issuerSubjectToString(subject);
	let basicConstraintsCA = false;
	if (parsedCert.extensions) {
		for (const ext of parsedCert.extensions) if (ext.extnID === id_ce_basicConstraints) basicConstraintsCA = AsnParser.parse(ext.extnValue, BasicConstraints).cA;
	}
	return {
		issuer,
		subject,
		version: parsedCert.version,
		basicConstraintsCA,
		notBefore: parsedCert.validity.notBefore.getTime(),
		notAfter: parsedCert.validity.notAfter.getTime(),
		parsedCertificate: x509
	};
}
/**
* Stringify the parts of Issuer or Subject info for easier comparison of subject issuers with
* issuer subjects.
*
* The order might seem arbitrary, because it is. It should be enough that the two are stringified
* in the same order.
*/
function issuerSubjectToString(input) {
	const parts = [];
	if (input.C) parts.push(input.C);
	if (input.O) parts.push(input.O);
	if (input.OU) parts.push(input.OU);
	if (input.CN) parts.push(input.CN);
	return parts.join(" : ");
}
require_Reflect();
/**
* A simple method for requesting data via standard `fetch`. Should work
* across multiple runtimes.
*/
function fetch(url) {
	return _fetchInternals.stubThis(url);
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _fetchInternals = { stubThis: (url) => globalThis.fetch(url) };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/isCertRevoked.js
var cacheRevokedCerts = {};
/**
* A method to pull a CRL from a certificate and compare its serial number to the list of revoked
* certificate serial numbers within the CRL.
*
* CRL certificate structure referenced from https://tools.ietf.org/html/rfc5280#page-117
*/
async function isCertRevoked(certificate, issuer) {
	if (!issuer) return false;
	const { extensions } = certificate;
	if (!extensions) return false;
	const extCRLDistributionPoints = extensions.find((ext) => ext instanceof CRLDistributionPointsExtension);
	const crlURLs = [];
	extCRLDistributionPoints?.distributionPoints?.forEach((dPoint) => {
		dPoint.distributionPoint?.fullName?.forEach((fullName) => {
			if (fullName.uniformResourceIdentifier) crlURLs.push(fullName.uniformResourceIdentifier);
		});
	});
	if (!(crlURLs.length > 0)) return false;
	const { keyIdentifier: issuerKeyIdentifier, fromExtension: issuerKeyIdentifierFromExtension } = await getIssuerKeyIdentifier(issuer);
	const certificateExtAuthorityKeyID = certificate.extensions.find((ext) => ext instanceof AuthorityKeyIdentifierExtension);
	if (issuerKeyIdentifierFromExtension && certificateExtAuthorityKeyID?.keyId && certificateExtAuthorityKeyID.keyId !== issuerKeyIdentifier) throw new Error(`Certificate's AuthorityKeyIdentifier did not match issuer's SubjectKeyIdentifier "${issuerKeyIdentifier}"`);
	for (const crlURL of crlURLs) {
		const cacheKey = `${issuerKeyIdentifier}|${crlURL}`;
		const cached = cacheRevokedCerts[cacheKey];
		if (cached) {
			const now = /* @__PURE__ */ new Date();
			if (!cached.nextUpdate || cached.nextUpdate > now) return cached.revokedCerts.indexOf(certificate.serialNumber) >= 0;
		}
		let crlBytes;
		try {
			crlBytes = await (await fetch(crlURL)).arrayBuffer();
		} catch (_err) {
			continue;
		}
		let certCRL;
		try {
			certCRL = new X509Crl(crlBytes);
		} catch (_err) {
			continue;
		}
		if (!await certCRL.verify({ publicKey: issuer.publicKey })) throw new Error(`CRL from ${crlURL} failed signature verification against issuer "${issuer.subject}"`);
		const crlAKI = certCRL.getExtension(AuthorityKeyIdentifierExtension);
		if (issuerKeyIdentifierFromExtension && crlAKI?.keyId && crlAKI.keyId !== issuerKeyIdentifier) throw new Error(`CRL from ${crlURL} contained an AuthorityKeyIdentifier that did not match issuer's SubjectKeyIdentifier "${issuerKeyIdentifier}"`);
		if (certCRL.nextUpdate) cacheRevokedCerts[cacheKey] = {
			revokedCerts: certCRL.entries.map((entry) => entry.serialNumber),
			nextUpdate: certCRL.nextUpdate
		};
		if (certCRL.findRevoked(certificate)) return true;
	}
	return false;
}
/**
* Determine a unique key ID for the issuer certificate, based either on its
* SubjectKeyIdentifierExtension or by generating the same value using the issuer's public key
*/
async function getIssuerKeyIdentifier(issuer) {
	const issuerSKI = issuer.extensions?.find((ext) => ext instanceof SubjectKeyIdentifierExtension);
	if (issuerSKI?.keyId) return {
		keyIdentifier: issuerSKI.keyId,
		fromExtension: true
	};
	return {
		keyIdentifier: (await SubjectKeyIdentifierExtension.create(issuer.publicKey)).keyId,
		fromExtension: false
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/decodeAuthenticatorExtensions.js
/**
* Convert authenticator extension data buffer to a proper object
*
* @param extensionData Authenticator Extension Data buffer
*/
function decodeAuthenticatorExtensions(extensionData) {
	let toCBOR;
	try {
		toCBOR = decodeFirst(extensionData);
	} catch (err) {
		throw new Error(`Error decoding authenticator extensions: ${err.message}`);
	}
	return convertMapToObjectDeep(toCBOR);
}
/**
* CBOR-encoded extensions can be deeply-nested Maps, which are too deep for a simple
* `Object.entries()`. This method will recursively make sure that all Maps are converted into
* basic objects.
*/
function convertMapToObjectDeep(input) {
	const mapped = {};
	for (const [key, value] of input) if (value instanceof Map) mapped[key] = convertMapToObjectDeep(value);
	else mapped[key] = value;
	return mapped;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/parseAuthenticatorData.js
/**
* Make sense of the authData buffer contained in an Attestation
*/
function parseAuthenticatorData(authData) {
	if (authData.byteLength < 37) throw new Error(`Authenticator data was ${authData.byteLength} bytes, expected at least 37 bytes`);
	let pointer = 0;
	const dataView = toDataView(authData);
	const rpIdHash = authData.slice(pointer, pointer += 32);
	const flagsBuf = authData.slice(pointer, pointer += 1);
	const flagsInt = flagsBuf[0];
	const flags = {
		up: !!(flagsInt & 1),
		uv: !!(flagsInt & 4),
		be: !!(flagsInt & 8),
		bs: !!(flagsInt & 16),
		at: !!(flagsInt & 64),
		ed: !!(flagsInt & 128),
		flagsInt
	};
	const counterBuf = authData.slice(pointer, pointer + 4);
	const counter = dataView.getUint32(pointer, false);
	pointer += 4;
	let aaguid = void 0;
	let credentialID = void 0;
	let credentialPublicKey = void 0;
	if (flags.at) {
		aaguid = authData.slice(pointer, pointer += 16);
		const credIDLen = dataView.getUint16(pointer);
		pointer += 2;
		credentialID = authData.slice(pointer, pointer += credIDLen);
		/**
		* Firefox 117 incorrectly CBOR-encodes authData when EdDSA (-8) is used for the public key.
		* A CBOR "Map of 3 items" (0xa3) should be "Map of 4 items" (0xa4), and if we manually adjust
		* the single byte there's a good chance the authData can be correctly parsed.
		*
		* This browser release also incorrectly uses the string labels "OKP" and "Ed25519" instead of
		* their integer representations for kty and crv respectively. That's why the COSE public key
		* in the hex below looks so odd.
		*/
		const badEdDSACBOR = fromHex("a301634f4b500327206745643235353139");
		const bytesAtCurrentPosition = authData.slice(pointer, pointer + badEdDSACBOR.byteLength);
		let foundBadCBOR = false;
		if (areEqual(badEdDSACBOR, bytesAtCurrentPosition)) {
			foundBadCBOR = true;
			authData[pointer] = 164;
		}
		const firstDecoded = decodeFirst(authData.slice(pointer));
		const firstEncoded = Uint8Array.from(
			/**
			* Casting to `Map` via `as unknown` here because TS doesn't make it possible to define Maps
			* with discrete keys and properties with known types per pair, and CBOR libs typically parse
			* CBOR Major Type 5 to `Map` because you can have numbers for keys. A `COSEPublicKey` can be
			* generalized as "a Map with numbers for keys and either numbers or bytes for values" though.
			* If this presumption falls apart then other parts of verification later on will fail so we
			* should be safe doing this here.
			*/
			encode(firstDecoded)
		);
		if (foundBadCBOR) authData[pointer] = 163;
		credentialPublicKey = firstEncoded;
		pointer += firstEncoded.byteLength;
	}
	let extensionsData = void 0;
	let extensionsDataBuffer = void 0;
	if (flags.ed) {
		const firstDecoded = decodeFirst(authData.slice(pointer));
		extensionsDataBuffer = Uint8Array.from(encode(firstDecoded));
		extensionsData = decodeAuthenticatorExtensions(extensionsDataBuffer);
		pointer += extensionsDataBuffer.byteLength;
	}
	if (authData.byteLength > pointer) throw new Error("Leftover bytes detected while parsing authenticator data");
	return _parseAuthenticatorDataInternals.stubThis({
		rpIdHash,
		flagsBuf,
		flags,
		counter,
		counterBuf,
		aaguid,
		credentialID,
		credentialPublicKey,
		extensionsData,
		extensionsDataBuffer
	});
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _parseAuthenticatorDataInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/toHash.js
/**
* Returns hash digest of the given data, using the given algorithm when provided. Defaults to using
* SHA-256.
*/
function toHash(data, algorithm = -7) {
	if (typeof data === "string") data = fromUTF8String(data);
	return digest(data, algorithm);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/mapCoseAlgToWebCryptoKeyAlgName.js
/**
* Convert a COSE alg ID into a corresponding key algorithm string value that WebCrypto APIs expect
*
* Unless otherwise specified, mappings were referenced from
* https://w3c.github.io/webcrypto/#jwk-mapping-alg
*/
function mapCoseAlgToWebCryptoKeyAlgName(alg) {
	if ([COSEALG.EdDSA].indexOf(alg) >= 0) return "Ed25519";
	else if ([
		COSEALG.ES256,
		COSEALG.ES384,
		COSEALG.ES512,
		COSEALG.ES256K
	].indexOf(alg) >= 0) return "ECDSA";
	else if ([
		COSEALG.RS256,
		COSEALG.RS384,
		COSEALG.RS512,
		COSEALG.RS1
	].indexOf(alg) >= 0) return "RSASSA-PKCS1-v1_5";
	else if ([
		COSEALG.PS256,
		COSEALG.PS384,
		COSEALG.PS512
	].indexOf(alg) >= 0) return "RSA-PSS";
	else if ([COSEALG.ML_DSA_44].indexOf(alg) >= 0) return "ML-DSA-44";
	else if ([COSEALG.ML_DSA_65].indexOf(alg) >= 0) return "ML-DSA-65";
	else if ([COSEALG.ML_DSA_87].indexOf(alg) >= 0) return "ML-DSA-87";
	throw new Error(`Could not map COSE alg value of ${alg} to a WebCrypto key alg name`);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/errors/index.js
/**
* Base error class that helps disambiguate SimpleWebAuthn library errors from other library errors
*/
var SimpleWebAuthnError = class extends Error {
	constructor({ message, code, cause }) {
		super(message, { cause });
		Object.defineProperty(this, "code", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.name = "SimpleWebAuthnError";
		this.code = code;
	}
};
var PQCNotSupportedError = class extends SimpleWebAuthnError {
	constructor(alg) {
		const message = `This runtime's WebCrypto.subtle does not support use of ${mapCoseAlgToWebCryptoKeyAlgName(alg)}`;
		super({
			message,
			code: "RUNTIME_NO_PQC_SUPPORT"
		});
	}
};
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/validateCertificatePath.js
/**
* Traverse an array of PEM certificates and ensure they form a proper chain
* @param x5cCertsPEM Typically the result of `x5c.map(convertASN1toPEM)`
* @param trustAnchorsPEM PEM-formatted certs that an attestation statement x5c may chain back to
*/
async function validateCertificatePath(x5cCertsPEM, trustAnchorsPEM = []) {
	if (trustAnchorsPEM.length === 0) return true;
	const trustAnchorsParsed = trustAnchorsPEM.map((certPEM) => {
		try {
			return new X509Certificate(certPEM);
		} catch (err) {
			throw new SimpleWebAuthnError({
				message: `Could not parse trust anchor certificate:\n${certPEM}`,
				code: "CERTIFICATE_PATH_VERIFICATION_FAILED",
				cause: err
			});
		}
	});
	const validTrustAnchors = [];
	for (let i = 0; i < trustAnchorsParsed.length; i++) {
		const cert = trustAnchorsParsed[i];
		try {
			assertCertIsWithinValidTimeWindow(cert);
		} catch (_err) {
			continue;
		}
		validTrustAnchors.push(cert);
	}
	if (validTrustAnchors.length === 0) throw new SimpleWebAuthnError({
		message: "No specified trust anchor was valid for verifying x5c",
		code: "CERTIFICATE_PATH_VERIFICATION_FAILED"
	});
	const x5cCertsParsed = x5cCertsPEM.map((certPEM) => new X509Certificate(certPEM));
	const x5cLeafCert = x5cCertsParsed[0];
	let x5cIntermediates = [];
	if (x5cCertsParsed.length > 1) x5cIntermediates = x5cCertsParsed.slice(1);
	let invalidCertificateChain = true;
	let validatedChain = void 0;
	for (const anchor of validTrustAnchors) try {
		const x5cWithTrustAnchor = x5cCertsParsed.concat([anchor]);
		if (new Set(x5cWithTrustAnchor.map((cert) => cert.toString("pem"))).size !== x5cWithTrustAnchor.length) throw new SimpleWebAuthnError({
			message: "Invalid certificate path: found duplicate certificates",
			code: "CERTIFICATE_PATH_VERIFICATION_FAILED"
		});
		const chain = await new X509ChainBuilder({ certificates: [...x5cIntermediates, anchor] }).build(x5cLeafCert);
		const lastCertEqualsAnchor = chain[chain.length - 1].equal(anchor);
		let certBeforeLastSignedByAnchor = false;
		if (!lastCertEqualsAnchor && chain.length > 1) certBeforeLastSignedByAnchor = await chain[chain.length - 2].verify({
			publicKey: anchor.publicKey,
			signatureOnly: true
		});
		if (!(lastCertEqualsAnchor || certBeforeLastSignedByAnchor)) continue;
		if (certBeforeLastSignedByAnchor)
 /**
		* Swap out the last cert in the chain with the anchor that we've already verified
		* chains to the second-to-last certificate. This makes it easier to verify the chain
		* as a standard certificate chain.
		*/
		chain[chain.length - 1] = anchor;
		invalidCertificateChain = false;
		validatedChain = chain;
		break;
	} catch (err) {
		throw new SimpleWebAuthnError({
			message: "Unexpected error while validating certificate path",
			code: "CERTIFICATE_PATH_VERIFICATION_FAILED",
			cause: err
		});
	}
	if (validatedChain) for (let i = 0; i < validatedChain.length; i++) {
		const cert = validatedChain[i];
		try {
			assertCertIsWithinValidTimeWindow(cert);
		} catch (_err) {
			throw new SimpleWebAuthnError({
				message: `Found certificate out of validity period:\n${cert.toString()}`,
				code: "CERTIFICATE_PATH_VERIFICATION_FAILED"
			});
		}
		/**
		* Checking revocation is very expensive so do it only at the end when we're certain a cert
		* is otherwise valid
		*/
		let issuerCert = void 0;
		if (i < validatedChain.length - 1) issuerCert = validatedChain[i + 1];
		else if (await cert.isSelfSigned()) issuerCert = cert;
		try {
			await assertCertNotRevoked(cert, issuerCert);
		} catch (err) {
			throw new SimpleWebAuthnError({
				message: `The following certificate failed revocation status check\n${cert.toString()}`,
				code: "CERTIFICATE_PATH_VERIFICATION_FAILED",
				cause: err
			});
		}
	}
	else invalidCertificateChain = true;
	if (invalidCertificateChain) throw new SimpleWebAuthnError({
		message: "x5c could not be chained to any specified trust anchor",
		code: "CERTIFICATE_PATH_VERIFICATION_FAILED"
	});
	return true;
}
/**
* Check if the certificate is revoked or not. If it is, raise an error
*
* @throws Error - Wrap this in a SimpleWebAuthnError so RPs can identify issues here
*/
async function assertCertNotRevoked(certificate, issuerCert) {
	if (await isCertRevoked(certificate, issuerCert)) throw new Error("Found revoked certificate in certificate path");
}
/**
* Require the cert to be within its notBefore and notAfter time window
*/
function assertCertIsWithinValidTimeWindow(certificate) {
	const { notBefore: certNotBefore, notAfter: certNotAfter } = certificate;
	const now = new Date(Date.now());
	if (certNotBefore > now || certNotAfter < now) throw new Error("Certificate is not yet valid or expired");
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/mapX509SignatureAlgToCOSEAlg.js
/**
* Map X.509 signature algorithm OIDs to COSE algorithm IDs
*/
function mapX509SignatureAlgToCOSEAlg(signatureAlgorithm) {
	let alg;
	if (signatureAlgorithm === "1.2.840.10045.4.3.2") alg = COSEALG.ES256;
	else if (signatureAlgorithm === "1.2.840.10045.4.3.3") alg = COSEALG.ES384;
	else if (signatureAlgorithm === "1.2.840.10045.4.3.4") alg = COSEALG.ES512;
	else if (signatureAlgorithm === id_sha256WithRSAEncryption) alg = COSEALG.RS256;
	else if (signatureAlgorithm === id_sha384WithRSAEncryption) alg = COSEALG.RS384;
	else if (signatureAlgorithm === id_sha512WithRSAEncryption) alg = COSEALG.RS512;
	else if (signatureAlgorithm === id_sha1WithRSAEncryption) alg = COSEALG.RS1;
	else if (signatureAlgorithm === id_ml_dsa_44) alg = COSEALG.ML_DSA_44;
	else if (signatureAlgorithm === id_ml_dsa_65) alg = COSEALG.ML_DSA_65;
	else if (signatureAlgorithm === id_ml_dsa_87) alg = COSEALG.ML_DSA_87;
	else throw new Error(`Unable to map X.509 signature algorithm ${signatureAlgorithm} to a COSE algorithm`);
	return alg;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/convertX509PublicKeyToCOSE.js
function convertX509PublicKeyToCOSE(x509Certificate) {
	let cosePublicKey = /* @__PURE__ */ new Map();
	const { tbsCertificate } = AsnParser.parse(x509Certificate, Certificate);
	const { subjectPublicKeyInfo } = tbsCertificate;
	const publicKeyAlgorithmID = subjectPublicKeyInfo.algorithm.algorithm;
	if (publicKeyAlgorithmID === "1.2.840.10045.2.1") {
		/**
		* EC2 Public Key
		*/
		if (!subjectPublicKeyInfo.algorithm.parameters) throw new Error("Certificate public key was missing parameters (EC2)");
		const ecParameters = AsnParser.parse(new Uint8Array(subjectPublicKeyInfo.algorithm.parameters), ECParameters);
		let alg;
		let crv;
		const { namedCurve } = ecParameters;
		if (namedCurve === "1.2.840.10045.3.1.7") {
			alg = COSEALG.ES256;
			crv = COSECRV.P256;
		} else if (namedCurve === "1.3.132.0.34") {
			alg = COSEALG.ES384;
			crv = COSECRV.P384;
		} else throw new Error(`Certificate public key contained unexpected namedCurve ${namedCurve} (EC2)`);
		const subjectPublicKey = new Uint8Array(subjectPublicKeyInfo.subjectPublicKey);
		let x;
		let y;
		if (subjectPublicKey[0] === 4) {
			let pointer = 1;
			const halfLength = (subjectPublicKey.length - 1) / 2;
			x = subjectPublicKey.slice(pointer, pointer += halfLength);
			y = subjectPublicKey.slice(pointer);
		} else throw new Error("TODO: Figure out how to handle public keys in \"compressed form\"");
		const coseEC2PubKey = /* @__PURE__ */ new Map();
		coseEC2PubKey.set(COSEKEYS.kty, COSEKTY.EC2);
		coseEC2PubKey.set(COSEKEYS.alg, alg);
		coseEC2PubKey.set(COSEKEYS.crv, crv);
		coseEC2PubKey.set(COSEKEYS.x, x);
		coseEC2PubKey.set(COSEKEYS.y, y);
		cosePublicKey = coseEC2PubKey;
	} else if (publicKeyAlgorithmID === id_rsaEncryption) {
		/**
		* RSA public key
		*/
		const rsaPublicKey = AsnParser.parse(subjectPublicKeyInfo.subjectPublicKey, RSAPublicKey);
		const coseRSAPubKey = /* @__PURE__ */ new Map();
		coseRSAPubKey.set(COSEKEYS.kty, COSEKTY.RSA);
		/**
		* The algorithm ID is too ambiguous to know what this alg should really be. But practically
		* speaking `shaHashOverride` is always specified when verifying signatures with RSA public keys
		* which ultimately overrides this sensible default. Using RS256 also gets the correct WebCrypto
		* alg name later on in verifyRSA.ts
		*/
		coseRSAPubKey.set(COSEKEYS.alg, COSEALG.RS256);
		coseRSAPubKey.set(COSEKEYS.n, new Uint8Array(rsaPublicKey.modulus));
		coseRSAPubKey.set(COSEKEYS.e, new Uint8Array(rsaPublicKey.publicExponent));
		cosePublicKey = coseRSAPubKey;
	} else if ([
		id_ml_dsa_44,
		id_ml_dsa_65,
		id_ml_dsa_87
	].indexOf(publicKeyAlgorithmID) >= 0) {
		const coseAKPPubKey = /* @__PURE__ */ new Map();
		coseAKPPubKey.set(COSEKEYS.kty, COSEKTY.AKP);
		coseAKPPubKey.set(COSEKEYS.alg, mapX509SignatureAlgToCOSEAlg(publicKeyAlgorithmID));
		coseAKPPubKey.set(COSEKEYS.pub, new Uint8Array(subjectPublicKeyInfo.subjectPublicKey));
		cosePublicKey = coseAKPPubKey;
	} else throw new Error(`Certificate public key contained unexpected algorithm ID ${publicKeyAlgorithmID}`);
	return cosePublicKey;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/verifySignature.js
/**
* Verify an authenticator's signature
*/
function verifySignature(opts) {
	const { signature, data, credentialPublicKey, x509Certificate, hashAlgorithm } = opts;
	if (!x509Certificate && !credentialPublicKey) throw new Error("Must declare either \"leafCert\" or \"credentialPublicKey\"");
	if (x509Certificate && credentialPublicKey) throw new Error("Must not declare both \"leafCert\" and \"credentialPublicKey\"");
	let cosePublicKey = /* @__PURE__ */ new Map();
	if (credentialPublicKey) cosePublicKey = decodeCredentialPublicKey(credentialPublicKey);
	else if (x509Certificate) cosePublicKey = convertX509PublicKeyToCOSE(x509Certificate);
	return _verifySignatureInternals.stubThis(verify({
		cosePublicKey,
		signature,
		data,
		shaHashOverride: hashAlgorithm
	}));
}
/**
* Make it possible to stub the return value during testing
* @ignore Don't include this in docs output
*/
var _verifySignatureInternals = { stubThis: (value) => value };
//#endregion
//#region node_modules/@simplewebauthn/server/esm/metadata/parseJWT.js
/**
* Process a JWT into Javascript-friendly data structures
*/
function parseJWT(jwt) {
	const parts = jwt.split(".");
	return [
		JSON.parse(toUTF8String$1(parts[0])),
		JSON.parse(toUTF8String$1(parts[1])),
		parts[2]
	];
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/mapJWSAlgToCOSEAlg.js
/**
* Map JWS algorithms to COSE algorithm IDs
*
* See https://www.rfc-editor.org/rfc/rfc7518.html#section-3.1 for possible values
*/
function mapJWSAlgToCOSEAlg(alg) {
	let algCOSE;
	if (alg === "ES256") algCOSE = COSEALG.ES256;
	else if (alg === "ES384") algCOSE = COSEALG.ES384;
	else if (alg === "ES512") algCOSE = COSEALG.ES512;
	else if (alg === "RS256") algCOSE = COSEALG.RS256;
	else if (alg === "RS384") algCOSE = COSEALG.RS384;
	else if (alg === "RS512") algCOSE = COSEALG.RS512;
	else throw new Error(`Unable to map JWS algorithm "${alg}" to a COSE algorithm`);
	return algCOSE;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/importJWKKey.js
/**
* Convert a JWK-formatted public key into a WebCrypto CryptoKey that can be used for
* signature verification
*/
async function importJWKKey(opts) {
	const WebCrypto = await getWebCrypto();
	const { keyData, algorithm } = opts;
	return WebCrypto.subtle.importKey("jwk", keyData, algorithm, false, ["verify"]);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyEC2.js
/**
* Verify a signature using an EC2 public key
*/
async function verifyEC2(opts) {
	const { cosePublicKey, signature, data, shaHashOverride } = opts;
	const WebCrypto = await getWebCrypto();
	const alg = cosePublicKey.get(COSEKEYS.alg);
	const crv = cosePublicKey.get(COSEKEYS.crv);
	const x = cosePublicKey.get(COSEKEYS.x);
	const y = cosePublicKey.get(COSEKEYS.y);
	if (!alg) throw new Error("Public key was missing alg (EC2)");
	if (!crv) throw new Error("Public key was missing crv (EC2)");
	if (!x) throw new Error("Public key was missing x (EC2)");
	if (!y) throw new Error("Public key was missing y (EC2)");
	let _crv;
	if (crv === COSECRV.P256) _crv = "P-256";
	else if (crv === COSECRV.P384) _crv = "P-384";
	else if (crv === COSECRV.P521) _crv = "P-521";
	else throw new Error(`Unexpected COSE crv value of ${crv} (EC2)`);
	const key = await importJWKKey({
		keyData: {
			kty: "EC",
			crv: _crv,
			x: fromBuffer(x),
			y: fromBuffer(y),
			ext: false
		},
		algorithm: {
			/**
			* Note to future self: you can't use `mapCoseAlgToWebCryptoKeyAlgName()` here because some
			* leaf certs from actual devices specified an RSA SHA value for `alg` (e.g. `-257`) which
			* would then map here to `'RSASSA-PKCS1-v1_5'`. We always want `'ECDSA'` here so we'll
			* hard-code this.
			*/
			name: "ECDSA",
			namedCurve: _crv
		}
	});
	let subtleAlg = mapCoseAlgToWebCryptoHashAlgName(alg);
	if (shaHashOverride) subtleAlg = mapCoseAlgToWebCryptoHashAlgName(shaHashOverride);
	const verifyAlgorithm = {
		name: "ECDSA",
		hash: { name: subtleAlg }
	};
	return WebCrypto.subtle.verify(verifyAlgorithm, key, signature, data);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyRSA.js
/**
* Verify a signature using an RSA public key
*/
async function verifyRSA(opts) {
	const { cosePublicKey, signature, data, shaHashOverride } = opts;
	const WebCrypto = await getWebCrypto();
	const alg = cosePublicKey.get(COSEKEYS.alg);
	const n = cosePublicKey.get(COSEKEYS.n);
	const e = cosePublicKey.get(COSEKEYS.e);
	if (!alg) throw new Error("Public key was missing alg (RSA)");
	if (!isCOSEAlg(alg)) throw new Error(`Public key had invalid alg ${alg} (RSA)`);
	if (!n) throw new Error("Public key was missing n (RSA)");
	if (!e) throw new Error("Public key was missing e (RSA)");
	const keyData = {
		kty: "RSA",
		alg: "",
		n: fromBuffer(n),
		e: fromBuffer(e),
		ext: false
	};
	const keyAlgorithm = {
		name: mapCoseAlgToWebCryptoKeyAlgName(alg),
		hash: { name: mapCoseAlgToWebCryptoHashAlgName(alg) }
	};
	const verifyAlgorithm = { name: mapCoseAlgToWebCryptoKeyAlgName(alg) };
	if (shaHashOverride) keyAlgorithm.hash.name = mapCoseAlgToWebCryptoHashAlgName(shaHashOverride);
	if (keyAlgorithm.name === "RSASSA-PKCS1-v1_5") {
		if (keyAlgorithm.hash.name === "SHA-256") keyData.alg = "RS256";
		else if (keyAlgorithm.hash.name === "SHA-384") keyData.alg = "RS384";
		else if (keyAlgorithm.hash.name === "SHA-512") keyData.alg = "RS512";
		else if (keyAlgorithm.hash.name === "SHA-1") keyData.alg = "RS1";
	} else if (keyAlgorithm.name === "RSA-PSS") {
		/**
		* salt length. The default value is 20 but the convention is to use hLen, the length of the
		* output of the hash function in bytes. A salt length of zero is permitted and will result in
		* a deterministic signature value. The actual salt length used can be determined from the
		* signature value.
		*
		* From https://www.cryptosys.net/pki/manpki/pki_rsaschemes.html
		*/
		let saltLength = 0;
		if (keyAlgorithm.hash.name === "SHA-256") {
			keyData.alg = "PS256";
			saltLength = 32;
		} else if (keyAlgorithm.hash.name === "SHA-384") {
			keyData.alg = "PS384";
			saltLength = 48;
		} else if (keyAlgorithm.hash.name === "SHA-512") {
			keyData.alg = "PS512";
			saltLength = 64;
		}
		verifyAlgorithm.saltLength = saltLength;
	} else throw new Error(`Unexpected RSA key algorithm ${alg} (${keyAlgorithm.name})`);
	const key = await importJWKKey({
		keyData,
		algorithm: keyAlgorithm
	});
	return WebCrypto.subtle.verify(verifyAlgorithm, key, signature, data);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/metadata/verifyJWT.js
/**
* Lightweight verification for FIDO MDS JWTs. Supports use of EC2 and RSA.
*
* If this ever needs to support more JWS algorithms, here's the list of them:
*
* https://www.rfc-editor.org/rfc/rfc7518.html#section-3.1
*
* (Pulled from https://www.rfc-editor.org/rfc/rfc7515#section-4.1.1)
*/
function verifyJWT(jwt, leafCert) {
	const [header, payload, signature] = jwt.split(".");
	const certCOSE = convertX509PublicKeyToCOSE(leafCert);
	const data = fromUTF8String(`${header}.${payload}`);
	const signatureBytes = toBuffer(signature);
	const jwtHeaderHashAlgCOSE = mapJWSAlgToCOSEAlg(JSON.parse(toUTF8String$1(header)).alg);
	if (isCOSEPublicKeyEC2(certCOSE)) return verifyEC2({
		data,
		signature: signatureBytes,
		cosePublicKey: certCOSE,
		shaHashOverride: jwtHeaderHashAlgCOSE
	});
	else if (isCOSEPublicKeyRSA(certCOSE)) return verifyRSA({
		data,
		signature: signatureBytes,
		cosePublicKey: certCOSE,
		shaHashOverride: jwtHeaderHashAlgCOSE
	});
	const kty = certCOSE.get(COSEKEYS.kty);
	throw new Error(`JWT verification with public key of kty ${kty} is not supported by this method`);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/convertPEMToBytes.js
/**
* Take a certificate in PEM format and convert it to bytes
*/
function convertPEMToBytes(pem) {
	return toBuffer(pem.replace("-----BEGIN CERTIFICATE-----", "").replace("-----END CERTIFICATE-----", "").replace(/[\n ]/g, ""), "base64");
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/metadata/verifyMDSBlob.js
/**
* Perform authenticity and integrity verification of a
* [FIDO Metadata Service (MDS)](https://fidoalliance.org/metadata/)-compatible blob, and then
* extract the FIDO2 metadata statements included within. This method will make network requests
* for things like CRL checks.
*
* @param blob - A JWT downloaded from an MDS server (e.g. https://mds3.fidoalliance.org)
*/
async function verifyMDSBlob(blob) {
	const parsedJWT = parseJWT(blob);
	const header = parsedJWT[0];
	const payload = parsedJWT[1];
	const headerCertsPEM = header.x5c.map(convertCertBufferToPEM);
	try {
		await validateCertificatePath(headerCertsPEM, SettingsService.getRootCertificates({ identifier: "mds" }));
	} catch (error) {
		throw new Error("BLOB certificate path could not be validated", { cause: error });
	}
	const leafCert = headerCertsPEM[0];
	if (!await verifyJWT(blob, convertPEMToBytes(leafCert))) throw new Error("BLOB signature could not be verified");
	const statements = [];
	for (const entry of payload.entries) if (entry.aaguid && entry.metadataStatement) statements.push(entry.metadataStatement);
	const [year, month, day] = payload.nextUpdate.split("-");
	return {
		statements,
		parsedNextUpdate: new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)),
		payload
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyAKP.js
/** AKP, a.k.a ML-DSA */
async function verifyAKP(opts) {
	const { cosePublicKey, signature, data } = opts;
	const WebCrypto = await getWebCrypto();
	const alg = cosePublicKey.get(COSEKEYS.alg);
	const pub = cosePublicKey.get(COSEKEYS.pub);
	if (!alg) throw new Error("Public key was missing alg (AKP)");
	if (!isCOSEAlg(alg)) throw new Error(`Public key had invalid alg ${alg} (AKP)`);
	if (!pub) throw new Error("Public key was missing pub (AKP)");
	const webCryptoAlg = mapCoseAlgToWebCryptoKeyAlgName(alg);
	const keyData = {
		kty: "AKP",
		alg: webCryptoAlg,
		pub: fromBuffer(pub),
		ext: false
	};
	/**
	* ML-DSA support is pretty cutting edge, so take some steps to help RP's understand this instead
	* of them getting a `NotSupportedError: Unrecognized algorithm name` and trying to interpret it.
	*/
	let key;
	try {
		key = await importJWKKey({
			keyData,
			algorithm: webCryptoAlg
		});
	} catch (err) {
		if (err.name === "NotSupportedError") throw new PQCNotSupportedError(alg);
		else throw err;
	}
	return WebCrypto.subtle.verify(webCryptoAlg, key, signature, data);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verifyOKP.js
async function verifyOKP(opts) {
	const { cosePublicKey, signature, data } = opts;
	const WebCrypto = await getWebCrypto();
	const alg = cosePublicKey.get(COSEKEYS.alg);
	const crv = cosePublicKey.get(COSEKEYS.crv);
	const x = cosePublicKey.get(COSEKEYS.x);
	if (!alg) throw new Error("Public key was missing alg (OKP)");
	if (!isCOSEAlg(alg)) throw new Error(`Public key had invalid alg ${alg} (OKP)`);
	if (!crv) throw new Error("Public key was missing crv (OKP)");
	if (!x) throw new Error("Public key was missing x (OKP)");
	let _crv;
	if (crv === COSECRV.ED25519) _crv = "Ed25519";
	else throw new Error(`Unexpected COSE crv value of ${crv} (OKP)`);
	const key = await importJWKKey({
		keyData: {
			kty: "OKP",
			crv: _crv,
			alg: "EdDSA",
			x: fromBuffer(x),
			ext: false
		},
		algorithm: {
			name: _crv,
			namedCurve: _crv
		}
	});
	const verifyAlgorithm = { name: _crv };
	return WebCrypto.subtle.verify(verifyAlgorithm, key, signature, data);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/unwrapEC2Signature.js
/**
* In WebAuthn, EC2 signatures are wrapped in ASN.1 structure so we need to peel r and s apart.
*
* See https://www.w3.org/TR/webauthn-2/#sctn-signature-attestation-types
*/
function unwrapEC2Signature(signature, crv) {
	const parsedSignature = AsnParser.parse(signature, ECDSASigValue);
	const rBytes = new Uint8Array(parsedSignature.r);
	const sBytes = new Uint8Array(parsedSignature.s);
	const componentLength = getSignatureComponentLength(crv);
	return concat([toNormalizedBytes(rBytes, componentLength), toNormalizedBytes(sBytes, componentLength)]);
}
/**
* The SubtleCrypto Web Crypto API expects ECDSA signatures with `r` and `s` values to be encoded
* to a specific length depending on the order of the curve. This function returns the expected
* byte-length for each of the `r` and `s` signature components.
*
* See <https://www.w3.org/TR/WebCryptoAPI/#ecdsa-operations>
*/
function getSignatureComponentLength(crv) {
	switch (crv) {
		case COSECRV.P256: return 32;
		case COSECRV.P384: return 48;
		case COSECRV.P521: return 66;
		default: throw new Error(`Unexpected COSE crv value of ${crv} (EC2)`);
	}
}
/**
* Converts the ASN.1 integer representation to bytes of a specific length `n`.
*
* DER encodes integers as big-endian byte arrays, with as small as possible representation and
* requires a leading `0` byte to disambiguate between negative and positive numbers. This means
* that `r` and `s` can potentially not be the expected byte-length that is needed by the
* SubtleCrypto Web Crypto API: if there are leading `0`s it can be shorter than expected, and if
* it has a leading `1` bit, it can be one byte longer.
*
* See <https://www.itu.int/rec/T-REC-X.690-202102-I/en>
* See <https://www.w3.org/TR/WebCryptoAPI/#ecdsa-operations>
*/
function toNormalizedBytes(bytes, componentLength) {
	let normalizedBytes;
	if (bytes.length < componentLength) {
		normalizedBytes = new Uint8Array(componentLength);
		normalizedBytes.set(bytes, componentLength - bytes.length);
	} else if (bytes.length === componentLength) normalizedBytes = bytes;
	else if (bytes.length === componentLength + 1 && bytes[0] === 0 && (bytes[1] & 128) === 128) normalizedBytes = bytes.subarray(1);
	else throw new Error(`Invalid signature component length ${bytes.length}, expected ${componentLength}`);
	return normalizedBytes;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/verify.js
/**
* Verify signatures with their public key. Supports EC2 and RSA public keys.
*/
function verify(opts) {
	const { cosePublicKey, signature, data, shaHashOverride } = opts;
	if (isCOSEPublicKeyEC2(cosePublicKey)) {
		const crv = cosePublicKey.get(COSEKEYS.crv);
		if (!isCOSECrv(crv)) throw new Error(`unknown COSE curve ${crv}`);
		return verifyEC2({
			cosePublicKey,
			signature: unwrapEC2Signature(signature, crv),
			data,
			shaHashOverride
		});
	} else if (isCOSEPublicKeyRSA(cosePublicKey)) return verifyRSA({
		cosePublicKey,
		signature,
		data,
		shaHashOverride
	});
	else if (isCOSEPublicKeyOKP(cosePublicKey)) return verifyOKP({
		cosePublicKey,
		signature,
		data
	});
	else if (isCOSEPublicKeyAKP(cosePublicKey)) return verifyAKP({
		cosePublicKey,
		signature,
		data
	});
	const kty = cosePublicKey.get(COSEKEYS.kty);
	throw new Error(`Signature verification with public key of kty ${kty} is not supported by this method`);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoUint8Array.js
/**
* A runtime-agnostic collection of methods for working with Uint8Arrays
* @module
*/
/**
* Make sure two Uint8Arrays are deeply equivalent
*/
function areEqual(array1, array2) {
	if (array1.length != array2.length) return false;
	return array1.every((val, i) => val === array2[i]);
}
/**
* Convert a Uint8Array to Hexadecimal.
*
* A replacement for `Buffer.toString('hex')`
*/
function toHex(array) {
	return Array.from(array, (i) => i.toString(16).padStart(2, "0")).join("");
}
/**
* Convert a hexadecimal string to isoUint8Array.
*
* A replacement for `Buffer.from('...', 'hex')`
*/
function fromHex(hex) {
	if (!hex) return Uint8Array.from([]);
	if (!(hex.length !== 0 && hex.length % 2 === 0 && !/[^a-fA-F0-9]/u.test(hex))) throw new Error("Invalid hex string");
	const byteStrings = hex.match(/.{1,2}/g) ?? [];
	return Uint8Array.from(byteStrings.map((byte) => parseInt(byte, 16)));
}
/**
* Combine multiple Uint8Arrays into a single Uint8Array
*/
function concat(arrays) {
	let pointer = 0;
	const totalLength = arrays.reduce((prev, curr) => prev + curr.length, 0);
	const toReturn = new Uint8Array(totalLength);
	arrays.forEach((arr) => {
		toReturn.set(arr, pointer);
		pointer += arr.length;
	});
	return toReturn;
}
/**
* Convert bytes into a UTF-8 string
*/
function toUTF8String(array) {
	return new globalThis.TextDecoder("utf-8").decode(array);
}
/**
* Convert a UTF-8 string back into bytes
*/
function fromUTF8String(utf8String) {
	return new globalThis.TextEncoder().encode(utf8String);
}
/**
* Convert an ASCII string to Uint8Array
*/
function fromASCIIString(value) {
	return Uint8Array.from(value.split("").map((x) => x.charCodeAt(0)));
}
/**
* Prepare a DataView we can slice our way around in as we parse the bytes in a Uint8Array
*/
function toDataView(array) {
	return new DataView(array.buffer, array.byteOffset, array.length);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/convertCertBufferToPEM.js
/**
* Convert buffer to an OpenSSL-compatible PEM text format.
*/
function convertCertBufferToPEM(certBuffer) {
	let b64cert;
	/**
	* Get certBuffer to a base64 representation
	*/
	if (typeof certBuffer === "string") if (isBase64URL(certBuffer)) b64cert = toBase64(certBuffer);
	else if (isBase64(certBuffer)) b64cert = certBuffer;
	else throw new Error("Certificate is not a valid base64 or base64url string");
	else b64cert = fromBuffer(certBuffer, "base64");
	let PEMKey = "";
	for (let i = 0; i < Math.ceil(b64cert.length / 64); i += 1) {
		const start = 64 * i;
		PEMKey += `${b64cert.substr(start, 64)}\n`;
	}
	PEMKey = `-----BEGIN CERTIFICATE-----\n${PEMKey}-----END CERTIFICATE-----\n`;
	return PEMKey;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/iso/isoCrypto/runtimeSupportsWebCryptoKeyAlg.js
/**
* Use SubtleCrypto.supports() to understand if the runtime supports using the given key algorithm
* for signature verification.
*/
function runtimeSupportsWebCryptoKeyAlg(alg) {
	const globalSubtleCrypto = globalThis.SubtleCrypto;
	if (typeof globalSubtleCrypto.supports !== "function") return false;
	try {
		return globalSubtleCrypto.supports("verify", alg);
	} catch (_err) {
		return false;
	}
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/android-safetynet.js
/**
* GlobalSign Root CA
*
* Downloaded from https://pki.goog/roots.pem
*
* Valid until 2028-01-28 @ 04:00 PST
*
* SHA256 Fingerprint
* EB:D4:10:40:E4:BB:3E:C7:42:C9:E3:81:D3:1E:F2:A4:1A:48:B6:68:5C:96:E7:CE:F3:C1:DF:6C:D4:33:1C:99
*/
var GlobalSign_Root_CA = `-----BEGIN CERTIFICATE-----
MIIDdTCCAl2gAwIBAgILBAAAAAABFUtaw5QwDQYJKoZIhvcNAQEFBQAwVzELMAkG
A1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jv
b3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw05ODA5MDExMjAw
MDBaFw0yODAxMjgxMjAwMDBaMFcxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9i
YWxTaWduIG52LXNhMRAwDgYDVQQLEwdSb290IENBMRswGQYDVQQDExJHbG9iYWxT
aWduIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDaDuaZ
jc6j40+Kfvvxi4Mla+pIH/EqsLmVEQS98GPR4mdmzxzdzxtIK+6NiY6arymAZavp
xy0Sy6scTHAHoT0KMM0VjU/43dSMUBUc71DuxC73/OlS8pF94G3VNTCOXkNz8kHp
1Wrjsok6Vjk4bwY8iGlbKk3Fp1S4bInMm/k8yuX9ifUSPJJ4ltbcdG6TRGHRjcdG
snUOhugZitVtbNV4FpWi6cgKOOvyJBNPc1STE4U6G7weNLWLBYy5d4ux2x8gkasJ
U26Qzns3dLlwR5EiUWMWea6xrkEmCMgZK9FGqkjWZCrXgzT/LCrBbBlDSgeF59N8
9iFo7+ryUp9/k5DPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8E
BTADAQH/MB0GA1UdDgQWBBRge2YaRQ2XyolQL30EzTSo//z9SzANBgkqhkiG9w0B
AQUFAAOCAQEA1nPnfE920I2/7LqivjTFKDK1fPxsnCwrvQmeU79rXqoRSLblCKOz
yj1hTdNGCbM+w6DjY1Ub8rrvrTnhQ7k4o+YviiY776BQVvnGCv04zcQLcFGUl5gE
38NflNUVyRRBnMRddWQVDf9VMOyGj/8N7yy5Y0b2qvzfvGn9LhJIZJrglfCm7ymP
AbEVtQwdpf5pLGkkeB6zpxxxYu7KyJesF12KwvhHhm4qxFYxldBniYUr+WymXUad
DKqC5JlR3XC321Y9YeRq4VzW9v493kHMB65jUr9TU/Qr6cf9tveCX4XSQRjbgbME
HMUfpIBvFSDJ3gyICh3WZlXi/EjJKSZp4A==
-----END CERTIFICATE-----
`;
//#endregion
//#region node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/android-key.js
/**
* Google Hardware Attestation Root 1
*
* Downloaded from https://developer.android.com/training/articles/security-key-attestation#root_certificate
* (first entry)
*
* Valid until 2026-05-24 @ 09:28 PST
*
* SHA256 Fingerprint
* C1:98:4A:3E:F4:5C:1E:2A:91:85:51:DE:10:60:3C:86:F7:05:1B:22:49:C4:89:1C:AE:32:30:EA:BD:0C:97:D5
*/
var Google_Hardware_Attestation_Root_1 = `-----BEGIN CERTIFICATE-----
MIIFYDCCA0igAwIBAgIJAOj6GWMU0voYMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMTYwNTI2MTYyODUyWhcNMjYwNTI0MTYy
ODUyWjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaOBpjCBozAdBgNVHQ4EFgQUNmHhAHyIBQlRi0RsR/8aTMnqTxIwHwYD
VR0jBBgwFoAUNmHhAHyIBQlRi0RsR/8aTMnqTxIwDwYDVR0TAQH/BAUwAwEB/zAO
BgNVHQ8BAf8EBAMCAYYwQAYDVR0fBDkwNzA1oDOgMYYvaHR0cHM6Ly9hbmRyb2lk
Lmdvb2dsZWFwaXMuY29tL2F0dGVzdGF0aW9uL2NybC8wDQYJKoZIhvcNAQELBQAD
ggIBACDIw41L3KlXG0aMiS//cqrG+EShHUGo8HNsw30W1kJtjn6UBwRM6jnmiwfB
Pb8VA91chb2vssAtX2zbTvqBJ9+LBPGCdw/E53Rbf86qhxKaiAHOjpvAy5Y3m00m
qC0w/Zwvju1twb4vhLaJ5NkUJYsUS7rmJKHHBnETLi8GFqiEsqTWpG/6ibYCv7rY
DBJDcR9W62BW9jfIoBQcxUCUJouMPH25lLNcDc1ssqvC2v7iUgI9LeoM1sNovqPm
QUiG9rHli1vXxzCyaMTjwftkJLkf6724DFhuKug2jITV0QkXvaJWF4nUaHOTNA4u
JU9WDvZLI1j83A+/xnAJUucIv/zGJ1AMH2boHqF8CY16LpsYgBt6tKxxWH00XcyD
CdW2KlBCeqbQPcsFmWyWugxdcekhYsAWyoSf818NUsZdBWBaR/OukXrNLfkQ79Iy
ZohZbvabO/X+MVT3rriAoKc8oE2Uws6DF+60PV7/WIPjNvXySdqspImSN78mflxD
qwLqRBYkA3I75qppLGG9rp7UCdRjxMl8ZDBld+7yvHVgt1cVzJx9xnyGCC23Uaic
MDSXYrB4I4WHXPGjxhZuCuPBLTdOLU8YRvMYdEvYebWHMpvwGCF6bAx3JBpIeOQ1
wDB5y0USicV3YgYGmi+NZfhA4URSh77Yd6uuJOJENRaNVTzk
-----END CERTIFICATE-----
`;
/**
* Google Hardware Attestation Root 2
*
* Downloaded from https://developer.android.com/training/articles/security-key-attestation#root_certificate
* (second entry)
*
* Valid until 2034-11-18 @ 12:37 PST
*
* SHA256 Fingerprint
* 1E:F1:A0:4B:8B:A5:8A:B9:45:89:AC:49:8C:89:82:A7:83:F2:4E:A7:30:7E:01:59:A0:C3:A7:3B:37:7D:87:CC
*/
var Google_Hardware_Attestation_Root_2 = `-----BEGIN CERTIFICATE-----
MIIFHDCCAwSgAwIBAgIJANUP8luj8tazMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMTkxMTIyMjAzNzU4WhcNMzQxMTE4MjAz
NzU4WjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaNjMGEwHQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1Ud
IwQYMBaAFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4ICAQBOMaBc8oumXb2voc7XCWnu
XKhBBK3e2KMGz39t7lA3XXRe2ZLLAkLM5y3J7tURkf5a1SutfdOyXAmeE6SRo83U
h6WszodmMkxK5GM4JGrnt4pBisu5igXEydaW7qq2CdC6DOGjG+mEkN8/TA6p3cno
L/sPyz6evdjLlSeJ8rFBH6xWyIZCbrcpYEJzXaUOEaxxXxgYz5/cTiVKN2M1G2ok
QBUIYSY6bjEL4aUN5cfo7ogP3UvliEo3Eo0YgwuzR2v0KR6C1cZqZJSTnghIC/vA
D32KdNQ+c3N+vl2OTsUVMC1GiWkngNx1OO1+kXW+YTnnTUOtOIswUP/Vqd5SYgAI
mMAfY8U9/iIgkQj6T2W6FsScy94IN9fFhE1UtzmLoBIuUFsVXJMTz+Jucth+IqoW
Fua9v1R93/k98p41pjtFX+H8DslVgfP097vju4KDlqN64xV1grw3ZLl4CiOe/A91
oeLm2UHOq6wn3esB4r2EIQKb6jTVGu5sYCcdWpXr0AUVqcABPdgL+H7qJguBw09o
jm6xNIrw2OocrDKsudk/okr/AwqEyPKw9WnMlQgLIKw1rODG2NvU9oR3GVGdMkUB
ZutL8VuFkERQGt6vQ2OCw0sV47VMkuYbacK/xyZFiRcrPJPb41zgbQj9XAEyLKCH
ex0SdDrx+tWUDqG8At2JHA==
-----END CERTIFICATE-----
`;
/**
* Google Hardware Attestation Root 3
*
* Downloaded from https://developer.android.com/training/articles/security-key-attestation#root_certificate
* (third entry)
*
* Valid until 2036-11-13 @ 15:10 PST
*
* SHA256 Fingerprint
* AB:66:41:17:8A:36:E1:79:AA:0C:1C:DD:DF:9A:16:EB:45:FA:20:94:3E:2B:8C:D7:C7:C0:5C:26:CF:8B:48:7A
*/
var Google_Hardware_Attestation_Root_3 = `
-----BEGIN CERTIFICATE-----
MIIFHDCCAwSgAwIBAgIJAMNrfES5rhgxMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMjExMTE3MjMxMDQyWhcNMzYxMTEzMjMx
MDQyWjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaNjMGEwHQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1Ud
IwQYMBaAFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4ICAQBTNNZe5cuf8oiq+jV0itTG
zWVhSTjOBEk2FQvh11J3o3lna0o7rd8RFHnN00q4hi6TapFhh4qaw/iG6Xg+xOan
63niLWIC5GOPFgPeYXM9+nBb3zZzC8ABypYuCusWCmt6Tn3+Pjbz3MTVhRGXuT/T
QH4KGFY4PhvzAyXwdjTOCXID+aHud4RLcSySr0Fq/L+R8TWalvM1wJJPhyRjqRCJ
erGtfBagiALzvhnmY7U1qFcS0NCnKjoO7oFedKdWlZz0YAfu3aGCJd4KHT0MsGiL
Zez9WP81xYSrKMNEsDK+zK5fVzw6jA7cxmpXcARTnmAuGUeI7VVDhDzKeVOctf3a
0qQLwC+d0+xrETZ4r2fRGNw2YEs2W8Qj6oDcfPvq9JySe7pJ6wcHnl5EZ0lwc4xH
7Y4Dx9RA1JlfooLMw3tOdJZH0enxPXaydfAD3YifeZpFaUzicHeLzVJLt9dvGB0b
HQLE4+EqKFgOZv2EoP686DQqbVS1u+9k0p2xbMA105TBIk7npraa8VM0fnrRKi7w
lZKwdH+aNAyhbXRW9xsnODJ+g8eF452zvbiKKngEKirK5LGieoXBX7tZ9D1GNBH2
Ob3bKOwwIWdEFle/YF/h6zWgdeoaNGDqVBrLr2+0DtWoiB1aDEjLWl9FmyIUyUm7
mD/vFDkzF+wm7cyWpQpCVQ==
-----END CERTIFICATE-----
`;
/**
* Google Hardware Attestation Root 4
*
* Downloaded from https://developer.android.com/training/articles/security-key-attestation#root_certificate
* (fourth entry)
*
* Valid until 2042-03-15 @ 11:07 PDT
*
* SHA256 Fingerprint
* CE:DB:1C:B6:DC:89:6A:E5:EC:79:73:48:BC:E9:28:67:53:C2:B3:8E:E7:1C:E0:FB:E3:4A:9A:12:48:80:0D:FC
*/
var Google_Hardware_Attestation_Root_4 = `
-----BEGIN CERTIFICATE-----
MIIFHDCCAwSgAwIBAgIJAPHBcqaZ6vUdMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAUTEGY5MjAwOWU4NTNiNmIwNDUwHhcNMjIwMzIwMTgwNzQ4WhcNNDIwMzE1MTgw
NzQ4WjAbMRkwFwYDVQQFExBmOTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0B
AQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xUFmOr75gvMsd/dTEDDJdS
Sxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfdnJLmN0pTy/4lj4/7
tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL/ggj
nar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGq
C4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQ
oVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+O
JtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7quvmag8jfPioyKvxnK/Eg
sTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgpZrt3i5MIlCaY504LzSRi
igHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6tUXHI/+M
RPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9E
aDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5Um
AGMCAwEAAaNjMGEwHQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1Ud
IwQYMBaAFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYD
VR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4ICAQB8cMqTllHc8U+qCrOlg3H7
174lmaCsbo/bJ0C17JEgMLb4kvrqsXZs01U3mB/qABg/1t5Pd5AORHARs1hhqGIC
W/nKMav574f9rZN4PC2ZlufGXb7sIdJpGiO9ctRhiLuYuly10JccUZGEHpHSYM2G
tkgYbZba6lsCPYAAP83cyDV+1aOkTf1RCp/lM0PKvmxYN10RYsK631jrleGdcdkx
oSK//mSQbgcWnmAEZrzHoF1/0gso1HZgIn0YLzVhLSA/iXCX4QT2h3J5z3znluKG
1nv8NQdxei2DIIhASWfu804CA96cQKTTlaae2fweqXjdN1/v2nqOhngNyz1361mF
mr4XmaKH/ItTwOe72NI9ZcwS1lVaCvsIkTDCEXdm9rCNPAY10iTunIHFXRh+7KPz
lHGewCq/8TOohBRn0/NNfh7uRslOSZ/xKbN9tMBtw37Z8d2vvnXq/YWdsm1+JLVw
n6yYD/yacNJBlwpddla8eaVMjsF6nBnIgQOf9zKSe06nSTqvgwUHosgOECZJZ1Eu
zbH4yswbt02tKtKEFhx+v+OTge/06V+jGsqTWLsfrOCNLuA8H++z+pUENmpqnnHo
vaI47gC+TNpkgYGkkBT6B/m/U01BuOBBTzhIlMEZq9qkDWuM2cA5kW5V3FJUcfHn
w1IdYIg2Wxg7yHcQZemFQg==
-----END CERTIFICATE-----
`;
//#endregion
//#region node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/apple.js
/**
* Apple WebAuthn Root CA
*
* Downloaded from https://www.apple.com/certificateauthority/Apple_WebAuthn_Root_CA.pem
*
* Valid until 2045-03-14 @ 17:00 PST
*
* SHA256 Fingerprint
* 09:15:DD:5C:07:A2:8D:B5:49:D1:F6:77:BB:5A:75:D4:BF:BE:95:61:A7:73:42:43:27:76:2E:9E:02:F9:BB:29
*/
var Apple_WebAuthn_Root_CA = `-----BEGIN CERTIFICATE-----
MIICEjCCAZmgAwIBAgIQaB0BbHo84wIlpQGUKEdXcTAKBggqhkjOPQQDAzBLMR8w
HQYDVQQDDBZBcHBsZSBXZWJBdXRobiBSb290IENBMRMwEQYDVQQKDApBcHBsZSBJ
bmMuMRMwEQYDVQQIDApDYWxpZm9ybmlhMB4XDTIwMDMxODE4MjEzMloXDTQ1MDMx
NTAwMDAwMFowSzEfMB0GA1UEAwwWQXBwbGUgV2ViQXV0aG4gUm9vdCBDQTETMBEG
A1UECgwKQXBwbGUgSW5jLjETMBEGA1UECAwKQ2FsaWZvcm5pYTB2MBAGByqGSM49
AgEGBSuBBAAiA2IABCJCQ2pTVhzjl4Wo6IhHtMSAzO2cv+H9DQKev3//fG59G11k
xu9eI0/7o6V5uShBpe1u6l6mS19S1FEh6yGljnZAJ+2GNP1mi/YK2kSXIuTHjxA/
pcoRf7XkOtO4o1qlcaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUJtdk
2cV4wlpn0afeaxLQG2PxxtcwDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2cA
MGQCMFrZ+9DsJ1PW9hfNdBywZDsWDbWFp28it1d/5w2RPkRX3Bbn/UbDTNLx7Jr3
jAGGiQIwHFj+dJZYUJR786osByBelJYsVZd2GbHQu209b5RCmGQ21gpSAk9QZW4B
1bWeT0vT
-----END CERTIFICATE-----
`;
//#endregion
//#region node_modules/@simplewebauthn/server/esm/services/defaultRootCerts/mds.js
/**
* GlobalSign Root CA - R3
*
* Downloaded from https://valid.r3.roots.globalsign.com/
*
* Valid until 2029-03-18 @ 00:00 PST
*
* SHA256 Fingerprint
* CB:B5:22:D7:B7:F1:27:AD:6A:01:13:86:5B:DF:1C:D4:10:2E:7D:07:59:AF:63:5A:7C:F4:72:0D:C9:63:C5:3B
*/
var GlobalSign_Root_CA_R3 = `-----BEGIN CERTIFICATE-----
MIIDXzCCAkegAwIBAgILBAAAAAABIVhTCKIwDQYJKoZIhvcNAQELBQAwTDEgMB4G
A1UECxMXR2xvYmFsU2lnbiBSb290IENBIC0gUjMxEzARBgNVBAoTCkdsb2JhbFNp
Z24xEzARBgNVBAMTCkdsb2JhbFNpZ24wHhcNMDkwMzE4MTAwMDAwWhcNMjkwMzE4
MTAwMDAwWjBMMSAwHgYDVQQLExdHbG9iYWxTaWduIFJvb3QgQ0EgLSBSMzETMBEG
A1UEChMKR2xvYmFsU2lnbjETMBEGA1UEAxMKR2xvYmFsU2lnbjCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAMwldpB5BngiFvXAg7aEyiie/QV2EcWtiHL8
RgJDx7KKnQRfJMsuS+FggkbhUqsMgUdwbN1k0ev1LKMPgj0MK66X17YUhhB5uzsT
gHeMCOFJ0mpiLx9e+pZo34knlTifBtc+ycsmWQ1z3rDI6SYOgxXG71uL0gRgykmm
KPZpO/bLyCiR5Z2KYVc3rHQU3HTgOu5yLy6c+9C7v/U9AOEGM+iCK65TpjoWc4zd
QQ4gOsC0p6Hpsk+QLjJg6VfLuQSSaGjlOCZgdbKfd/+RFO+uIEn8rUAVSNECMWEZ
XriX7613t2Saer9fwRPvm2L7DWzgVGkWqQPabumDk3F2xmmFghcCAwEAAaNCMEAw
DgYDVR0PAQH/BAQDAgEGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFI/wS3+o
LkUkrk1Q+mOai97i3Ru8MA0GCSqGSIb3DQEBCwUAA4IBAQBLQNvAUKr+yAzv95ZU
RUm7lgAJQayzE4aGKAczymvmdLm6AC2upArT9fHxD4q/c2dKg8dEe3jgr25sbwMp
jjM5RcOO5LlXbKr8EpbsU8Yt5CRsuZRj+9xTaGdWPoO4zzUhw8lo/s7awlOqzJCK
6fBdRoyV3XpYKBovHd7NADdBj+1EbddTKJd+82cEHhXXipa0095MJ6RMG3NzdvQX
mcIfeg7jLQitChws/zyrVQ4PkX4268NXSb7hLi18YIvDQVETI53O9zJrlAGomecs
Mx86OyXShkDOOyyGeMlhLxS67ttVb9+E7gUJTb0o2HLO02JQZR7rkpeDMdmztcpH
WD9f
-----END CERTIFICATE-----
 `;
/**
* GlobalSign Root R46
*
* Downloaded from https://valid.r46.roots.globalsign.com/
*
* Valid until 2046-03-20 @ 00:00 PST
*
* SHA256 Fingerprint
* 4F:A3:12:6D:8D:3A:11:D1:C4:85:5A:4F:80:7C:BA:D6:CF:91:9D:3A:5A:88:B0:3B:EA:2C:63:72:D9:3C:40:C9
*/
var GlobalSign_Root_R46 = `-----BEGIN CERTIFICATE-----
MIIFWjCCA0KgAwIBAgISEdK7udcjGJ5AXwqdLdDfJWfRMA0GCSqGSIb3DQEBDAUA
MEYxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRwwGgYD
VQQDExNHbG9iYWxTaWduIFJvb3QgUjQ2MB4XDTE5MDMyMDAwMDAwMFoXDTQ2MDMy
MDAwMDAwMFowRjELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYt
c2ExHDAaBgNVBAMTE0dsb2JhbFNpZ24gUm9vdCBSNDYwggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQCsrHQy6LNl5brtQyYdpokNRbopiLKkHWPd08EsCVeJ
OaFV6Wc0dwxu5FUdUiXSE2te4R2pt32JMl8Nnp8semNgQB+msLZ4j5lUlghYruQG
vGIFAha/r6gjA7aUD7xubMLL1aa7DOn2wQL7Id5m3RerdELv8HQvJfTqa1VbkNud
316HCkD7rRlr+/fKYIje2sGP1q7Vf9Q8g+7XFkyDRTNrJ9CG0Bwta/OrffGFqfUo
0q3v84RLHIf8E6M6cqJaESvWJ3En7YEtbWaBkoe0G1h6zD8K+kZPTXhc+CtI4wSE
y132tGqzZfxCnlEmIyDLPRT5ge1lFgBPGmSXZgjPjHvjK8Cd+RTyG/FWaha/LIWF
zXg4mutCagI0GIMXTpRW+LaCtfOW3T3zvn8gdz57GSNrLNRyc0NXfeD412lPFzYE
+cCQYDdF3uYM2HSNrpyibXRdQr4G9dlkbgIQrImwTDsHTUB+JMWKmIJ5jqSngiCN
I/onccnfxkF0oE32kRbcRoxfKWMxWXEM2G/CtjJ9++ZdU6Z+Ffy7dXxd7Pj2Fxzs
x2sZy/N78CsHpdlseVR2bJ0cpm4O6XkMqCNqo98bMDGfsVR7/mrLZqrcZdCinkqa
ByFrgY/bxFn63iLABJzjqls2k+g9vXqhnQt2sQvHnf3PmKgGwvgqo6GDoLclcqUC
4wIDAQABo0IwQDAOBgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNV
HQ4EFgQUA1yrc4GHqMywptWU4jaWSf8FmSwwDQYJKoZIhvcNAQEMBQADggIBAHx4
7PYCLLtbfpIrXTncvtgdokIzTfnvpCo7RGkerNlFo048p9gkUbJUHJNOxO97k4Vg
JuoJSOD1u8fpaNK7ajFxzHmuEajwmf3lH7wvqMxX63bEIaZHU1VNaL8FpO7XJqti
2kM3S+LGteWygxk6x9PbTZ4IevPuzz5i+6zoYMzRx6Fcg0XERczzF2sUyQQCPtIk
pnnpHs6i58FZFZ8d4kuaPp92CC1r2LpXFNqD6v6MVenQTqnMdzGxRBF6XLE+0xRF
FRhiJBPSy03OXIPBNvIQtQ6IbbjhVp+J3pZmOUdkLG5NrmJ7v2B0GbhWrJKsFjLt
rWhV/pi60zTe9Mlhww6G9kuEYO4Ne7UyWHmRVSyBQ7N0H3qqJZ4d16GLuc1CLgSk
ZoNNiTW2bKg2SnkheCLQQrzRQDGQob4Ez8pn7fXwgNNgyYMqIgXQBztSvwyeqiv5
u+YfjyW6hY0XHgL+XVAEV8/+LbzvXMAaq7afJMbfc2hIkCwU9D9SGuTSyxTDYWnP
4vkYxboznxSjBF25cfe1lNj2M8FawTSLfJvdkzrnE6JwYZ+vj+vYxXX4M2bUdGc6
N3ec592kD3ZDZopD8p/7DEJ4Y9HiD2971KE9dJeFt0g5QdYg/NA6s/rob8SKunE3
vouXsXgxT7PntgMTzlSdriVZzH81Xwj3QEUxeCp6
-----END CERTIFICATE-----
`;
//#endregion
//#region node_modules/@simplewebauthn/server/esm/services/settingsService.js
var BaseSettingsService = class {
	constructor() {
		Object.defineProperty(this, "pemCertificates", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_runtimeSupportsPQC", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: false
		});
		this.pemCertificates = /* @__PURE__ */ new Map();
		this._runtimeSupportsPQC = runtimeSupportsWebCryptoKeyAlg("ML-DSA-44");
	}
	setRootCertificates(opts) {
		const { identifier, certificates } = opts;
		const newCertificates = [];
		for (const cert of certificates) if (cert instanceof Uint8Array) newCertificates.push(convertCertBufferToPEM(cert));
		else newCertificates.push(cert);
		this.pemCertificates.set(identifier, newCertificates);
	}
	getRootCertificates(opts) {
		const { identifier } = opts;
		return this.pemCertificates.get(identifier) ?? [];
	}
	runtimeSupportsPQC() {
		return this._runtimeSupportsPQC;
	}
};
/**
* A basic service for specifying acceptable root certificates for all supported attestation
* statement formats.
*
* In addition, default root certificates are included for the following statement formats:
*
* - `'android-key'`
* - `'android-safetynet'`
* - `'apple'`
* - `'android-mds'`
*
* These can be overwritten as needed by setting alternative root certificates for their format
* identifier using `setRootCertificates()`.
*/
var SettingsService = new BaseSettingsService();
SettingsService.setRootCertificates({
	identifier: "android-key",
	certificates: [
		Google_Hardware_Attestation_Root_1,
		Google_Hardware_Attestation_Root_2,
		Google_Hardware_Attestation_Root_3,
		Google_Hardware_Attestation_Root_4
	]
});
SettingsService.setRootCertificates({
	identifier: "android-safetynet",
	certificates: [GlobalSign_Root_CA]
});
SettingsService.setRootCertificates({
	identifier: "apple",
	certificates: [Apple_WebAuthn_Root_CA]
});
SettingsService.setRootCertificates({
	identifier: "mds",
	certificates: [GlobalSign_Root_CA_R3, GlobalSign_Root_R46]
});
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/generateRegistrationOptions.js
/**
* Set up some default authenticator selection options as per the latest spec:
* https://www.w3.org/TR/webauthn-2/#dictdef-authenticatorselectioncriteria
*
* Helps with some older platforms (e.g. Android 7.0 Nougat) that may not be aware of these
* defaults.
*/
var defaultAuthenticatorSelection = {
	residentKey: "preferred",
	userVerification: "preferred"
};
/**
* Use the most commonly-supported algorithms
* See the following:
*   - https://www.iana.org/assignments/cose/cose.xhtml#algorithms
*   - https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-pubkeycredparams
*/
var defaultSupportedAlgorithmIDs = [
	COSEALG.EdDSA,
	COSEALG.ES256,
	COSEALG.RS256
];
if (SettingsService.runtimeSupportsPQC()) defaultSupportedAlgorithmIDs = [COSEALG.ML_DSA_44, ...defaultSupportedAlgorithmIDs];
/**
* Prepare a value to pass into navigator.credentials.create(...) for authenticator registration
*
* **Options:**
*
* @param rpName - User-visible, "friendly" website/service name
* @param rpID - Valid domain name (after `https://`)
* @param userName - User's website-specific username (email, etc...)
* @param userID **(Optional)** - User's website-specific unique ID. Defaults to generating a random identifier
* @param challenge **(Optional)** - Random value the authenticator needs to sign and pass back. Defaults to generating a random value
* @param userDisplayName **(Optional)** - User's actual name. Defaults to `""`
* @param timeout **(Optional)** - How long (in ms) the user can take to complete attestation. Defaults to `60000`
* @param attestationType **(Optional)** - Specific attestation statement. Defaults to `"none"`
* @param excludeCredentials **(Optional)** - Authenticators registered by the user so the user can't register the same credential multiple times. Defaults to `[]`
* @param authenticatorSelection **(Optional)** - Advanced criteria for restricting the types of authenticators that may be used. Defaults to `{ residentKey: 'preferred', userVerification: 'preferred' }`
* @param extensions **(Optional)** - Additional plugins the authenticator or browser should use during attestation
* @param supportedAlgorithmIDs **(Optional)** - Array of numeric COSE algorithm identifiers indicating supported public key algorithms. Import `COSEALG` from \@simplewebauthn/server/helpers for suitable values. Defaults to `[COSEALG.EdDSA, COSEALG.ES256, COSEALG.RS256]`
* @param preferredAuthenticatorType **(Optional)** - Encourage the browser to prompt the user to register a specific type of authenticator
*/
async function generateRegistrationOptions(options) {
	const { rpName, rpID, userName, userID, challenge = await generateChallenge(), userDisplayName = "", timeout = 6e4, attestationType = "none", excludeCredentials = [], authenticatorSelection = defaultAuthenticatorSelection, extensions, supportedAlgorithmIDs = defaultSupportedAlgorithmIDs, preferredAuthenticatorType } = options;
	/**
	* Prepare pubKeyCredParams from the array of algorithm ID's
	*/
	const pubKeyCredParams = supportedAlgorithmIDs.map((id) => ({
		alg: id,
		type: "public-key"
	}));
	/**
	* Capture some of the nuances of how `residentKey` and `requireResidentKey` how either is set
	* depending on when either is defined in the options
	*/
	if (authenticatorSelection.residentKey === void 0) {
		/**
		* `residentKey`: "If no value is given then the effective value is `required` if
		* requireResidentKey is true or `discouraged` if it is false or absent."
		*
		* See https://www.w3.org/TR/webauthn-2/#dom-authenticatorselectioncriteria-residentkey
		*/
		if (authenticatorSelection.requireResidentKey) authenticatorSelection.residentKey = "required";
	} else
 /**
	* `requireResidentKey`: "Relying Parties SHOULD set it to true if, and only if, residentKey is
	* set to "required""
	*
	* Spec says this property defaults to `false` so we should still be okay to assign `false` too
	*
	* See https://www.w3.org/TR/webauthn-2/#dom-authenticatorselectioncriteria-requireresidentkey
	*/
	authenticatorSelection.requireResidentKey = authenticatorSelection.residentKey === "required";
	/**
	* Preserve ability to specify `string` values for challenges
	*/
	let _challenge = challenge;
	if (typeof _challenge === "string") _challenge = fromUTF8String(_challenge);
	/**
	* Explicitly disallow use of strings for userID anymore because `isoBase64URL.fromBuffer()` below
	* will return an empty string if one gets through!
	*/
	if (typeof userID === "string") throw new Error(`String values for \`userID\` are no longer supported. See https://simplewebauthn.dev/docs/advanced/server/custom-user-ids`);
	/**
	* Generate a user ID if one is not provided
	*/
	let _userID = userID;
	if (!_userID) _userID = await generateUserID();
	/**
	* Map authenticator preference to hints. Map to authenticatorAttachment as well for
	* backwards-compatibility.
	*/
	const hints = [];
	if (preferredAuthenticatorType) {
		if (preferredAuthenticatorType === "securityKey") {
			hints.push("security-key");
			authenticatorSelection.authenticatorAttachment = "cross-platform";
		} else if (preferredAuthenticatorType === "localDevice") {
			hints.push("client-device");
			authenticatorSelection.authenticatorAttachment = "platform";
		} else if (preferredAuthenticatorType === "remoteDevice") {
			hints.push("hybrid");
			authenticatorSelection.authenticatorAttachment = "cross-platform";
		}
	}
	return {
		challenge: fromBuffer(_challenge),
		rp: {
			name: rpName,
			id: rpID
		},
		user: {
			id: fromBuffer(_userID),
			name: userName,
			displayName: userDisplayName
		},
		pubKeyCredParams,
		timeout,
		attestation: attestationType,
		excludeCredentials: excludeCredentials.map((cred) => {
			if (!isBase64URL(cred.id)) throw new Error(`excludeCredential id "${cred.id}" is not a valid base64url string`);
			return {
				...cred,
				id: trimPadding(cred.id),
				type: "public-key"
			};
		}),
		authenticatorSelection,
		extensions: {
			...extensions,
			credProps: true
		},
		hints
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/parseBackupFlags.js
/**
* Make sense of Bits 3 and 4 in authenticator indicating:
*
* - Whether the credential can be used on multiple devices
* - Whether the credential is backed up or not
*
* Invalid configurations will raise an `Error`
*/
function parseBackupFlags({ be, bs }) {
	const credentialBackedUp = bs;
	let credentialDeviceType = "singleDevice";
	if (be) credentialDeviceType = "multiDevice";
	if (credentialDeviceType === "singleDevice" && credentialBackedUp) throw new InvalidBackupFlags("Single-device credential indicated that it was backed up, which should be impossible.");
	return {
		credentialDeviceType,
		credentialBackedUp
	};
}
var InvalidBackupFlags = class extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidBackupFlags";
	}
};
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/matchExpectedRPID.js
/**
* Go through each expected RP ID and try to find one that matches. Returns the unhashed RP ID
* that matched the hash in the response.
*
* Raises an `UnexpectedRPIDHash` error if no match is found
*/
async function matchExpectedRPID(rpIDHash, expectedRPIDs) {
	try {
		return await Promise.any(expectedRPIDs.map((expected) => {
			return new Promise((resolve, reject) => {
				toHash(fromASCIIString(expected)).then((expectedRPIDHash) => {
					if (areEqual(rpIDHash, expectedRPIDHash)) resolve(expected);
					else reject();
				});
			});
		}));
	} catch (err) {
		if (err.name === "AggregateError") throw new UnexpectedRPIDHash();
		throw err;
	}
}
var UnexpectedRPIDHash = class extends Error {
	constructor() {
		super("Unexpected RP ID hash");
		this.name = "UnexpectedRPIDHash";
	}
};
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationFIDOU2F.js
/**
* Verify an attestation response with fmt 'fido-u2f'
*/
async function verifyAttestationFIDOU2F(options) {
	const { attStmt, clientDataHash, rpIdHash, credentialID, credentialPublicKey, aaguid, rootCertificates } = options;
	const signatureBase = concat([
		Uint8Array.from([0]),
		rpIdHash,
		clientDataHash,
		credentialID,
		convertCOSEtoPKCS(credentialPublicKey)
	]);
	const sig = attStmt.get("sig");
	const x5c = attStmt.get("x5c");
	if (!x5c) throw new Error("No attestation certificate provided in attestation statement (FIDOU2F)");
	if (!sig) throw new Error("No attestation signature provided in attestation statement (FIDOU2F)");
	const aaguidToHex = Number.parseInt(toHex(aaguid), 16);
	if (aaguidToHex !== 0) throw new Error(`AAGUID "${aaguidToHex}" was not expected value`);
	try {
		await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
	} catch (err) {
		throw new Error(`${err.message} (FIDOU2F)`);
	}
	return verifySignature({
		signature: sig,
		data: signatureBase,
		x509Certificate: x5c[0],
		hashAlgorithm: COSEALG.ES256
	});
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/validateExtFIDOGenCEAAGUID.js
/**
* Attestation Certificate Extension OID: `id-fido-gen-ce-aaguid`
*
* Sourced from https://fidoalliance.org/specs/fido-v2.0-ps-20150904/fido-key-attestation-v2.0-ps-20150904.html#verifying-an-attestation-statement
*/
var id_fido_gen_ce_aaguid = "1.3.6.1.4.1.45724.1.1.4";
/**
* Look for the id-fido-gen-ce-aaguid certificate extension. If it's present then check it against
* the attestation statement AAGUID.
*/
function validateExtFIDOGenCEAAGUID(certExtensions, aaguid) {
	if (!certExtensions) return true;
	const extFIDOGenCEAAGUID = certExtensions.find((ext) => ext.extnID === id_fido_gen_ce_aaguid);
	if (!extFIDOGenCEAAGUID) return true;
	const parsedExtFIDOGenCEAAGUID = AsnParser.parse(extFIDOGenCEAAGUID.extnValue, OctetString);
	const extValue = new Uint8Array(parsedExtFIDOGenCEAAGUID.buffer);
	if (!areEqual(aaguid, extValue)) {
		const _debugExtHex = toHex(extValue);
		const _debugAAGUIDHex = toHex(aaguid);
		throw new Error(`Certificate extension id-fido-gen-ce-aaguid (${id_fido_gen_ce_aaguid}) value of "${_debugExtHex}" was present but not equal to attestation statement AAGUID value of "${_debugAAGUIDHex}"`);
	}
	return true;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/helpers/logging.js
/**
* A logger instance that doesn't do anything. Useful as a default argument when no custom instance
* of the `SimpleWebAuthnLogger` interface is specified.
*/
var DefaultNoopLogger = {
	debug() {},
	info() {},
	warn() {},
	error() {}
};
/**
* Generate an instance of SimpleWebAuthnLogger that defines all methods. Any logging method not
* defined on `logger` will be a no-op.
*/
function buildLoggerAllMethods(logger) {
	const toReturn = { ...DefaultNoopLogger };
	if (logger.debug) toReturn.debug = logger.debug;
	if (logger.info) toReturn.info = logger.info;
	if (logger.warn) toReturn.warn = logger.warn;
	if (logger.error) toReturn.error = logger.error;
	return toReturn;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/services/metadataService.js
/**
* An instance of `CachedMDS` that will not trigger attempts to refresh the associated entry's blob
*/
var NonRefreshingMDS = {
	url: "",
	no: 0,
	nextUpdate: /* @__PURE__ */ new Date(0)
};
var defaultURLMDS = "https://mds.fidoalliance.org/";
var SERVICE_STATE;
(function(SERVICE_STATE) {
	SERVICE_STATE[SERVICE_STATE["DISABLED"] = 0] = "DISABLED";
	SERVICE_STATE[SERVICE_STATE["REFRESHING"] = 1] = "REFRESHING";
	SERVICE_STATE[SERVICE_STATE["READY"] = 2] = "READY";
})(SERVICE_STATE || (SERVICE_STATE = {}));
/**
* An implementation of `MetadataService` that can download and parse BLOBs, and support on-demand
* requesting and caching of individual metadata statements.
*
* https://fidoalliance.org/metadata/
*/
var BaseMetadataService = class {
	constructor() {
		Object.defineProperty(this, "mdsCache", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: {}
		});
		Object.defineProperty(this, "statementCache", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: {}
		});
		Object.defineProperty(this, "state", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: SERVICE_STATE.DISABLED
		});
		Object.defineProperty(this, "verificationMode", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "strict"
		});
		Object.defineProperty(this, "logger", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: DefaultNoopLogger
		});
	}
	async initialize(opts = {}) {
		this.statementCache = {};
		const { mdsServers = [defaultURLMDS], statements, verificationMode, logger = DefaultNoopLogger } = opts;
		this.logger = buildLoggerAllMethods(logger);
		this.setState(SERVICE_STATE.REFRESHING);
		/**
		* If metadata statements are provided, load them into the cache first. These statements will
		* not be refreshed when a stale one is detected.
		*/
		if (statements?.length) {
			let statementsAdded = 0;
			statements.forEach((statement) => {
				if (statement.aaguid) {
					this.statementCache[statement.aaguid] = {
						entry: {
							metadataStatement: statement,
							statusReports: [],
							timeOfLastStatusChange: "1970-01-01"
						},
						url: NonRefreshingMDS.url
					};
					statementsAdded += 1;
				}
			});
			this.logger.info(`Cached ${statementsAdded} local statements`);
		}
		/**
		* If MDS servers are provided, then download blobs from them, verify them, and then add their
		* entries to the cache. Blobs loaded in this way will be refreshed when a stale entry within is
		* detected.
		*/
		if (mdsServers?.length) {
			const currentCacheCount = Object.keys(this.statementCache).length;
			let numServers = mdsServers.length;
			for (const url of mdsServers) try {
				const cachedMDS = {
					url,
					no: 0,
					nextUpdate: /* @__PURE__ */ new Date(0)
				};
				const blob = await this.downloadBlob(cachedMDS);
				await this.verifyBlob(blob, cachedMDS);
			} catch (err) {
				this.logger.error(`Could not download BLOB from ${url}:`, err);
				numServers -= 1;
			}
			const cacheDiff = Object.keys(this.statementCache).length - currentCacheCount;
			this.logger.info(`Cached ${cacheDiff} statements from ${numServers} metadata server(s)`);
		}
		if (verificationMode) this.verificationMode = verificationMode;
		this.setState(SERVICE_STATE.READY);
	}
	async getStatement(aaguid) {
		if (this.state === SERVICE_STATE.DISABLED) return;
		if (!aaguid) return;
		if (aaguid instanceof Uint8Array) aaguid = convertAAGUIDToString(aaguid);
		await this.pauseUntilReady();
		const cachedStatement = this.statementCache[aaguid];
		if (!cachedStatement) {
			if (this.verificationMode === "strict") throw new Error(`No metadata statement found for aaguid "${aaguid}"`);
			return;
		}
		if (cachedStatement.url) {
			const mds = this.mdsCache[cachedStatement.url];
			if (/* @__PURE__ */ new Date() > mds.nextUpdate) try {
				this.setState(SERVICE_STATE.REFRESHING);
				const blob = await this.downloadBlob(mds);
				await this.verifyBlob(blob, mds);
			} finally {
				this.setState(SERVICE_STATE.READY);
			}
		}
		const { entry } = cachedStatement;
		for (const report of entry.statusReports) {
			const { status } = report;
			if (status === "USER_VERIFICATION_BYPASS" || status === "ATTESTATION_KEY_COMPROMISE" || status === "USER_KEY_REMOTE_COMPROMISE" || status === "USER_KEY_PHYSICAL_COMPROMISE") throw new Error(`Detected compromised aaguid "${aaguid}"`);
		}
		return entry.metadataStatement;
	}
	/**
	* Download and process the latest BLOB from MDS
	*/
	async downloadBlob(cachedMDS) {
		const { url } = cachedMDS;
		return await (await fetch(url)).text();
	}
	/**
	* Verify and process the MDS metadata blob
	*/
	async verifyBlob(blob, cachedMDS) {
		const { url, no } = cachedMDS;
		const { payload, parsedNextUpdate } = await verifyMDSBlob(blob);
		if (payload.no <= no) throw new Error(`Latest BLOB no. ${payload.no} is not greater than previous no. ${no}`);
		for (const entry of payload.entries) if (entry.aaguid) this.statementCache[entry.aaguid] = {
			entry,
			url
		};
		if (url) this.mdsCache[url] = {
			...cachedMDS,
			no: payload.no,
			nextUpdate: parsedNextUpdate
		};
		else if (parsedNextUpdate < /* @__PURE__ */ new Date()) this.logger.warn(`⚠️ This MDS blob (serial: ${payload.no}) contains stale data as of ${parsedNextUpdate.toISOString()}. Please consider re-initializing MetadataService with a newer MDS blob.`);
	}
	/**
	* A helper method to pause execution until the service is ready
	*/
	pauseUntilReady() {
		if (this.state === SERVICE_STATE.READY) return new Promise((resolve) => {
			resolve();
		});
		return new Promise((resolve, reject) => {
			const totalTimeoutMS = 7e4;
			const intervalMS = 100;
			let iterations = totalTimeoutMS / intervalMS;
			const intervalID = globalThis.setInterval(() => {
				if (iterations < 1) {
					clearInterval(intervalID);
					reject(`State did not become ready in ${totalTimeoutMS / 1e3} seconds`);
				} else if (this.state === SERVICE_STATE.READY) {
					clearInterval(intervalID);
					resolve();
				}
				iterations -= 1;
			}, intervalMS);
		});
	}
	/**
	* Report service status on change
	*/
	setState(newState) {
		this.state = newState;
		if (newState === SERVICE_STATE.DISABLED) this.logger.debug("MetadataService is DISABLED");
		else if (newState === SERVICE_STATE.REFRESHING) this.logger.debug("MetadataService is REFRESHING");
		else if (newState === SERVICE_STATE.READY) this.logger.debug("MetadataService is READY");
	}
};
/**
* A basic service for coordinating interactions with the FIDO Metadata Service. This includes BLOB
* download and parsing, and on-demand requesting and caching of individual metadata statements.
*
* https://fidoalliance.org/metadata/
*/
var MetadataService = new BaseMetadataService();
//#endregion
//#region node_modules/@simplewebauthn/server/esm/metadata/verifyAttestationWithMetadata.js
/**
* Match properties of the authenticator's attestation statement against expected values as
* registered with the FIDO Alliance Metadata Service
*/
async function verifyAttestationWithMetadata({ statement, credentialPublicKey, x5c, attestationStatementAlg }) {
	const { authenticationAlgorithms, authenticatorGetInfo, attestationRootCertificates } = statement;
	const keypairCOSEAlgs = /* @__PURE__ */ new Set();
	authenticationAlgorithms.forEach((algSign) => {
		const algSignCOSEINFO = algSignToCOSEInfoMap[algSign];
		if (algSignCOSEINFO) keypairCOSEAlgs.add(algSignCOSEINFO);
	});
	const decodedPublicKey = decodeCredentialPublicKey(credentialPublicKey);
	const kty = decodedPublicKey.get(COSEKEYS.kty);
	const alg = decodedPublicKey.get(COSEKEYS.alg);
	if (!kty) throw new Error("Credential public key was missing kty");
	if (!alg) throw new Error("Credential public key was missing alg");
	if (!kty) throw new Error("Credential public key was missing kty");
	const publicKeyCOSEInfo = {
		kty,
		alg
	};
	if (isCOSEPublicKeyEC2(decodedPublicKey)) publicKeyCOSEInfo.crv = decodedPublicKey.get(COSEKEYS.crv);
	/**
	* Attempt to match the credential public key's algorithm to one specified in the device's
	* metadata
	*/
	let foundMatch = false;
	for (const keypairAlg of keypairCOSEAlgs) {
		if (keypairAlg.alg === publicKeyCOSEInfo.alg && keypairAlg.kty === publicKeyCOSEInfo.kty) if ((keypairAlg.kty === COSEKTY.EC2 || keypairAlg.kty === COSEKTY.OKP) && keypairAlg.crv === publicKeyCOSEInfo.crv) foundMatch = true;
		else foundMatch = true;
		if (foundMatch) break;
	}
	if (!foundMatch) {
		/**
		* Craft some useful error output from the MDS algorithms
		*
		* Example:
		*
		* ```
		* [
		*   'rsassa_pss_sha256_raw' (COSE info: { kty: 3, alg: -37 }),
		*   'secp256k1_ecdsa_sha256_raw' (COSE info: { kty: 2, alg: -47, crv: 8 })
		* ]
		* ```
		*/
		const debugMDSAlgs = authenticationAlgorithms.map((algSign) => `'${algSign}' (COSE info: ${stringifyCOSEInfo(algSignToCOSEInfoMap[algSign])})`);
		const strMDSAlgs = JSON.stringify(debugMDSAlgs, null, 2).replace(/"/g, "");
		/**
		* Construct useful error output about the public key
		*/
		const strPubKeyAlg = stringifyCOSEInfo(publicKeyCOSEInfo);
		throw new Error(`Public key parameters ${strPubKeyAlg} did not match any of the following metadata algorithms:\n${strMDSAlgs}`);
	}
	/**
	* Confirm the attestation statement's algorithm is one supported according to metadata
	*/
	if (attestationStatementAlg !== void 0 && authenticatorGetInfo?.algorithms !== void 0) {
		const getInfoAlgs = authenticatorGetInfo.algorithms.map((_alg) => _alg.alg);
		if (getInfoAlgs.indexOf(attestationStatementAlg) < 0) throw new Error(`Attestation statement alg ${attestationStatementAlg} did not match one of ${getInfoAlgs}`);
	}
	const authenticatorCerts = x5c.map(convertCertBufferToPEM);
	const statementRootCerts = attestationRootCertificates.map(convertCertBufferToPEM);
	/**
	* If an authenticator returns exactly one certificate in its x5c, and that cert is found in the
	* metadata statement then the authenticator is "self-referencing". In this case we forego
	* certificate chain validation.
	*/
	let authenticatorIsSelfReferencing = false;
	if (authenticatorCerts.length === 1 && statementRootCerts.indexOf(authenticatorCerts[0]) >= 0) authenticatorIsSelfReferencing = true;
	if (!authenticatorIsSelfReferencing) await validateCertificatePath(authenticatorCerts, statementRootCerts);
	return true;
}
/**
* Convert ALG_SIGN values to COSE info
*
* Values pulled from `ALG_KEY_COSE` definitions in the FIDO Registry of Predefined Values
*
* https://fidoalliance.org/specs/common-specs/fido-registry-v2.2-ps-20220523.html#authentication-algorithms
*/
var algSignToCOSEInfoMap = {
	secp256r1_ecdsa_sha256_raw: {
		kty: 2,
		alg: -7,
		crv: 1
	},
	secp256r1_ecdsa_sha256_der: {
		kty: 2,
		alg: -7,
		crv: 1
	},
	rsassa_pss_sha256_raw: {
		kty: 3,
		alg: -37
	},
	rsassa_pss_sha256_der: {
		kty: 3,
		alg: -37
	},
	secp256k1_ecdsa_sha256_raw: {
		kty: 2,
		alg: -47,
		crv: 8
	},
	secp256k1_ecdsa_sha256_der: {
		kty: 2,
		alg: -47,
		crv: 8
	},
	rsassa_pss_sha384_raw: {
		kty: 3,
		alg: -38
	},
	rsassa_pkcsv15_sha256_raw: {
		kty: 3,
		alg: -257
	},
	rsassa_pkcsv15_sha384_raw: {
		kty: 3,
		alg: -258
	},
	rsassa_pkcsv15_sha512_raw: {
		kty: 3,
		alg: -259
	},
	rsassa_pkcsv15_sha1_raw: {
		kty: 3,
		alg: -65535
	},
	secp384r1_ecdsa_sha384_raw: {
		kty: 2,
		alg: -35,
		crv: 2
	},
	secp512r1_ecdsa_sha256_raw: {
		kty: 2,
		alg: -36,
		crv: 3
	},
	ed25519_eddsa_sha512_raw: {
		kty: 1,
		alg: -8,
		crv: 6
	}
};
/**
* A helper to format COSEInfo a little nicer than we can achieve with JSON.stringify()
*
* Input: `{ "kty": 3, "alg": -257 }`
*
* Output: `"{ kty: 3, alg: -257 }"`
*/
function stringifyCOSEInfo(info) {
	const { kty, alg, crv } = info;
	let toReturn = "";
	if (kty !== COSEKTY.RSA) toReturn = `{ kty: ${kty}, alg: ${alg}, crv: ${crv} }`;
	else toReturn = `{ kty: ${kty}, alg: ${alg} }`;
	return toReturn;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationPacked.js
/**
* Verify an attestation response with fmt 'packed'
*/
async function verifyAttestationPacked(options) {
	const { attStmt, clientDataHash, authData, credentialPublicKey, aaguid, rootCertificates } = options;
	const sig = attStmt.get("sig");
	const x5c = attStmt.get("x5c");
	const alg = attStmt.get("alg");
	if (!sig) throw new Error("No attestation signature provided in attestation statement (Packed)");
	if (!alg) throw new Error("Attestation statement did not contain alg (Packed)");
	if (!isCOSEAlg(alg)) throw new Error(`Attestation statement contained invalid alg ${alg} (Packed)`);
	const signatureBase = concat([authData, clientDataHash]);
	let verified = false;
	if (x5c) {
		const { subject, basicConstraintsCA, version, notBefore, notAfter, parsedCertificate } = getCertificateInfo(x5c[0]);
		const { OU, CN, O, C } = subject;
		if (OU !== "Authenticator Attestation") throw new Error("Certificate OU was not \"Authenticator Attestation\" (Packed|Full)");
		if (!CN) throw new Error("Certificate CN was empty (Packed|Full)");
		if (!O) throw new Error("Certificate O was empty (Packed|Full)");
		if (!C || C.length !== 2) throw new Error("Certificate C was not two-character ISO 3166 code (Packed|Full)");
		if (basicConstraintsCA) throw new Error("Certificate basic constraints CA was not `false` (Packed|Full)");
		if (version !== 2) throw new Error("Certificate version was not `3` (ASN.1 value of 2) (Packed|Full)");
		let now = /* @__PURE__ */ new Date();
		if (notBefore > now) throw new Error(`Certificate not good before "${notBefore.toString()}" (Packed|Full)`);
		now = /* @__PURE__ */ new Date();
		if (notAfter < now) throw new Error(`Certificate not good after "${notAfter.toString()}" (Packed|Full)`);
		try {
			await validateExtFIDOGenCEAAGUID(parsedCertificate.tbsCertificate.extensions, aaguid);
		} catch (err) {
			throw new Error(`${err.message} (Packed|Full)`);
		}
		const statement = await MetadataService.getStatement(aaguid);
		if (statement) {
			if (statement.attestationTypes.indexOf("basic_full") < 0) throw new Error("Metadata does not indicate support for full attestations (Packed|Full)");
			try {
				await verifyAttestationWithMetadata({
					statement,
					credentialPublicKey,
					x5c,
					attestationStatementAlg: alg
				});
			} catch (err) {
				throw new Error(`${err.message} (Packed|Full)`);
			}
		} else try {
			await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
		} catch (err) {
			const _err = err;
			throw new Error(`${_err.message} (Packed|Full)`, { cause: _err });
		}
		verified = await verifySignature({
			signature: sig,
			data: signatureBase,
			x509Certificate: x5c[0],
			hashAlgorithm: alg
		});
	} else verified = await verifySignature({
		signature: sig,
		data: signatureBase,
		credentialPublicKey,
		hashAlgorithm: alg
	});
	return verified;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationAndroidSafetyNet.js
/**
* Verify an attestation response with fmt 'android-safetynet'
*/
async function verifyAttestationAndroidSafetyNet(options) {
	const { attStmt, clientDataHash, authData, aaguid, rootCertificates, verifyTimestampMS = true, credentialPublicKey, attestationSafetyNetEnforceCTSCheck } = options;
	const alg = attStmt.get("alg");
	const response = attStmt.get("response");
	if (!attStmt.get("ver")) throw new Error("No ver value in attestation (SafetyNet)");
	if (!response) throw new Error("No response was included in attStmt by authenticator (SafetyNet)");
	const jwtParts = toUTF8String(response).split(".");
	const HEADER = JSON.parse(toUTF8String$1(jwtParts[0]));
	const PAYLOAD = JSON.parse(toUTF8String$1(jwtParts[1]));
	const SIGNATURE = jwtParts[2];
	/**
	* START Verify PAYLOAD
	*/
	const { nonce, ctsProfileMatch, timestampMs } = PAYLOAD;
	if (verifyTimestampMS) {
		let now = Date.now();
		if (timestampMs > Date.now()) throw new Error(`Payload timestamp "${timestampMs}" was later than "${now}" (SafetyNet)`);
		const timestampPlusDelay = timestampMs + 6e4;
		now = Date.now();
		if (timestampPlusDelay < now) throw new Error(`Payload timestamp "${timestampPlusDelay}" has expired (SafetyNet)`);
	}
	if (nonce !== fromBuffer(await toHash(concat([authData, clientDataHash])), "base64")) throw new Error("Could not verify payload nonce (SafetyNet)");
	if (attestationSafetyNetEnforceCTSCheck && !ctsProfileMatch) throw new Error("Could not verify device integrity (SafetyNet)");
	/**
	* END Verify PAYLOAD
	*/
	/**
	* START Verify Header
	*/
	const leafCertBuffer = toBuffer(HEADER.x5c[0], "base64");
	const { subject } = getCertificateInfo(leafCertBuffer);
	if (subject.CN !== "attest.android.com") throw new Error("Certificate common name was not \"attest.android.com\" (SafetyNet)");
	const statement = await MetadataService.getStatement(aaguid);
	if (statement) try {
		await verifyAttestationWithMetadata({
			statement,
			credentialPublicKey,
			x5c: HEADER.x5c,
			attestationStatementAlg: alg
		});
	} catch (err) {
		throw new Error(`${err.message} (SafetyNet)`);
	}
	else try {
		await validateCertificatePath(HEADER.x5c.map(convertCertBufferToPEM), rootCertificates);
	} catch (err) {
		throw new Error(`${err.message} (SafetyNet)`);
	}
	/**
	* END Verify Header
	*/
	/**
	* START Verify Signature
	*/
	const signatureBaseBuffer = fromUTF8String(`${jwtParts[0]}.${jwtParts[1]}`);
	/**
	* END Verify Signature
	*/
	return await verifySignature({
		signature: toBuffer(SIGNATURE),
		data: signatureBaseBuffer,
		x509Certificate: leafCertBuffer,
		hashAlgorithm: alg
	});
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/constants.js
/**
* A whole lotta domain knowledge is captured here, with hazy connections to source
* documents. Good places to start searching for more info on these values are the
* following Trusted Computing Group TPM Library docs linked in the WebAuthn API:
*
* - https://www.trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-1-Architecture-01.38.pdf
* - https://www.trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-01.38.pdf
* - https://www.trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-3-Commands-01.38.pdf
*/
/**
* 6.9 TPM_ST (Structure Tags)
*/
var TPM_ST = {
	196: "TPM_ST_RSP_COMMAND",
	32768: "TPM_ST_NULL",
	32769: "TPM_ST_NO_SESSIONS",
	32770: "TPM_ST_SESSIONS",
	32788: "TPM_ST_ATTEST_NV",
	32789: "TPM_ST_ATTEST_COMMAND_AUDIT",
	32790: "TPM_ST_ATTEST_SESSION_AUDIT",
	32791: "TPM_ST_ATTEST_CERTIFY",
	32792: "TPM_ST_ATTEST_QUOTE",
	32793: "TPM_ST_ATTEST_TIME",
	32794: "TPM_ST_ATTEST_CREATION",
	32801: "TPM_ST_CREATION",
	32802: "TPM_ST_VERIFIED",
	32803: "TPM_ST_AUTH_SECRET",
	32804: "TPM_ST_HASHCHECK",
	32805: "TPM_ST_AUTH_SIGNED",
	32809: "TPM_ST_FU_MANIFEST"
};
/**
* 6.3 TPM_ALG_ID
*/
var TPM_ALG = {
	0: "TPM_ALG_ERROR",
	1: "TPM_ALG_RSA",
	4: "TPM_ALG_SHA",
	4: "TPM_ALG_SHA1",
	5: "TPM_ALG_HMAC",
	6: "TPM_ALG_AES",
	7: "TPM_ALG_MGF1",
	8: "TPM_ALG_KEYEDHASH",
	10: "TPM_ALG_XOR",
	11: "TPM_ALG_SHA256",
	12: "TPM_ALG_SHA384",
	13: "TPM_ALG_SHA512",
	16: "TPM_ALG_NULL",
	18: "TPM_ALG_SM3_256",
	19: "TPM_ALG_SM4",
	20: "TPM_ALG_RSASSA",
	21: "TPM_ALG_RSAES",
	22: "TPM_ALG_RSAPSS",
	23: "TPM_ALG_OAEP",
	24: "TPM_ALG_ECDSA",
	25: "TPM_ALG_ECDH",
	26: "TPM_ALG_ECDAA",
	27: "TPM_ALG_SM2",
	28: "TPM_ALG_ECSCHNORR",
	29: "TPM_ALG_ECMQV",
	32: "TPM_ALG_KDF1_SP800_56A",
	33: "TPM_ALG_KDF2",
	34: "TPM_ALG_KDF1_SP800_108",
	35: "TPM_ALG_ECC",
	37: "TPM_ALG_SYMCIPHER",
	38: "TPM_ALG_CAMELLIA",
	64: "TPM_ALG_CTR",
	65: "TPM_ALG_OFB",
	66: "TPM_ALG_CBC",
	67: "TPM_ALG_CFB",
	68: "TPM_ALG_ECB"
};
/**
* 6.4 TPM_ECC_CURVE
*/
var TPM_ECC_CURVE = {
	0: "TPM_ECC_NONE",
	1: "TPM_ECC_NIST_P192",
	2: "TPM_ECC_NIST_P224",
	3: "TPM_ECC_NIST_P256",
	4: "TPM_ECC_NIST_P384",
	5: "TPM_ECC_NIST_P521",
	16: "TPM_ECC_BN_P256",
	17: "TPM_ECC_BN_P638",
	32: "TPM_ECC_SM2_P256"
};
/**
* Sourced from https://trustedcomputinggroup.org/resource/vendor-id-registry/
*
* Latest version:
* https://trustedcomputinggroup.org/wp-content/uploads/TCG-TPM-Vendor-ID-Registry-Version-1.02-Revision-1.00.pdf
*/
var TPM_MANUFACTURERS = {
	"id:414D4400": {
		name: "AMD",
		id: "AMD"
	},
	"id:414E5400": {
		name: "Ant Group",
		id: "ANT"
	},
	"id:41544D4C": {
		name: "Atmel",
		id: "ATML"
	},
	"id:4252434D": {
		name: "Broadcom",
		id: "BRCM"
	},
	"id:4353434F": {
		name: "Cisco",
		id: "CSCO"
	},
	"id:464C5953": {
		name: "Flyslice Technologies",
		id: "FLYS"
	},
	"id:524F4343": {
		name: "Fuzhou Rockchip",
		id: "ROCC"
	},
	"id:474F4F47": {
		name: "Google",
		id: "GOOG"
	},
	"id:48504900": {
		name: "HPI",
		id: "HPI"
	},
	"id:48504500": {
		name: "HPE",
		id: "HPE"
	},
	"id:48495349": {
		name: "Huawei",
		id: "HISI"
	},
	"id:49424D00": {
		name: "IBM",
		id: "IBM"
	},
	"id:49465800": {
		name: "Infineon",
		id: "IFX"
	},
	"id:494E5443": {
		name: "Intel",
		id: "INTC"
	},
	"id:4C454E00": {
		name: "Lenovo",
		id: "LEN"
	},
	"id:4D534654": {
		name: "Microsoft",
		id: "MSFT"
	},
	"id:4E534D20": {
		name: "National Semiconductor",
		id: "NSM"
	},
	"id:4E545A00": {
		name: "Nationz",
		id: "NTZ"
	},
	"id:4E534700": {
		name: "NSING",
		id: "NSG"
	},
	"id:4E544300": {
		name: "Nuvoton Technology",
		id: "NTC"
	},
	"id:51434F4D": {
		name: "Qualcomm",
		id: "QCOM"
	},
	"id:534D534E": {
		name: "Samsung",
		id: "SMSN"
	},
	"id:53454345": {
		name: "SecEdge",
		id: "SECE"
	},
	"id:534E5300": {
		name: "Sinosun",
		id: "SNS"
	},
	"id:534D5343": {
		name: "SMSC",
		id: "SMSC"
	},
	"id:53544D20": {
		name: "STMicroelectronics",
		id: "STM"
	},
	"id:54584E00": {
		name: "Texas Instruments",
		id: "TXN"
	},
	"id:57454300": {
		name: "Winbond",
		id: "WEC"
	},
	"id:5345414C": {
		name: "Wisekey",
		id: "SEAL"
	},
	"id:FFFFF1D0": {
		name: "FIDO Alliance",
		id: "FIDO"
	}
};
/**
* Match TPM public area curve ID's to `crv` numbers used in COSE public keys
*/
var TPM_ECC_CURVE_COSE_CRV_MAP = {
	TPM_ECC_NIST_P256: 1,
	TPM_ECC_NIST_P384: 2,
	TPM_ECC_NIST_P521: 3,
	TPM_ECC_BN_P256: 1,
	TPM_ECC_SM2_P256: 1
};
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/parseCertInfo.js
/**
* Cut up a TPM attestation's certInfo into intelligible chunks
*/
function parseCertInfo(certInfo) {
	let pointer = 0;
	const dataView = toDataView(certInfo);
	const magic = dataView.getUint32(pointer);
	pointer += 4;
	const typeBuffer = dataView.getUint16(pointer);
	pointer += 2;
	const type = TPM_ST[typeBuffer];
	const qualifiedSignerLength = dataView.getUint16(pointer);
	pointer += 2;
	const qualifiedSigner = certInfo.slice(pointer, pointer += qualifiedSignerLength);
	const extraDataLength = dataView.getUint16(pointer);
	pointer += 2;
	const extraData = certInfo.slice(pointer, pointer += extraDataLength);
	const clock = certInfo.slice(pointer, pointer += 8);
	const resetCount = dataView.getUint32(pointer);
	pointer += 4;
	const restartCount = dataView.getUint32(pointer);
	pointer += 4;
	const clockInfo = {
		clock,
		resetCount,
		restartCount,
		safe: !!certInfo.slice(pointer, pointer += 1)
	};
	const firmwareVersion = certInfo.slice(pointer, pointer += 8);
	const attestedNameLength = dataView.getUint16(pointer);
	pointer += 2;
	const attestedName = certInfo.slice(pointer, pointer += attestedNameLength);
	const attestedNameDataView = toDataView(attestedName);
	const qualifiedNameLength = dataView.getUint16(pointer);
	pointer += 2;
	const qualifiedName = certInfo.slice(pointer, pointer += qualifiedNameLength);
	return {
		magic,
		type,
		qualifiedSigner,
		extraData,
		clockInfo,
		firmwareVersion,
		attested: {
			nameAlg: TPM_ALG[attestedNameDataView.getUint16(0)],
			nameAlgBuffer: attestedName.slice(0, 2),
			name: attestedName,
			qualifiedName
		}
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/parsePubArea.js
/**
* Break apart a TPM attestation's pubArea buffer
*
* See 12.2.4 TPMT_PUBLIC here:
* https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-00.96-130315.pdf
*/
function parsePubArea(pubArea) {
	let pointer = 0;
	const dataView = toDataView(pubArea);
	const type = TPM_ALG[dataView.getUint16(pointer)];
	pointer += 2;
	const nameAlg = TPM_ALG[dataView.getUint16(pointer)];
	pointer += 2;
	const objectAttributesInt = dataView.getUint32(pointer);
	pointer += 4;
	const objectAttributes = {
		fixedTPM: !!(objectAttributesInt & 1),
		stClear: !!(objectAttributesInt & 2),
		fixedParent: !!(objectAttributesInt & 8),
		sensitiveDataOrigin: !!(objectAttributesInt & 16),
		userWithAuth: !!(objectAttributesInt & 32),
		adminWithPolicy: !!(objectAttributesInt & 64),
		noDA: !!(objectAttributesInt & 512),
		encryptedDuplication: !!(objectAttributesInt & 1024),
		restricted: !!(objectAttributesInt & 32768),
		decrypt: !!(objectAttributesInt & 65536),
		signOrEncrypt: !!(objectAttributesInt & 131072)
	};
	const authPolicyLength = dataView.getUint16(pointer);
	pointer += 2;
	const authPolicy = pubArea.slice(pointer, pointer += authPolicyLength);
	const parameters = {};
	let unique = Uint8Array.from([]);
	if (type === "TPM_ALG_RSA") {
		const symmetric = TPM_ALG[dataView.getUint16(pointer)];
		pointer += 2;
		const scheme = TPM_ALG[dataView.getUint16(pointer)];
		pointer += 2;
		const keyBits = dataView.getUint16(pointer);
		pointer += 2;
		const exponent = dataView.getUint32(pointer);
		pointer += 4;
		parameters.rsa = {
			symmetric,
			scheme,
			keyBits,
			exponent
		};
		/**
		* See 11.2.4.5 TPM2B_PUBLIC_KEY_RSA here:
		* https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-00.96-130315.pdf
		*/
		const uniqueLength = dataView.getUint16(pointer);
		pointer += 2;
		unique = pubArea.slice(pointer, pointer += uniqueLength);
	} else if (type === "TPM_ALG_ECC") {
		const symmetric = TPM_ALG[dataView.getUint16(pointer)];
		pointer += 2;
		const scheme = TPM_ALG[dataView.getUint16(pointer)];
		pointer += 2;
		const curveID = TPM_ECC_CURVE[dataView.getUint16(pointer)];
		pointer += 2;
		const kdf = TPM_ALG[dataView.getUint16(pointer)];
		pointer += 2;
		parameters.ecc = {
			symmetric,
			scheme,
			curveID,
			kdf
		};
		/**
		* See 11.2.5.1 TPM2B_ECC_PARAMETER here:
		* https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-00.96-130315.pdf
		*/
		const uniqueXLength = dataView.getUint16(pointer);
		pointer += 2;
		const uniqueX = pubArea.slice(pointer, pointer += uniqueXLength);
		const uniqueYLength = dataView.getUint16(pointer);
		pointer += 2;
		unique = concat([uniqueX, pubArea.slice(pointer, pointer += uniqueYLength)]);
	} else throw new Error(`Unexpected type "${type}" (TPM)`);
	return {
		type,
		nameAlg,
		objectAttributes,
		authPolicy,
		parameters,
		unique
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/isValidTPMManufacturerID.js
function getTPMManufacturerInfo(id) {
	return TPM_MANUFACTURERS[`id:${id.substring(3).toUpperCase()}`];
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/tpm/verifyAttestationTPM.js
async function verifyAttestationTPM(options) {
	const { aaguid, attStmt, authData, credentialPublicKey, clientDataHash, rootCertificates } = options;
	const ver = attStmt.get("ver");
	const sig = attStmt.get("sig");
	const alg = attStmt.get("alg");
	const x5c = attStmt.get("x5c");
	const pubArea = attStmt.get("pubArea");
	const certInfo = attStmt.get("certInfo");
	/**
	* Verify structures
	*/
	if (ver !== "2.0") throw new Error(`Unexpected ver "${ver}", expected "2.0" (TPM)`);
	if (!sig) throw new Error("No attestation signature provided in attestation statement (TPM)");
	if (!alg) throw new Error(`Attestation statement did not contain alg (TPM)`);
	if (!isCOSEAlg(alg)) throw new Error(`Attestation statement contained invalid alg ${alg} (TPM)`);
	if (!x5c) throw new Error("No attestation certificate provided in attestation statement (TPM)");
	if (!pubArea) throw new Error("Attestation statement did not contain pubArea (TPM)");
	if (!certInfo) throw new Error("Attestation statement did not contain certInfo (TPM)");
	const { unique, type: pubType, parameters } = parsePubArea(pubArea);
	const cosePublicKey = decodeCredentialPublicKey(credentialPublicKey);
	if (pubType === "TPM_ALG_RSA") {
		if (!isCOSEPublicKeyRSA(cosePublicKey)) throw new Error(`Credential public key with kty ${cosePublicKey.get(COSEKEYS.kty)} did not match ${pubType}`);
		const n = cosePublicKey.get(COSEKEYS.n);
		const e = cosePublicKey.get(COSEKEYS.e);
		if (!n) throw new Error("COSE public key missing n (TPM|RSA)");
		if (!e) throw new Error("COSE public key missing e (TPM|RSA)");
		if (!areEqual(unique, n)) throw new Error("PubArea unique is not same as credentialPublicKey (TPM|RSA)");
		if (!parameters.rsa) throw new Error(`Parsed pubArea type is RSA, but missing parameters.rsa (TPM|RSA)`);
		const eBuffer = e;
		const pubAreaExponent = parameters.rsa.exponent || 65537;
		const eSum = eBuffer[0] + (eBuffer[1] << 8) + (eBuffer[2] << 16);
		if (pubAreaExponent !== eSum) throw new Error(`Unexpected public key exp ${eSum}, expected ${pubAreaExponent} (TPM|RSA)`);
	} else if (pubType === "TPM_ALG_ECC") {
		if (!isCOSEPublicKeyEC2(cosePublicKey)) throw new Error(`Credential public key with kty ${cosePublicKey.get(COSEKEYS.kty)} did not match ${pubType}`);
		const crv = cosePublicKey.get(COSEKEYS.crv);
		const x = cosePublicKey.get(COSEKEYS.x);
		const y = cosePublicKey.get(COSEKEYS.y);
		if (!crv) throw new Error("COSE public key missing crv (TPM|ECC)");
		if (!x) throw new Error("COSE public key missing x (TPM|ECC)");
		if (!y) throw new Error("COSE public key missing y (TPM|ECC)");
		if (!areEqual(unique, concat([x, y]))) throw new Error("PubArea unique is not same as public key x and y (TPM|ECC)");
		if (!parameters.ecc) throw new Error(`Parsed pubArea type is ECC, but missing parameters.ecc (TPM|ECC)`);
		const pubAreaCurveID = parameters.ecc.curveID;
		const pubAreaCurveIDMapToCOSECRV = TPM_ECC_CURVE_COSE_CRV_MAP[pubAreaCurveID];
		if (pubAreaCurveIDMapToCOSECRV !== crv) throw new Error(`Public area key curve ID "${pubAreaCurveID}" mapped to "${pubAreaCurveIDMapToCOSECRV}" which did not match public key crv of "${crv}" (TPM|ECC)`);
	} else throw new Error(`Unsupported pubArea.type "${pubType}"`);
	const { magic, type: certType, attested, extraData } = parseCertInfo(certInfo);
	if (magic !== 4283712327) throw new Error(`Unexpected magic value "${magic}", expected "0xff544347" (TPM)`);
	if (certType !== "TPM_ST_ATTEST_CERTIFY") throw new Error(`Unexpected type "${certType}", expected "TPM_ST_ATTEST_CERTIFY" (TPM)`);
	const pubAreaHash = await toHash(pubArea, attestedNameAlgToCOSEAlg(attested.nameAlg));
	const attestedName = concat([attested.nameAlgBuffer, pubAreaHash]);
	if (!areEqual(attested.name, attestedName)) throw new Error(`Attested name comparison failed (TPM)`);
	if (!areEqual(extraData, await toHash(concat([authData, clientDataHash]), alg))) throw new Error("CertInfo extra data did not equal hashed attestation (TPM)");
	/**
	* Verify signature
	*/
	if (x5c.length < 1) throw new Error("No certificates present in x5c array (TPM)");
	const { basicConstraintsCA, version, subject, notAfter, notBefore } = getCertificateInfo(x5c[0]);
	if (basicConstraintsCA) throw new Error("Certificate basic constraints CA was not `false` (TPM)");
	if (version !== 2) throw new Error("Certificate version was not `3` (ASN.1 value of 2) (TPM)");
	if (subject.combined.length > 0) throw new Error("Certificate subject was not empty (TPM)");
	let now = /* @__PURE__ */ new Date();
	if (notBefore > now) throw new Error(`Certificate not good before "${notBefore.toString()}" (TPM)`);
	now = /* @__PURE__ */ new Date();
	if (notAfter < now) throw new Error(`Certificate not good after "${notAfter.toString()}" (TPM)`);
	/**
	* Plumb the depths of the certificate's ASN.1-formatted data for some values we need to verify
	*/
	const parsedCert = AsnParser.parse(x5c[0], Certificate);
	if (!parsedCert.tbsCertificate.extensions) throw new Error("Certificate was missing extensions (TPM)");
	let subjectAltNamePresent;
	let extKeyUsage;
	parsedCert.tbsCertificate.extensions.forEach((ext) => {
		if (ext.extnID === id_ce_subjectAltName) subjectAltNamePresent = AsnParser.parse(ext.extnValue, SubjectAlternativeName);
		else if (ext.extnID === id_ce_extKeyUsage) extKeyUsage = AsnParser.parse(ext.extnValue, ExtendedKeyUsage);
	});
	if (!subjectAltNamePresent) throw new Error("Certificate did not contain subjectAltName extension (TPM)");
	if (!subjectAltNamePresent[0].directoryName?.[0].length) throw new Error("Certificate subjectAltName extension directoryName was empty (TPM)");
	const { tcgAtTpmManufacturer, tcgAtTpmModel, tcgAtTpmVersion } = getTcgAtTpmValues(subjectAltNamePresent[0].directoryName);
	if (!tcgAtTpmManufacturer || !tcgAtTpmModel || !tcgAtTpmVersion) throw new Error("Certificate contained incomplete subjectAltName data (TPM)");
	if (!extKeyUsage) throw new Error("Certificate did not contain ExtendedKeyUsage extension (TPM)");
	if (!getTPMManufacturerInfo(tcgAtTpmManufacturer)) throw new Error(`Could not match TPM manufacturer "${tcgAtTpmManufacturer}" (TPM)`);
	if (extKeyUsage[0] !== "2.23.133.8.3") throw new Error(`Unexpected extKeyUsage "${extKeyUsage[0]}", expected "2.23.133.8.3" (TPM)`);
	try {
		await validateExtFIDOGenCEAAGUID(parsedCert.tbsCertificate.extensions, aaguid);
	} catch (err) {
		throw new Error(`${err.message} (TPM)`);
	}
	const statement = await MetadataService.getStatement(aaguid);
	if (statement) try {
		await verifyAttestationWithMetadata({
			statement,
			credentialPublicKey,
			x5c,
			attestationStatementAlg: alg
		});
	} catch (err) {
		throw new Error(`${err.message} (TPM)`);
	}
	else try {
		await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
	} catch (err) {
		throw new Error(`${err.message} (TPM)`);
	}
	return verifySignature({
		signature: sig,
		data: certInfo,
		x509Certificate: x5c[0],
		hashAlgorithm: alg
	});
}
/**
* Contain logic for pulling TPM-specific values out of subjectAlternativeName extension
*/
function getTcgAtTpmValues(root) {
	const oidManufacturer = "2.23.133.2.1";
	const oidModel = "2.23.133.2.2";
	const oidVersion = "2.23.133.2.3";
	let tcgAtTpmManufacturer;
	let tcgAtTpmModel;
	let tcgAtTpmVersion;
	/**
	* Iterate through the following potential structures:
	*
	* (Good, follows the spec)
	* https://trustedcomputinggroup.org/wp-content/uploads/TCG_IWG_EKCredentialProfile_v2p3_r2_pub.pdf (page 33)
	* Name [
	*   RelativeDistinguishedName [
	*     AttributeTypeAndValue { type, value }
	*   ]
	*   RelativeDistinguishedName [
	*     AttributeTypeAndValue { type, value }
	*   ]
	*   RelativeDistinguishedName [
	*     AttributeTypeAndValue { type, value }
	*   ]
	* ]
	*
	* (Bad, does not follow the spec)
	* Name [
	*   RelativeDistinguishedName [
	*     AttributeTypeAndValue { type, value }
	*     AttributeTypeAndValue { type, value }
	*     AttributeTypeAndValue { type, value }
	*   ]
	* ]
	*
	* Both structures have been seen in the wild and need to be supported
	*/
	root.forEach((relName) => {
		relName.forEach((attr) => {
			if (attr.type === oidManufacturer) tcgAtTpmManufacturer = attr.value.toString();
			else if (attr.type === oidModel) tcgAtTpmModel = attr.value.toString();
			else if (attr.type === oidVersion) tcgAtTpmVersion = attr.value.toString();
		});
	});
	return {
		tcgAtTpmManufacturer,
		tcgAtTpmModel,
		tcgAtTpmVersion
	};
}
/**
* Convert TPM-specific SHA algorithm ID's with COSE-specific equivalents. Note that the choice to
* use ECDSA SHA IDs is arbitrary; any such COSEALG that would map to SHA-256 in
* `mapCoseAlgToWebCryptoAlg()`
*
* SHA IDs referenced from here:
*
* https://trustedcomputinggroup.org/wp-content/uploads/TCG_TPM2_r1p59_Part2_Structures_pub.pdf
*/
function attestedNameAlgToCOSEAlg(alg) {
	if (alg === "TPM_ALG_SHA256") return COSEALG.ES256;
	else if (alg === "TPM_ALG_SHA384") return COSEALG.ES384;
	else if (alg === "TPM_ALG_SHA512") return COSEALG.ES512;
	throw new Error(`Unexpected TPM attested name alg ${alg}`);
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationAndroidKey.js
/**
* Verify an attestation response with fmt 'android-key'
*/
async function verifyAttestationAndroidKey(options) {
	const { authData, clientDataHash, attStmt, credentialPublicKey, aaguid, rootCertificates } = options;
	const x5c = attStmt.get("x5c");
	const sig = attStmt.get("sig");
	const alg = attStmt.get("alg");
	if (!x5c) throw new Error("No attestation certificate provided in attestation statement (Android Key)");
	if (!sig) throw new Error("No attestation signature provided in attestation statement (Android Key)");
	if (!alg) throw new Error(`Attestation statement did not contain alg (Android Key)`);
	if (!isCOSEAlg(alg)) throw new Error(`Attestation statement contained invalid alg ${alg} (Android Key)`);
	/**
	* Verify that the public key in the first certificate in x5c matches the credentialPublicKey in
	* the attestedCredentialData in authenticatorData.
	*/
	const parsedCert = AsnParser.parse(x5c[0], Certificate);
	const parsedCertPubKey = new Uint8Array(parsedCert.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey);
	if (!areEqual(convertCOSEtoPKCS(credentialPublicKey), parsedCertPubKey)) throw new Error("Credential public key does not equal leaf cert public key (Android Key)");
	/**
	* Verify that the attestationChallenge field in the attestation certificate extension data is
	* identical to clientDataHash.
	*/
	const extKeyStore = parsedCert.tbsCertificate.extensions?.find((ext) => ext.extnID === id_ce_keyDescription);
	if (!extKeyStore) throw new Error("Certificate did not contain extKeyStore (Android Key)");
	const { attestationChallenge, teeEnforced, softwareEnforced } = AsnParser.parse(extKeyStore.extnValue, KeyDescription);
	if (!areEqual(new Uint8Array(attestationChallenge.buffer), clientDataHash)) throw new Error("Attestation challenge was not equal to client data hash (Android Key)");
	/**
	* The AuthorizationList.allApplications field is not present on either authorization list
	* (softwareEnforced nor teeEnforced), since PublicKeyCredential MUST be scoped to the RP ID.
	*
	* (i.e. These shouldn't contain the [600] tag)
	*/
	if (teeEnforced.allApplications !== void 0) throw new Error("teeEnforced contained \"allApplications [600]\" tag (Android Key)");
	if (softwareEnforced.allApplications !== void 0) throw new Error("teeEnforced contained \"allApplications [600]\" tag (Android Key)");
	const statement = await MetadataService.getStatement(aaguid);
	if (statement) try {
		await verifyAttestationWithMetadata({
			statement,
			credentialPublicKey,
			x5c,
			attestationStatementAlg: alg
		});
	} catch (err) {
		const _err = err;
		throw new Error(`${_err.message} (Android Key)`, { cause: _err });
	}
	else {
		/**
		* Verify that x5c contains a full certificate path.
		*/
		const x5cNoRootPEM = x5c.slice(0, -1).map(convertCertBufferToPEM);
		const x5cRootPEM = x5c.slice(-1).map(convertCertBufferToPEM);
		try {
			await validateCertificatePath(x5cNoRootPEM, x5cRootPEM);
		} catch (err) {
			const _err = err;
			throw new Error(`${_err.message} (Android Key)`, { cause: _err });
		}
		/**
		* Make sure the root certificate is one of the Google Hardware Attestation Root certificates
		*
		* https://developer.android.com/privacy-and-security/security-key-attestation#root_certificate
		*/
		if (rootCertificates.length > 0 && rootCertificates.indexOf(x5cRootPEM[0]) < 0) throw new Error("x5c root certificate was not a known root certificate (Android Key)");
	}
	return verifySignature({
		signature: sig,
		data: concat([authData, clientDataHash]),
		x509Certificate: x5c[0],
		hashAlgorithm: alg
	});
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifications/verifyAttestationApple.js
async function verifyAttestationApple(options) {
	const { attStmt, authData, clientDataHash, credentialPublicKey, rootCertificates } = options;
	const x5c = attStmt.get("x5c");
	if (!x5c) throw new Error("No attestation certificate provided in attestation statement (Apple)");
	/**
	* Verify certificate path
	*/
	try {
		await validateCertificatePath(x5c.map(convertCertBufferToPEM), rootCertificates);
	} catch (err) {
		throw new Error(`${err.message} (Apple)`);
	}
	const { extensions, subjectPublicKeyInfo } = AsnParser.parse(x5c[0], Certificate).tbsCertificate;
	if (!extensions) throw new Error("credCert missing extensions (Apple)");
	const extCertNonce = extensions.find((ext) => ext.extnID === "1.2.840.113635.100.8.2");
	if (!extCertNonce) throw new Error("credCert missing \"1.2.840.113635.100.8.2\" extension (Apple)");
	if (!areEqual(await toHash(concat([authData, clientDataHash])), new Uint8Array(extCertNonce.extnValue.buffer).slice(6))) throw new Error(`credCert nonce was not expected value (Apple)`);
	if (!areEqual(convertCOSEtoPKCS(credentialPublicKey), new Uint8Array(subjectPublicKeyInfo.subjectPublicKey))) throw new Error("Credential public key does not equal credCert public key (Apple)");
	return true;
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/registration/verifyRegistrationResponse.js
/**
* Verify that the user has legitimately completed the registration process
*
* **Options:**
*
* @param response - Response returned by **@simplewebauthn/browser**'s `startAuthentication()`
* @param expectedChallenge - The base64url-encoded `options.challenge` returned by `generateRegistrationOptions()`
* @param expectedOrigin - Website URL (or array of URLs) that the registration should have occurred on
* @param expectedRPID - RP ID (or array of IDs) that was specified in the registration options
* @param expectedType **(Optional)** - The response type expected ('webauthn.create')
* @param requireUserPresence **(Optional)** - Enforce user presence by the authenticator (or skip it during auto registration) Defaults to `true`
* @param requireUserVerification **(Optional)** - Enforce user verification by the authenticator (via PIN, fingerprint, etc...) Defaults to `true`
* @param supportedAlgorithmIDs **(Optional)** - Array of numeric COSE algorithm identifiers indicating supported public key algorithms. Import `COSEALG` from \@simplewebauthn/server/helpers for suitable values. Should be the same value that was specified for this same argument when calling `generateRegistrationOptions()`. Defaults to `[COSEALG.EdDSA, COSEALG.ES256, COSEALG.RS256]`
* @param attestationSafetyNetEnforceCTSCheck **(Optional)** - Require that an Android device's system integrity has not been tampered with if it uses SafetyNet attestation. Defaults to `true`
*/
async function verifyRegistrationResponse(options) {
	const { response, expectedChallenge, expectedOrigin, expectedRPID, expectedType, requireUserPresence = true, requireUserVerification = true, supportedAlgorithmIDs = defaultSupportedAlgorithmIDs, attestationSafetyNetEnforceCTSCheck = true } = options;
	const { id, rawId, type: credentialType, response: attestationResponse } = response;
	if (!id) throw new Error("Missing credential ID");
	if (id !== rawId) throw new Error("Credential ID was not base64url-encoded");
	if (credentialType !== "public-key") throw new Error(`Unexpected credential type ${credentialType}, expected "public-key"`);
	const clientDataJSON = decodeClientDataJSON(attestationResponse.clientDataJSON);
	const { type, origin, challenge, tokenBinding } = clientDataJSON;
	if (Array.isArray(expectedType)) {
		if (!expectedType.includes(type)) {
			const joinedExpectedType = expectedType.join(", ");
			throw new Error(`Unexpected registration response type "${type}", expected one of: ${joinedExpectedType}`);
		}
	} else if (expectedType) {
		if (type !== expectedType) throw new Error(`Unexpected registration response type "${type}", expected "${expectedType}"`);
	} else if (type !== "webauthn.create") throw new Error(`Unexpected registration response type: ${type}`);
	if (typeof expectedChallenge === "function") {
		if (!await expectedChallenge(challenge)) throw new Error(`Custom challenge verifier returned false for registration response challenge "${challenge}"`);
	} else if (challenge !== expectedChallenge) throw new Error(`Unexpected registration response challenge "${challenge}", expected "${expectedChallenge}"`);
	if (Array.isArray(expectedOrigin)) {
		if (!expectedOrigin.includes(origin)) throw new Error(`Unexpected registration response origin "${origin}", expected one of: ${expectedOrigin.join(", ")}`);
	} else if (origin !== expectedOrigin) throw new Error(`Unexpected registration response origin "${origin}", expected "${expectedOrigin}"`);
	if (tokenBinding) {
		if (typeof tokenBinding !== "object") throw new Error(`Unexpected value for TokenBinding "${tokenBinding}"`);
		if ([
			"present",
			"supported",
			"not-supported"
		].indexOf(tokenBinding.status) < 0) throw new Error(`Unexpected tokenBinding.status value of "${tokenBinding.status}"`);
	}
	const attestationObject = toBuffer(attestationResponse.attestationObject);
	const decodedAttestationObject = decodeAttestationObject(attestationObject);
	const fmt = decodedAttestationObject.get("fmt");
	const authData = decodedAttestationObject.get("authData");
	const attStmt = decodedAttestationObject.get("attStmt");
	const { aaguid, rpIdHash, flags, credentialID, counter, credentialPublicKey, extensionsData } = parseAuthenticatorData(authData);
	let matchedRPID;
	if (expectedRPID) {
		let expectedRPIDs = [];
		if (typeof expectedRPID === "string") expectedRPIDs = [expectedRPID];
		else expectedRPIDs = expectedRPID;
		matchedRPID = await matchExpectedRPID(rpIdHash, expectedRPIDs);
	}
	if (requireUserPresence && !flags.up) throw new Error("User presence was required, but user was not present");
	if (requireUserVerification && !flags.uv) throw new Error("User verification was required, but user could not be verified");
	if (!credentialID) throw new Error("No credential ID was provided by authenticator");
	if (!credentialPublicKey) throw new Error("No public key was provided by authenticator");
	if (!aaguid) throw new Error("No AAGUID was present during registration");
	const pubKeyAlg = decodeCredentialPublicKey(credentialPublicKey).get(COSEKEYS.alg);
	if (typeof pubKeyAlg !== "number") throw new Error("Credential public key was missing numeric alg");
	if (!supportedAlgorithmIDs.includes(pubKeyAlg)) {
		const supported = supportedAlgorithmIDs.join(", ");
		throw new Error(`Unexpected public key alg "${pubKeyAlg}", expected one of "${supported}"`);
	}
	/**
	* If the runtime doesn't support PQC passkeys then terminate here at the first sign of a PQC
	* algorithm so that downstream issues that arise due to lack of PQC support won't get masked as
	* unexpected behavior.
	*
	* I'm choosing to raise here even if attestation is "none" because it feels weird to allow an RP
	* to parse a registration response w/o attestation only to encounter failure when trying to auth
	* with the PQC passkey and the runtime doesn't support PQC.
	*/
	if (isPQCCOSEAlg(pubKeyAlg) && !SettingsService.runtimeSupportsPQC()) throw new PQCNotSupportedError(pubKeyAlg);
	const verifierOpts = {
		aaguid,
		attStmt,
		authData,
		clientDataHash: await toHash(toBuffer(attestationResponse.clientDataJSON)),
		credentialID,
		credentialPublicKey,
		rootCertificates: SettingsService.getRootCertificates({ identifier: fmt }),
		rpIdHash,
		attestationSafetyNetEnforceCTSCheck
	};
	/**
	* Verification can only be performed when attestation = 'direct'
	*/
	let verified = false;
	if (fmt === "fido-u2f") verified = await verifyAttestationFIDOU2F(verifierOpts);
	else if (fmt === "packed") verified = await verifyAttestationPacked(verifierOpts);
	else if (fmt === "android-safetynet") verified = await verifyAttestationAndroidSafetyNet(verifierOpts);
	else if (fmt === "android-key") verified = await verifyAttestationAndroidKey(verifierOpts);
	else if (fmt === "tpm") verified = await verifyAttestationTPM(verifierOpts);
	else if (fmt === "apple") verified = await verifyAttestationApple(verifierOpts);
	else if (fmt === "none") {
		if (attStmt.size > 0) throw new Error("None attestation had unexpected attestation statement");
		verified = true;
	} else throw new Error(`Unsupported Attestation Format: ${fmt}`);
	if (!verified) return { verified: false };
	const { credentialDeviceType, credentialBackedUp } = parseBackupFlags(flags);
	return {
		verified: true,
		registrationInfo: {
			fmt,
			aaguid: convertAAGUIDToString(aaguid),
			credentialType,
			credential: {
				id: fromBuffer(credentialID),
				publicKey: credentialPublicKey,
				counter,
				transports: response.response.transports
			},
			attestationObject,
			userVerified: flags.uv,
			credentialDeviceType,
			credentialBackedUp,
			origin: clientDataJSON.origin,
			rpID: matchedRPID,
			authenticatorExtensionResults: extensionsData
		}
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/authentication/generateAuthenticationOptions.js
/**
* Prepare a value to pass into navigator.credentials.get(...) for authenticator authentication
*
* **Options:**
*
* @param rpID - Valid domain name (after `https://`)
* @param allowCredentials **(Optional)** - Authenticators previously registered by the user, if any. If undefined the client will ask the user which credential they want to use
* @param challenge **(Optional)** - Random value the authenticator needs to sign and pass back user for authentication. Defaults to generating a random value
* @param timeout **(Optional)** - How long (in ms) the user can take to complete authentication. Defaults to `60000`
* @param userVerification **(Optional)** - Set to `'discouraged'` when asserting as part of a 2FA flow, otherwise set to `'preferred'` or `'required'` as desired. Defaults to `"preferred"`
* @param extensions **(Optional)** - Additional plugins the authenticator or browser should use during authentication
*/
async function generateAuthenticationOptions(options) {
	const { allowCredentials, challenge = await generateChallenge(), timeout = 6e4, userVerification = "preferred", extensions, rpID } = options;
	/**
	* Preserve ability to specify `string` values for challenges
	*/
	let _challenge = challenge;
	if (typeof _challenge === "string") _challenge = fromUTF8String(_challenge);
	return {
		rpId: rpID,
		challenge: fromBuffer(_challenge),
		allowCredentials: allowCredentials?.map((cred) => {
			if (!isBase64URL(cred.id)) throw new Error(`allowCredential id "${cred.id}" is not a valid base64url string`);
			return {
				...cred,
				id: trimPadding(cred.id),
				type: "public-key"
			};
		}),
		timeout,
		userVerification,
		extensions
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/authentication/verifyAuthenticationResponse.js
/**
* Verify that the user has legitimately completed the authentication process
*
* **Options:**
*
* @param response - Response returned by **@simplewebauthn/browser**'s `startAuthentication()`
* @param expectedChallenge - The base64url-encoded `options.challenge` returned by `generateAuthenticationOptions()`
* @param expectedOrigin - Website URL (or array of URLs) that the registration should have occurred on
* @param expectedRPID - RP ID (or array of IDs) that was specified in the registration options
* @param credential - An internal {@link WebAuthnCredential} corresponding to `id` in the authentication response
* @param expectedType **(Optional)** - The response type expected ('webauthn.get')
* @param requireUserVerification **(Optional)** - Enforce user verification by the authenticator (via PIN, fingerprint, etc...) Defaults to `true`
* @param advancedFIDOConfig **(Optional)** - Options for satisfying more stringent FIDO RP feature requirements
* @param advancedFIDOConfig.userVerification **(Optional)** - Enable alternative rules for evaluating the User Presence and User Verified flags in authenticator data: UV (and UP) flags are optional unless this value is `"required"`
*/
async function verifyAuthenticationResponse(options) {
	const { response, expectedChallenge, expectedOrigin, expectedRPID, expectedType, expectedTopOrigin, credential, requireUserVerification = true, advancedFIDOConfig } = options;
	const { id, rawId, type: credentialType, response: assertionResponse } = response;
	if (!id) throw new Error("Missing credential ID");
	if (id !== rawId) throw new Error("Credential ID was not base64url-encoded");
	if (credentialType !== "public-key") throw new Error(`Unexpected credential type ${credentialType}, expected "public-key"`);
	if (!response) throw new Error("Credential missing response");
	if (typeof assertionResponse?.clientDataJSON !== "string") throw new Error("Credential response clientDataJSON was not a string");
	const clientDataJSON = decodeClientDataJSON(assertionResponse.clientDataJSON);
	const { type, origin, challenge, tokenBinding, crossOrigin, topOrigin } = clientDataJSON;
	if (Array.isArray(expectedType)) {
		if (!expectedType.includes(type)) {
			const joinedExpectedType = expectedType.join(", ");
			throw new Error(`Unexpected authentication response type "${type}", expected one of: ${joinedExpectedType}`);
		}
	} else if (expectedType) {
		if (type !== expectedType) throw new Error(`Unexpected authentication response type "${type}", expected "${expectedType}"`);
	} else if (type !== "webauthn.get") throw new Error(`Unexpected authentication response type: ${type}`);
	if (typeof expectedChallenge === "function") {
		if (!await expectedChallenge(challenge)) throw new Error(`Custom challenge verifier returned false for registration response challenge "${challenge}"`);
	} else if (challenge !== expectedChallenge) throw new Error(`Unexpected authentication response challenge "${challenge}", expected "${expectedChallenge}"`);
	if (crossOrigin) {
		/**
		* TODO: Since Safari doesn't support `topOrigin` as of May 2026, only check this when
		* `topOrigin` is available for now.
		*/
		if (topOrigin) {
			if (!expectedTopOrigin)
 /**
			* If `expectedTopOrigin` is not set, this should be considered an unexpected cross-origin
			* request. Reject the response while helping the RP understand how they need to update this
			* method call if they want to support verification of such WebAuthn authentication requests.
			*/
			throw new Error(`Detected cross-origin authentication response from top origin of "${topOrigin}", but a value for \`expectedTopOrigin\` was not specified when calling \`verifyAuthenticationResponse()\``);
			if (Array.isArray(expectedTopOrigin)) {
				if (!expectedTopOrigin.includes(topOrigin)) {
					const joinedExpectedTopOrigin = expectedTopOrigin.join(", ");
					throw new Error(`Unexpected cross-origin authentication response top origin of "${topOrigin}", expected one of: ${joinedExpectedTopOrigin}`);
				}
			} else if (topOrigin !== expectedTopOrigin) throw new Error(`Unexpected cross-origin authentication response top origin of "${topOrigin}", expected: ${expectedTopOrigin}`);
		}
	} else if (topOrigin)
 /**
	* If `topOrigin` is set despite `crossOrigin` being false, this is an unexpected request.
	*
	* See https://w3c.github.io/webauthn/#dom-collectedclientdata-toporigin.
	*/
	throw new Error(`Unexpected top origin of "${topOrigin}" within a non-cross-origin authentication response. This error should be reported to the browser vendor as a WebAuthn specification violation with a link to https://w3c.github.io/webauthn/#dom-collectedclientdata-toporigin`);
	if (Array.isArray(expectedOrigin)) {
		if (!expectedOrigin.includes(origin)) {
			const joinedExpectedOrigin = expectedOrigin.join(", ");
			throw new Error(`Unexpected authentication response origin "${origin}", expected one of: ${joinedExpectedOrigin}`);
		}
	} else if (origin !== expectedOrigin) throw new Error(`Unexpected authentication response origin "${origin}", expected "${expectedOrigin}"`);
	if (!isBase64URL(assertionResponse.authenticatorData)) throw new Error("Credential response authenticatorData was not a base64url string");
	if (!isBase64URL(assertionResponse.signature)) throw new Error("Credential response signature was not a base64url string");
	if (assertionResponse.userHandle && typeof assertionResponse.userHandle !== "string") throw new Error("Credential response userHandle was not a string");
	if (tokenBinding) {
		if (typeof tokenBinding !== "object") throw new Error("ClientDataJSON tokenBinding was not an object");
		if ([
			"present",
			"supported",
			"notSupported"
		].indexOf(tokenBinding.status) < 0) throw new Error(`Unexpected tokenBinding status ${tokenBinding.status}`);
	}
	const authDataBuffer = toBuffer(assertionResponse.authenticatorData);
	const { rpIdHash, flags, counter, extensionsData } = parseAuthenticatorData(authDataBuffer);
	let expectedRPIDs = [];
	if (typeof expectedRPID === "string") expectedRPIDs = [expectedRPID];
	else expectedRPIDs = expectedRPID;
	const matchedRPID = await matchExpectedRPID(rpIdHash, expectedRPIDs);
	if (advancedFIDOConfig !== void 0) {
		const { userVerification: fidoUserVerification } = advancedFIDOConfig;
		/**
		* Use FIDO Conformance-defined rules for verifying UP and UV flags
		*/
		if (fidoUserVerification === "required") {
			if (!flags.uv) throw new Error("User verification required, but user could not be verified");
		} else if (fidoUserVerification === "preferred" || fidoUserVerification === "discouraged") {}
	} else {
		/**
		* Use WebAuthn spec-defined rules for verifying UP and UV flags
		*/
		if (!flags.up) throw new Error("User not present during authentication");
		if (requireUserVerification && !flags.uv) throw new Error("User verification required, but user could not be verified");
	}
	const signatureBase = concat([authDataBuffer, await toHash(toBuffer(assertionResponse.clientDataJSON))]);
	const signature = toBuffer(assertionResponse.signature);
	if ((counter > 0 || credential.counter > 0) && counter <= credential.counter) throw new Error(`Response counter value ${counter} was lower than expected ${credential.counter}`);
	const pubKeyAlg = decodeCredentialPublicKey(credential.publicKey).get(COSEKEYS.alg);
	if (typeof pubKeyAlg !== "number") throw new Error("Credential public key was missing numeric alg");
	if (isPQCCOSEAlg(pubKeyAlg) && !SettingsService.runtimeSupportsPQC()) throw new PQCNotSupportedError(pubKeyAlg);
	const { credentialDeviceType, credentialBackedUp } = parseBackupFlags(flags);
	return {
		verified: await verifySignature({
			signature,
			data: signatureBase,
			credentialPublicKey: credential.publicKey
		}),
		authenticationInfo: {
			newCounter: counter,
			credentialID: credential.id,
			userVerified: flags.uv,
			credentialDeviceType,
			credentialBackedUp,
			authenticatorExtensionResults: extensionsData,
			origin: clientDataJSON.origin,
			rpID: matchedRPID
		}
	};
}
//#endregion
//#region node_modules/@simplewebauthn/server/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	BaseMetadataService: () => BaseMetadataService,
	MetadataService: () => MetadataService,
	PQCNotSupportedError: () => PQCNotSupportedError,
	SettingsService: () => SettingsService,
	SimpleWebAuthnError: () => SimpleWebAuthnError,
	defaultSupportedAlgorithmIDs: () => defaultSupportedAlgorithmIDs,
	generateAuthenticationOptions: () => generateAuthenticationOptions,
	generateRegistrationOptions: () => generateRegistrationOptions,
	verifyAuthenticationResponse: () => verifyAuthenticationResponse,
	verifyRegistrationResponse: () => verifyRegistrationResponse
});
//#endregion
export { require_Reflect as n, esm_exports as t };
