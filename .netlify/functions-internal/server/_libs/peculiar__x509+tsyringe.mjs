import { b as combine, d as AsnUtf8StringConverter, f as OctetString, r as AsnConvert, v as BufferSourceConverter, x as isEqual, y as Convert } from "./@peculiar/asn1-android+[...].mjs";
import { A as id_kp_timeStamping, B as GeneralNames$1, C as ExtendedKeyUsage$1, D as id_kp_codeSigning, E as id_kp_clientAuth, F as DistributionPointName, G as id_ce_authorityKeyIdentifier, H as id_ce_basicConstraints, I as id_ce_cRLDistributionPoints, J as id_pe_authorityInfoAccess, K as AccessDescription, L as CertificatePolicies, M as id_ce_cRLReasons, N as CRLDistributionPoints, O as id_kp_emailProtection, P as DistributionPoint, Q as id_ad_timeStamping, R as PolicyInformation, S as id_ce_invalidityDate, T as id_kp_OCSPSigning, U as AuthorityKeyIdentifier, V as BasicConstraints, W as KeyIdentifier, X as id_ad_caRepository, Y as id_ad_caIssuers, Z as id_ad_ocsp, _ as id_ce_subjectAltName, a as RevokedCertificate, at as DirectoryString, b as id_ce_issuerAltName, c as Extension$1, d as SubjectPublicKeyInfo, f as AlgorithmIdentifier, g as SubjectAlternativeName, h as Attribute$1, i as CertificateList, it as AttributeTypeAndValue, j as CRLReason, k as id_kp_serverAuth, l as Extensions, m as id_ce_subjectKeyIdentifier, nt as GeneralName$1, o as Certificate, ot as Name$1, p as SubjectKeyIdentifier, q as AuthorityInfoAccessSyntax, rt as OtherName, s as Version, st as RelativeDistinguishedName, u as Time, v as KeyUsage, w as id_ce_extKeyUsage, x as InvalidityDate, y as id_ce_keyUsage, z as id_ce_certificatePolicies } from "./@peculiar/asn1-asym-key+[...].mjs";
import { a as ContentInfo, d as CMSVersion, i as EncapsulatedContent, n as id_data, o as CertificateChoices, r as id_signedData, s as CertificateSet, t as SignedData } from "./@peculiar/asn1-cms+[...].mjs";
import { a as ecdsaWithSHA384, c as id_ecdsaWithSHA1, d as id_ecdsaWithSHA384, f as id_ecdsaWithSHA512, h as id_secp521r1, i as ecdsaWithSHA256, l as id_ecdsaWithSHA224, m as id_secp384r1, n as ECParameters, o as ecdsaWithSHA512, p as id_secp256r1, r as ecdsaWithSHA1, s as id_ecPublicKey, t as ECDSASigValue, u as id_ecdsaWithSHA256 } from "./peculiar__asn1-ecc.mjs";
import { a as id_mgf1, c as id_sha1WithRSAEncryption, d as id_sha256, f as id_sha256WithRSAEncryption, g as id_sha512WithRSAEncryption, h as id_sha512, i as id_RSASSA_PSS, l as id_sha224, m as id_sha384WithRSAEncryption, n as RSAPublicKey, o as id_rsaEncryption, p as id_sha384, r as RsaSaPssParams, s as id_sha1, u as id_sha224WithRSAEncryption } from "./@peculiar/asn1-pfx+[...].mjs";
import { n as id_pkcs9_at_challengePassword, r as id_pkcs9_at_extensionRequest, t as ChallengePassword } from "./peculiar__asn1-pkcs9.mjs";
import { a as id_slh_dsa_sha2_128s, c as id_slh_dsa_sha2_256f, d as id_slh_dsa_shake_128s, f as id_slh_dsa_shake_192f, h as id_slh_dsa_shake_256s, i as id_slh_dsa_sha2_128f, l as id_slh_dsa_sha2_256s, m as id_slh_dsa_shake_256f, n as id_ml_dsa_65, o as id_slh_dsa_sha2_192f, p as id_slh_dsa_shake_192s, r as id_ml_dsa_87, s as id_slh_dsa_sha2_192s, t as id_ml_dsa_44, u as id_slh_dsa_shake_128f } from "./@peculiar/asn1-x509-post-quantum+[...].mjs";
import { t as CertificationRequest } from "./peculiar__asn1-csr.mjs";
import { __awaiter, __classPrivateFieldGet, __classPrivateFieldSet, __decorate, __extends, __generator, __read, __spread, __values } from "tslib";
//#region node_modules/tsyringe/dist/esm5/types/lifecycle.js
var Lifecycle;
(function(Lifecycle) {
	Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
	Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
	Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
	Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
var lifecycle_default = Lifecycle;
function getParamInfo(target) {
	var params = Reflect.getMetadata("design:paramtypes", target) || [];
	var injectionTokens = Reflect.getOwnMetadata("injectionTokens", target) || {};
	Object.keys(injectionTokens).forEach(function(key) {
		params[+key] = injectionTokens[key];
	});
	return params;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/providers/class-provider.js
function isClassProvider(provider) {
	return !!provider.useClass;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/providers/factory-provider.js
function isFactoryProvider(provider) {
	return !!provider.useFactory;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/lazy-helpers.js
var DelayedConstructor = function() {
	function DelayedConstructor(wrap) {
		this.wrap = wrap;
		this.reflectMethods = [
			"get",
			"getPrototypeOf",
			"setPrototypeOf",
			"getOwnPropertyDescriptor",
			"defineProperty",
			"has",
			"set",
			"deleteProperty",
			"apply",
			"construct",
			"ownKeys"
		];
	}
	DelayedConstructor.prototype.createProxy = function(createObject) {
		var _this = this;
		var target = {};
		var init = false;
		var value;
		var delayedObject = function() {
			if (!init) {
				value = createObject(_this.wrap());
				init = true;
			}
			return value;
		};
		return new Proxy(target, this.createHandler(delayedObject));
	};
	DelayedConstructor.prototype.createHandler = function(delayedObject) {
		var handler = {};
		var install = function(name) {
			handler[name] = function() {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
				args[0] = delayedObject();
				return Reflect[name].apply(void 0, __spread(args));
			};
		};
		this.reflectMethods.forEach(install);
		return handler;
	};
	return DelayedConstructor;
}();
//#endregion
//#region node_modules/tsyringe/dist/esm5/providers/injection-token.js
function isNormalToken(token) {
	return typeof token === "string" || typeof token === "symbol";
}
function isTokenDescriptor(descriptor) {
	return typeof descriptor === "object" && "token" in descriptor && "multiple" in descriptor;
}
function isTransformDescriptor(descriptor) {
	return typeof descriptor === "object" && "token" in descriptor && "transform" in descriptor;
}
function isConstructorToken(token) {
	return typeof token === "function" || token instanceof DelayedConstructor;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/providers/token-provider.js
function isTokenProvider(provider) {
	return !!provider.useToken;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/providers/value-provider.js
function isValueProvider(provider) {
	return provider.useValue != void 0;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/providers/provider.js
function isProvider(provider) {
	return isClassProvider(provider) || isValueProvider(provider) || isTokenProvider(provider) || isFactoryProvider(provider);
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/registry-base.js
var RegistryBase = function() {
	function RegistryBase() {
		this._registryMap = /* @__PURE__ */ new Map();
	}
	RegistryBase.prototype.entries = function() {
		return this._registryMap.entries();
	};
	RegistryBase.prototype.getAll = function(key) {
		this.ensure(key);
		return this._registryMap.get(key);
	};
	RegistryBase.prototype.get = function(key) {
		this.ensure(key);
		var value = this._registryMap.get(key);
		return value[value.length - 1] || null;
	};
	RegistryBase.prototype.set = function(key, value) {
		this.ensure(key);
		this._registryMap.get(key).push(value);
	};
	RegistryBase.prototype.setAll = function(key, value) {
		this._registryMap.set(key, value);
	};
	RegistryBase.prototype.has = function(key) {
		this.ensure(key);
		return this._registryMap.get(key).length > 0;
	};
	RegistryBase.prototype.clear = function() {
		this._registryMap.clear();
	};
	RegistryBase.prototype.ensure = function(key) {
		if (!this._registryMap.has(key)) this._registryMap.set(key, []);
	};
	return RegistryBase;
}();
//#endregion
//#region node_modules/tsyringe/dist/esm5/registry.js
var Registry = function(_super) {
	__extends(Registry, _super);
	function Registry() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return Registry;
}(RegistryBase);
//#endregion
//#region node_modules/tsyringe/dist/esm5/resolution-context.js
var ResolutionContext = function() {
	function ResolutionContext() {
		this.scopedResolutions = /* @__PURE__ */ new Map();
	}
	return ResolutionContext;
}();
//#endregion
//#region node_modules/tsyringe/dist/esm5/error-helpers.js
function formatDependency(params, idx) {
	if (params === null) return "at position #" + idx;
	return "\"" + params.split(",")[idx].trim() + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
	if (indent === void 0) indent = "    ";
	return __spread([msg], e.message.split("\n").map(function(l) {
		return indent + l;
	})).join("\n");
}
function formatErrorCtor(ctor, paramIdx, error) {
	var _b = __read(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2)[1];
	return composeErrorMessage("Cannot inject the dependency " + formatDependency(_b === void 0 ? null : _b, paramIdx) + " of \"" + ctor.name + "\" constructor. Reason:", error);
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/types/disposable.js
function isDisposable(value) {
	if (typeof value.dispose !== "function") return false;
	if (value.dispose.length > 0) return false;
	return true;
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/interceptors.js
var PreResolutionInterceptors = function(_super) {
	__extends(PreResolutionInterceptors, _super);
	function PreResolutionInterceptors() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return PreResolutionInterceptors;
}(RegistryBase);
var PostResolutionInterceptors = function(_super) {
	__extends(PostResolutionInterceptors, _super);
	function PostResolutionInterceptors() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return PostResolutionInterceptors;
}(RegistryBase);
var Interceptors = function() {
	function Interceptors() {
		this.preResolution = new PreResolutionInterceptors();
		this.postResolution = new PostResolutionInterceptors();
	}
	return Interceptors;
}();
//#endregion
//#region node_modules/tsyringe/dist/esm5/dependency-container.js
var typeInfo = /* @__PURE__ */ new Map();
var instance = new (function() {
	function InternalDependencyContainer(parent) {
		this.parent = parent;
		this._registry = new Registry();
		this.interceptors = new Interceptors();
		this.disposed = false;
		this.disposables = /* @__PURE__ */ new Set();
	}
	InternalDependencyContainer.prototype.register = function(token, providerOrConstructor, options) {
		if (options === void 0) options = { lifecycle: lifecycle_default.Transient };
		this.ensureNotDisposed();
		var provider;
		if (!isProvider(providerOrConstructor)) provider = { useClass: providerOrConstructor };
		else provider = providerOrConstructor;
		if (isTokenProvider(provider)) {
			var path = [token];
			var tokenProvider = provider;
			while (tokenProvider != null) {
				var currentToken = tokenProvider.useToken;
				if (path.includes(currentToken)) throw new Error("Token registration cycle detected! " + __spread(path, [currentToken]).join(" -> "));
				path.push(currentToken);
				var registration = this._registry.get(currentToken);
				if (registration && isTokenProvider(registration.provider)) tokenProvider = registration.provider;
				else tokenProvider = null;
			}
		}
		if (options.lifecycle === lifecycle_default.Singleton || options.lifecycle == lifecycle_default.ContainerScoped || options.lifecycle == lifecycle_default.ResolutionScoped) {
			if (isValueProvider(provider) || isFactoryProvider(provider)) throw new Error("Cannot use lifecycle \"" + lifecycle_default[options.lifecycle] + "\" with ValueProviders or FactoryProviders");
		}
		this._registry.set(token, {
			provider,
			options
		});
		return this;
	};
	InternalDependencyContainer.prototype.registerType = function(from, to) {
		this.ensureNotDisposed();
		if (isNormalToken(to)) return this.register(from, { useToken: to });
		return this.register(from, { useClass: to });
	};
	InternalDependencyContainer.prototype.registerInstance = function(token, instance) {
		this.ensureNotDisposed();
		return this.register(token, { useValue: instance });
	};
	InternalDependencyContainer.prototype.registerSingleton = function(from, to) {
		this.ensureNotDisposed();
		if (isNormalToken(from)) {
			if (isNormalToken(to)) return this.register(from, { useToken: to }, { lifecycle: lifecycle_default.Singleton });
			else if (to) return this.register(from, { useClass: to }, { lifecycle: lifecycle_default.Singleton });
			throw new Error("Cannot register a type name as a singleton without a \"to\" token");
		}
		var useClass = from;
		if (to && !isNormalToken(to)) useClass = to;
		return this.register(from, { useClass }, { lifecycle: lifecycle_default.Singleton });
	};
	InternalDependencyContainer.prototype.resolve = function(token, context, isOptional) {
		if (context === void 0) context = new ResolutionContext();
		if (isOptional === void 0) isOptional = false;
		this.ensureNotDisposed();
		var registration = this.getRegistration(token);
		if (!registration && isNormalToken(token)) {
			if (isOptional) return;
			throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
		}
		this.executePreResolutionInterceptor(token, "Single");
		if (registration) {
			var result = this.resolveRegistration(registration, context);
			this.executePostResolutionInterceptor(token, result, "Single");
			return result;
		}
		if (isConstructorToken(token)) {
			var result = this.construct(token, context);
			this.executePostResolutionInterceptor(token, result, "Single");
			return result;
		}
		throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
	};
	InternalDependencyContainer.prototype.executePreResolutionInterceptor = function(token, resolutionType) {
		var e_1, _a;
		if (this.interceptors.preResolution.has(token)) {
			var remainingInterceptors = [];
			try {
				for (var _b = __values(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
					var interceptor = _c.value;
					if (interceptor.options.frequency != "Once") remainingInterceptors.push(interceptor);
					interceptor.callback(token, resolutionType);
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			this.interceptors.preResolution.setAll(token, remainingInterceptors);
		}
	};
	InternalDependencyContainer.prototype.executePostResolutionInterceptor = function(token, result, resolutionType) {
		var e_2, _a;
		if (this.interceptors.postResolution.has(token)) {
			var remainingInterceptors = [];
			try {
				for (var _b = __values(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
					var interceptor = _c.value;
					if (interceptor.options.frequency != "Once") remainingInterceptors.push(interceptor);
					interceptor.callback(token, result, resolutionType);
				}
			} catch (e_2_1) {
				e_2 = { error: e_2_1 };
			} finally {
				try {
					if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
				} finally {
					if (e_2) throw e_2.error;
				}
			}
			this.interceptors.postResolution.setAll(token, remainingInterceptors);
		}
	};
	InternalDependencyContainer.prototype.resolveRegistration = function(registration, context) {
		this.ensureNotDisposed();
		if (registration.options.lifecycle === lifecycle_default.ResolutionScoped && context.scopedResolutions.has(registration)) return context.scopedResolutions.get(registration);
		var isSingleton = registration.options.lifecycle === lifecycle_default.Singleton;
		var isContainerScoped = registration.options.lifecycle === lifecycle_default.ContainerScoped;
		var returnInstance = isSingleton || isContainerScoped;
		var resolved;
		if (isValueProvider(registration.provider)) resolved = registration.provider.useValue;
		else if (isTokenProvider(registration.provider)) resolved = returnInstance ? registration.instance || (registration.instance = this.resolve(registration.provider.useToken, context)) : this.resolve(registration.provider.useToken, context);
		else if (isClassProvider(registration.provider)) resolved = returnInstance ? registration.instance || (registration.instance = this.construct(registration.provider.useClass, context)) : this.construct(registration.provider.useClass, context);
		else if (isFactoryProvider(registration.provider)) resolved = registration.provider.useFactory(this);
		else resolved = this.construct(registration.provider, context);
		if (registration.options.lifecycle === lifecycle_default.ResolutionScoped) context.scopedResolutions.set(registration, resolved);
		return resolved;
	};
	InternalDependencyContainer.prototype.resolveAll = function(token, context, isOptional) {
		var _this = this;
		if (context === void 0) context = new ResolutionContext();
		if (isOptional === void 0) isOptional = false;
		this.ensureNotDisposed();
		var registrations = this.getAllRegistrations(token);
		if (!registrations && isNormalToken(token)) {
			if (isOptional) return [];
			throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
		}
		this.executePreResolutionInterceptor(token, "All");
		if (registrations) {
			var result_1 = registrations.map(function(item) {
				return _this.resolveRegistration(item, context);
			});
			this.executePostResolutionInterceptor(token, result_1, "All");
			return result_1;
		}
		var result = [this.construct(token, context)];
		this.executePostResolutionInterceptor(token, result, "All");
		return result;
	};
	InternalDependencyContainer.prototype.isRegistered = function(token, recursive) {
		if (recursive === void 0) recursive = false;
		this.ensureNotDisposed();
		return this._registry.has(token) || recursive && (this.parent || false) && this.parent.isRegistered(token, true);
	};
	InternalDependencyContainer.prototype.reset = function() {
		this.ensureNotDisposed();
		this._registry.clear();
		this.interceptors.preResolution.clear();
		this.interceptors.postResolution.clear();
	};
	InternalDependencyContainer.prototype.clearInstances = function() {
		var e_3, _a;
		this.ensureNotDisposed();
		try {
			for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
				var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
				this._registry.setAll(token, registrations.filter(function(registration) {
					return !isValueProvider(registration.provider);
				}).map(function(registration) {
					registration.instance = void 0;
					return registration;
				}));
			}
		} catch (e_3_1) {
			e_3 = { error: e_3_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_3) throw e_3.error;
			}
		}
	};
	InternalDependencyContainer.prototype.createChildContainer = function() {
		var e_4, _a;
		this.ensureNotDisposed();
		var childContainer = new InternalDependencyContainer(this);
		try {
			for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
				var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
				if (registrations.some(function(_a) {
					return _a.options.lifecycle === lifecycle_default.ContainerScoped;
				})) childContainer._registry.setAll(token, registrations.map(function(registration) {
					if (registration.options.lifecycle === lifecycle_default.ContainerScoped) return {
						provider: registration.provider,
						options: registration.options
					};
					return registration;
				}));
			}
		} catch (e_4_1) {
			e_4 = { error: e_4_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_4) throw e_4.error;
			}
		}
		return childContainer;
	};
	InternalDependencyContainer.prototype.beforeResolution = function(token, callback, options) {
		if (options === void 0) options = { frequency: "Always" };
		this.interceptors.preResolution.set(token, {
			callback,
			options
		});
	};
	InternalDependencyContainer.prototype.afterResolution = function(token, callback, options) {
		if (options === void 0) options = { frequency: "Always" };
		this.interceptors.postResolution.set(token, {
			callback,
			options
		});
	};
	InternalDependencyContainer.prototype.dispose = function() {
		return __awaiter(this, void 0, void 0, function() {
			var promises;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						this.disposed = true;
						promises = [];
						this.disposables.forEach(function(disposable) {
							var maybePromise = disposable.dispose();
							if (maybePromise) promises.push(maybePromise);
						});
						return [4, Promise.all(promises)];
					case 1:
						_a.sent();
						return [2];
				}
			});
		});
	};
	InternalDependencyContainer.prototype.getRegistration = function(token) {
		if (this.isRegistered(token)) return this._registry.get(token);
		if (this.parent) return this.parent.getRegistration(token);
		return null;
	};
	InternalDependencyContainer.prototype.getAllRegistrations = function(token) {
		if (this.isRegistered(token)) return this._registry.getAll(token);
		if (this.parent) return this.parent.getAllRegistrations(token);
		return null;
	};
	InternalDependencyContainer.prototype.construct = function(ctor, context) {
		var _this = this;
		if (ctor instanceof DelayedConstructor) return ctor.createProxy(function(target) {
			return _this.resolve(target, context);
		});
		var instance = (function() {
			var paramInfo = typeInfo.get(ctor);
			if (!paramInfo || paramInfo.length === 0) if (ctor.length === 0) return new ctor();
			else throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
			var params = paramInfo.map(_this.resolveParams(context, ctor));
			return new (ctor.bind.apply(ctor, __spread([void 0], params)))();
		})();
		if (isDisposable(instance)) this.disposables.add(instance);
		return instance;
	};
	InternalDependencyContainer.prototype.resolveParams = function(context, ctor) {
		var _this = this;
		return function(param, idx) {
			var _a, _b, _c;
			try {
				if (isTokenDescriptor(param)) if (isTransformDescriptor(param)) return param.multiple ? (_a = _this.resolve(param.transform)).transform.apply(_a, __spread([_this.resolveAll(param.token, new ResolutionContext(), param.isOptional)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, __spread([_this.resolve(param.token, context, param.isOptional)], param.transformArgs));
				else return param.multiple ? _this.resolveAll(param.token, new ResolutionContext(), param.isOptional) : _this.resolve(param.token, context, param.isOptional);
				else if (isTransformDescriptor(param)) return (_c = _this.resolve(param.transform, context)).transform.apply(_c, __spread([_this.resolve(param.token, context)], param.transformArgs));
				return _this.resolve(param, context);
			} catch (e) {
				throw new Error(formatErrorCtor(ctor, idx, e));
			}
		};
	};
	InternalDependencyContainer.prototype.ensureNotDisposed = function() {
		if (this.disposed) throw new Error("This container has been disposed, you cannot interact with a disposed container");
	};
	return InternalDependencyContainer;
}())();
//#endregion
//#region node_modules/tsyringe/dist/esm5/decorators/injectable.js
function injectable(options) {
	return function(target) {
		typeInfo.set(target, getParamInfo(target));
		if (options && options.token) if (!Array.isArray(options.token)) instance.register(options.token, target);
		else options.token.forEach(function(token) {
			instance.register(token, target);
		});
	};
}
//#endregion
//#region node_modules/tsyringe/dist/esm5/index.js
if (typeof Reflect === "undefined" || !Reflect.getMetadata) throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
//#endregion
//#region node_modules/@peculiar/x509/build/x509.es.js
/*!
* MIT License
* 
* Copyright (c) Peculiar Ventures. All rights reserved.
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/
var diAlgorithm = "crypto.algorithm";
var AlgorithmProvider = class {
	getAlgorithms() {
		return instance.resolveAll(diAlgorithm);
	}
	toAsnAlgorithm(alg) {
		const algCopy = { ...alg };
		if (algCopy.hash && typeof algCopy.hash === "string") algCopy.hash = { name: algCopy.hash };
		for (const algorithm of this.getAlgorithms()) {
			const res = algorithm.toAsnAlgorithm(algCopy);
			if (res) return res;
		}
		if (/^[0-9.]+$/.test(alg.name)) {
			const res = new AlgorithmIdentifier({ algorithm: alg.name });
			if ("parameters" in alg) res.parameters = alg.parameters;
			return res;
		}
		throw new Error("Cannot convert WebCrypto algorithm to ASN.1 algorithm");
	}
	toWebAlgorithm(alg) {
		for (const algorithm of this.getAlgorithms()) {
			const res = algorithm.toWebAlgorithm(alg);
			if (res) return res;
		}
		return {
			name: alg.algorithm,
			parameters: alg.parameters
		};
	}
};
var diAlgorithmProvider = "crypto.algorithmProvider";
instance.registerSingleton(diAlgorithmProvider, AlgorithmProvider);
var EcAlgorithm_1;
var idVersionOne = "1.3.36.3.3.2.8.1.1";
var idBrainpoolP160r1 = `${idVersionOne}.1`;
var idBrainpoolP160t1 = `${idVersionOne}.2`;
var idBrainpoolP192r1 = `${idVersionOne}.3`;
var idBrainpoolP192t1 = `${idVersionOne}.4`;
var idBrainpoolP224r1 = `${idVersionOne}.5`;
var idBrainpoolP224t1 = `${idVersionOne}.6`;
var idBrainpoolP256r1 = `${idVersionOne}.7`;
var idBrainpoolP256t1 = `${idVersionOne}.8`;
var idBrainpoolP320r1 = `${idVersionOne}.9`;
var idBrainpoolP320t1 = `${idVersionOne}.10`;
var idBrainpoolP384r1 = `${idVersionOne}.11`;
var idBrainpoolP384t1 = `${idVersionOne}.12`;
var idBrainpoolP512r1 = `${idVersionOne}.13`;
var idBrainpoolP512t1 = `${idVersionOne}.14`;
var brainpoolP160r1 = "brainpoolP160r1";
var brainpoolP160t1 = "brainpoolP160t1";
var brainpoolP192r1 = "brainpoolP192r1";
var brainpoolP192t1 = "brainpoolP192t1";
var brainpoolP224r1 = "brainpoolP224r1";
var brainpoolP224t1 = "brainpoolP224t1";
var brainpoolP256r1 = "brainpoolP256r1";
var brainpoolP256t1 = "brainpoolP256t1";
var brainpoolP320r1 = "brainpoolP320r1";
var brainpoolP320t1 = "brainpoolP320t1";
var brainpoolP384r1 = "brainpoolP384r1";
var brainpoolP384t1 = "brainpoolP384t1";
var brainpoolP512r1 = "brainpoolP512r1";
var brainpoolP512t1 = "brainpoolP512t1";
var ECDSA = "ECDSA";
var EcAlgorithm = EcAlgorithm_1 = class EcAlgorithm {
	toAsnAlgorithm(alg) {
		switch (alg.name.toLowerCase()) {
			case ECDSA.toLowerCase(): if ("hash" in alg) switch ((typeof alg.hash === "string" ? alg.hash : alg.hash.name).toLowerCase()) {
				case "sha-1": return ecdsaWithSHA1;
				case "sha-256": return ecdsaWithSHA256;
				case "sha-384": return ecdsaWithSHA384;
				case "sha-512": return ecdsaWithSHA512;
			}
			else if ("namedCurve" in alg) {
				let parameters = "";
				switch (alg.namedCurve) {
					case "P-256":
						parameters = id_secp256r1;
						break;
					case "K-256":
						parameters = EcAlgorithm_1.SECP256K1;
						break;
					case "P-384":
						parameters = id_secp384r1;
						break;
					case "P-521":
						parameters = id_secp521r1;
						break;
					case brainpoolP160r1:
						parameters = idBrainpoolP160r1;
						break;
					case brainpoolP160t1:
						parameters = idBrainpoolP160t1;
						break;
					case brainpoolP192r1:
						parameters = idBrainpoolP192r1;
						break;
					case brainpoolP192t1:
						parameters = idBrainpoolP192t1;
						break;
					case brainpoolP224r1:
						parameters = idBrainpoolP224r1;
						break;
					case brainpoolP224t1:
						parameters = idBrainpoolP224t1;
						break;
					case brainpoolP256r1:
						parameters = idBrainpoolP256r1;
						break;
					case brainpoolP256t1:
						parameters = idBrainpoolP256t1;
						break;
					case brainpoolP320r1:
						parameters = idBrainpoolP320r1;
						break;
					case brainpoolP320t1:
						parameters = idBrainpoolP320t1;
						break;
					case brainpoolP384r1:
						parameters = idBrainpoolP384r1;
						break;
					case brainpoolP384t1:
						parameters = idBrainpoolP384t1;
						break;
					case brainpoolP512r1:
						parameters = idBrainpoolP512r1;
						break;
					case brainpoolP512t1: parameters = idBrainpoolP512t1;
				}
				if (parameters) return new AlgorithmIdentifier({
					algorithm: id_ecPublicKey,
					parameters: AsnConvert.serialize(new ECParameters({ namedCurve: parameters }))
				});
			}
		}
		return null;
	}
	toWebAlgorithm(alg) {
		switch (alg.algorithm) {
			case id_ecdsaWithSHA1: return {
				name: ECDSA,
				hash: { name: "SHA-1" }
			};
			case id_ecdsaWithSHA256: return {
				name: ECDSA,
				hash: { name: "SHA-256" }
			};
			case id_ecdsaWithSHA384: return {
				name: ECDSA,
				hash: { name: "SHA-384" }
			};
			case id_ecdsaWithSHA512: return {
				name: ECDSA,
				hash: { name: "SHA-512" }
			};
			case id_ecPublicKey:
				if (!alg.parameters) throw new TypeError("Cannot get required parameters from EC algorithm");
				switch (AsnConvert.parse(alg.parameters, ECParameters).namedCurve) {
					case id_secp256r1: return {
						name: ECDSA,
						namedCurve: "P-256"
					};
					case EcAlgorithm_1.SECP256K1: return {
						name: ECDSA,
						namedCurve: "K-256"
					};
					case id_secp384r1: return {
						name: ECDSA,
						namedCurve: "P-384"
					};
					case id_secp521r1: return {
						name: ECDSA,
						namedCurve: "P-521"
					};
					case idBrainpoolP160r1: return {
						name: ECDSA,
						namedCurve: brainpoolP160r1
					};
					case idBrainpoolP160t1: return {
						name: ECDSA,
						namedCurve: brainpoolP160t1
					};
					case idBrainpoolP192r1: return {
						name: ECDSA,
						namedCurve: brainpoolP192r1
					};
					case idBrainpoolP192t1: return {
						name: ECDSA,
						namedCurve: brainpoolP192t1
					};
					case idBrainpoolP224r1: return {
						name: ECDSA,
						namedCurve: brainpoolP224r1
					};
					case idBrainpoolP224t1: return {
						name: ECDSA,
						namedCurve: brainpoolP224t1
					};
					case idBrainpoolP256r1: return {
						name: ECDSA,
						namedCurve: brainpoolP256r1
					};
					case idBrainpoolP256t1: return {
						name: ECDSA,
						namedCurve: brainpoolP256t1
					};
					case idBrainpoolP320r1: return {
						name: ECDSA,
						namedCurve: brainpoolP320r1
					};
					case idBrainpoolP320t1: return {
						name: ECDSA,
						namedCurve: brainpoolP320t1
					};
					case idBrainpoolP384r1: return {
						name: ECDSA,
						namedCurve: brainpoolP384r1
					};
					case idBrainpoolP384t1: return {
						name: ECDSA,
						namedCurve: brainpoolP384t1
					};
					case idBrainpoolP512r1: return {
						name: ECDSA,
						namedCurve: brainpoolP512r1
					};
					case idBrainpoolP512t1: return {
						name: ECDSA,
						namedCurve: brainpoolP512t1
					};
				}
		}
		return null;
	}
};
EcAlgorithm.SECP256K1 = "1.3.132.0.10";
EcAlgorithm = EcAlgorithm_1 = __decorate([injectable()], EcAlgorithm);
instance.registerSingleton(diAlgorithm, EcAlgorithm);
var NAME = Symbol("name");
var VALUE = Symbol("value");
var TextObject = class {
	constructor(name, items = {}, value = "") {
		this[NAME] = name;
		this[VALUE] = value;
		for (const key in items) this[key] = items[key];
	}
};
TextObject.NAME = NAME;
TextObject.VALUE = VALUE;
var DefaultAlgorithmSerializer = class {
	static toTextObject(alg) {
		const obj = new TextObject("Algorithm Identifier", {}, OidSerializer.toString(alg.algorithm));
		if (alg.parameters) switch (alg.algorithm) {
			case id_ecPublicKey: {
				const ecAlg = new EcAlgorithm().toWebAlgorithm(alg);
				if (ecAlg && "namedCurve" in ecAlg) obj["Named Curve"] = ecAlg.namedCurve;
				else obj["Parameters"] = alg.parameters;
				break;
			}
			default: obj["Parameters"] = alg.parameters;
		}
		return obj;
	}
};
var OidSerializer = class {
	static toString(oid) {
		const name = this.items[oid];
		if (name) return name;
		return oid;
	}
};
OidSerializer.items = {
	[id_sha1]: "sha1",
	[id_sha224]: "sha224",
	[id_sha256]: "sha256",
	[id_sha384]: "sha384",
	[id_sha512]: "sha512",
	[id_rsaEncryption]: "rsaEncryption",
	[id_sha1WithRSAEncryption]: "sha1WithRSAEncryption",
	[id_sha224WithRSAEncryption]: "sha224WithRSAEncryption",
	[id_sha256WithRSAEncryption]: "sha256WithRSAEncryption",
	[id_sha384WithRSAEncryption]: "sha384WithRSAEncryption",
	[id_sha512WithRSAEncryption]: "sha512WithRSAEncryption",
	[id_ecPublicKey]: "ecPublicKey",
	[id_ecdsaWithSHA1]: "ecdsaWithSHA1",
	[id_ecdsaWithSHA224]: "ecdsaWithSHA224",
	[id_ecdsaWithSHA256]: "ecdsaWithSHA256",
	[id_ecdsaWithSHA384]: "ecdsaWithSHA384",
	[id_ecdsaWithSHA512]: "ecdsaWithSHA512",
	[id_kp_serverAuth]: "TLS WWW server authentication",
	[id_kp_clientAuth]: "TLS WWW client authentication",
	[id_kp_codeSigning]: "Code Signing",
	[id_kp_emailProtection]: "E-mail Protection",
	[id_kp_timeStamping]: "Time Stamping",
	[id_kp_OCSPSigning]: "OCSP Signing",
	[id_signedData]: "Signed Data"
};
var TextConverter = class {
	static serialize(obj) {
		return this.serializeObj(obj).join("\n");
	}
	static pad(deep = 0) {
		return "".padStart(2 * deep, " ");
	}
	static serializeObj(obj, deep = 0) {
		const res = [];
		let pad = this.pad(deep++);
		let value = "";
		const objValue = obj[TextObject.VALUE];
		if (objValue) value = ` ${objValue}`;
		res.push(`${pad}${obj[TextObject.NAME]}:${value}`);
		pad = this.pad(deep);
		for (const key in obj) {
			if (typeof key === "symbol") continue;
			const value = obj[key];
			const keyValue = key ? `${key}: ` : "";
			if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") res.push(`${pad}${keyValue}${value}`);
			else if (value instanceof Date) res.push(`${pad}${keyValue}${value.toUTCString()}`);
			else if (Array.isArray(value)) for (const obj of value) {
				obj[TextObject.NAME] = key;
				res.push(...this.serializeObj(obj, deep));
			}
			else if (value instanceof TextObject) {
				value[TextObject.NAME] = key;
				res.push(...this.serializeObj(value, deep));
			} else if (BufferSourceConverter.isBufferSource(value)) if (key) {
				res.push(`${pad}${keyValue}`);
				res.push(...this.serializeBufferSource(value, deep + 1));
			} else res.push(...this.serializeBufferSource(value, deep));
			else if ("toTextObject" in value) {
				const obj = value.toTextObject();
				obj[TextObject.NAME] = key;
				res.push(...this.serializeObj(obj, deep));
			} else throw new TypeError("Cannot serialize data in text format. Unsupported type.");
		}
		return res;
	}
	static serializeBufferSource(buffer, deep = 0) {
		const pad = this.pad(deep);
		const view = BufferSourceConverter.toUint8Array(buffer);
		const res = [];
		for (let i = 0; i < view.length;) {
			const row = [];
			for (let j = 0; j < 16 && i < view.length; j++) {
				if (j === 8) row.push("");
				const hex = view[i++].toString(16).padStart(2, "0");
				row.push(hex);
			}
			res.push(`${pad}${row.join(" ")}`);
		}
		return res;
	}
	static serializeAlgorithm(alg) {
		return this.algorithmSerializer.toTextObject(alg);
	}
};
TextConverter.oidSerializer = OidSerializer;
TextConverter.algorithmSerializer = DefaultAlgorithmSerializer;
var _AsnData_rawData;
var _AsnData_options;
var AsnData = class AsnData {
	get parseOptions() {
		return __classPrivateFieldGet(this, _AsnData_options, "f");
	}
	get rawData() {
		if (!__classPrivateFieldGet(this, _AsnData_rawData, "f")) __classPrivateFieldSet(this, _AsnData_rawData, AsnConvert.serialize(this.asn), "f");
		return __classPrivateFieldGet(this, _AsnData_rawData, "f");
	}
	constructor(...args) {
		_AsnData_rawData.set(this, void 0);
		_AsnData_options.set(this, void 0);
		if (BufferSourceConverter.isBufferSource(args[0])) {
			__classPrivateFieldSet(this, _AsnData_options, args[2], "f");
			this.asn = AsnConvert.parse(args[0], args[1], args[2]);
			__classPrivateFieldSet(this, _AsnData_rawData, BufferSourceConverter.toArrayBuffer(args[0]), "f");
			this.onInit(this.asn);
		} else {
			__classPrivateFieldSet(this, _AsnData_options, args[1], "f");
			this.asn = args[0];
			this.onInit(this.asn);
		}
	}
	equal(data) {
		if (data instanceof AsnData) return isEqual(data.rawData, this.rawData);
		return false;
	}
	toString(format = "text") {
		switch (format) {
			case "asn": return AsnConvert.toString(this.rawData, __classPrivateFieldGet(this, _AsnData_options, "f"));
			case "text": return TextConverter.serialize(this.toTextObject());
			case "hex": return Convert.ToHex(this.rawData);
			case "base64": return Convert.ToBase64(this.rawData);
			case "base64url": return Convert.ToBase64Url(this.rawData);
			default: throw TypeError("Argument 'format' is unsupported value");
		}
	}
	getTextName() {
		return this.constructor.NAME;
	}
	toTextObject() {
		const obj = this.toTextObjectEmpty();
		obj[""] = this.rawData;
		return obj;
	}
	toTextObjectEmpty(value) {
		return new TextObject(this.getTextName(), {}, value);
	}
};
_AsnData_rawData = /* @__PURE__ */ new WeakMap(), _AsnData_options = /* @__PURE__ */ new WeakMap();
AsnData.NAME = "ASN";
var Extension = class Extension extends AsnData {
	constructor(...args) {
		let raw;
		let options;
		if (BufferSourceConverter.isBufferSource(args[0])) {
			raw = BufferSourceConverter.toArrayBuffer(args[0]);
			options = args[1];
		} else raw = AsnConvert.serialize(new Extension$1({
			extnID: args[0],
			critical: args[1],
			extnValue: new OctetString(BufferSourceConverter.toArrayBuffer(args[2]))
		}));
		super(raw, Extension$1, options);
	}
	onInit(asn) {
		this.type = asn.extnID;
		this.critical = asn.critical;
		this.value = asn.extnValue.buffer;
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj[""] = this.value;
		return obj;
	}
	toTextObjectWithoutValue() {
		const obj = this.toTextObjectEmpty(this.critical ? "critical" : void 0);
		if (obj[TextObject.NAME] === Extension.NAME) obj[TextObject.NAME] = OidSerializer.toString(this.type);
		return obj;
	}
};
var _a;
var CryptoProvider = class CryptoProvider {
	static isCryptoKeyPair(data) {
		return data && data.privateKey && data.publicKey;
	}
	static isCryptoKey(data) {
		return data && data.usages && data.type && data.algorithm && data.extractable !== void 0;
	}
	constructor() {
		this.items = /* @__PURE__ */ new Map();
		this[_a] = "CryptoProvider";
		if (typeof self !== "undefined" && typeof crypto !== "undefined") this.set(CryptoProvider.DEFAULT, crypto);
		else if (typeof global !== "undefined" && global.crypto && global.crypto.subtle) this.set(CryptoProvider.DEFAULT, global.crypto);
	}
	clear() {
		this.items.clear();
	}
	delete(key) {
		return this.items.delete(key);
	}
	forEach(callbackfn, thisArg) {
		return this.items.forEach(callbackfn, thisArg);
	}
	has(key) {
		return this.items.has(key);
	}
	get size() {
		return this.items.size;
	}
	entries() {
		return this.items.entries();
	}
	keys() {
		return this.items.keys();
	}
	values() {
		return this.items.values();
	}
	[Symbol.iterator]() {
		return this.items[Symbol.iterator]();
	}
	get(key = CryptoProvider.DEFAULT) {
		const crypto = this.items.get(key.toLowerCase());
		if (!crypto) throw new Error(`Cannot get Crypto by name '${key}'`);
		return crypto;
	}
	set(key, value) {
		if (typeof key === "string") {
			if (!value) throw new TypeError("Argument 'value' is required");
			this.items.set(key.toLowerCase(), value);
		} else this.items.set(CryptoProvider.DEFAULT, key);
		return this;
	}
};
_a = Symbol.toStringTag;
CryptoProvider.DEFAULT = "default";
var cryptoProvider = new CryptoProvider();
var OID_REGEX = /^[0-2](?:\.[1-9][0-9]*)+$/;
function isOID(id) {
	return new RegExp(OID_REGEX).test(id);
}
var NameIdentifier = class {
	constructor(names = {}) {
		this.items = {};
		for (const id in names) this.register(id, names[id]);
	}
	get(idOrName) {
		return this.items[idOrName] || null;
	}
	findId(idOrName) {
		if (!isOID(idOrName)) return this.get(idOrName);
		return idOrName;
	}
	register(id, name) {
		this.items[id] = name;
		this.items[name] = id;
	}
};
var names = new NameIdentifier();
names.register("CN", "2.5.4.3");
names.register("L", "2.5.4.7");
names.register("ST", "2.5.4.8");
names.register("O", "2.5.4.10");
names.register("OU", "2.5.4.11");
names.register("C", "2.5.4.6");
names.register("DC", "0.9.2342.19200300.100.1.25");
names.register("E", "1.2.840.113549.1.9.1");
names.register("G", "2.5.4.42");
names.register("I", "2.5.4.43");
names.register("SN", "2.5.4.4");
names.register("T", "2.5.4.12");
function replaceUnknownCharacter(text, char) {
	return `\\${Convert.ToHex(Convert.FromUtf8String(char)).toUpperCase()}`;
}
function escape(data) {
	return data.replace(/([,+"\\<>;])/g, "\\$1").replace(/^([ #])/, "\\$1").replace(/([ ]$)/, "\\$1").replace(/([\r\n\t])/, replaceUnknownCharacter);
}
var Name = class Name {
	static isASCII(text) {
		for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) > 255) return false;
		return true;
	}
	static isPrintableString(text) {
		return /^[A-Za-z0-9 '()+,-./:=?]*$/g.test(text);
	}
	constructor(data, extraNames = {}) {
		this.extraNames = new NameIdentifier();
		this.asn = new Name$1();
		for (const key in extraNames) if (Object.prototype.hasOwnProperty.call(extraNames, key)) {
			const value = extraNames[key];
			this.extraNames.register(key, value);
		}
		if (typeof data === "string") this.asn = this.fromString(data);
		else if (data instanceof Name$1) this.asn = data;
		else if (BufferSourceConverter.isBufferSource(data)) this.asn = AsnConvert.parse(data, Name$1);
		else this.asn = this.fromJSON(data);
	}
	getField(idOrName) {
		const id = this.extraNames.findId(idOrName) || names.findId(idOrName);
		const res = [];
		for (const name of this.asn) for (const rdn of name) if (rdn.type === id) res.push(rdn.value.toString());
		return res;
	}
	getName(idOrName) {
		return this.extraNames.get(idOrName) || names.get(idOrName);
	}
	toString() {
		return this.asn.map((rdn) => rdn.map((o) => {
			return `${this.getName(o.type) || o.type}=${o.value.anyValue ? `#${Convert.ToHex(o.value.anyValue)}` : escape(o.value.toString())}`;
		}).join("+")).join(", ");
	}
	toJSON() {
		var _a;
		const json = [];
		for (const rdn of this.asn) {
			const jsonItem = {};
			for (const attr of rdn) {
				const type = this.getName(attr.type) || attr.type;
				(_a = jsonItem[type]) !== null && _a !== void 0 || (jsonItem[type] = []);
				jsonItem[type].push(attr.value.anyValue ? `#${Convert.ToHex(attr.value.anyValue)}` : attr.value.toString());
			}
			json.push(jsonItem);
		}
		return json;
	}
	fromString(data) {
		const asn = new Name$1();
		const regex = /(\d\.[\d.]*\d|[A-Za-z]+)=((?:"")|(?:".*?[^\\]")|(?:[^,+"\\](?=[,+]|$))|(?:[^,+].*?(?:[^\\][,+]))|(?:))([,+])?/g;
		let matches = null;
		let level = ",";
		while (matches = regex.exec(`${data},`)) {
			let [, type, value] = matches;
			const lastChar = value[value.length - 1];
			if (lastChar === "," || lastChar === "+") {
				value = value.slice(0, value.length - 1);
				matches[3] = lastChar;
			}
			const next = matches[3];
			type = this.getTypeOid(type);
			const attr = this.createAttribute(type, value);
			if (level === "+") asn[asn.length - 1].push(attr);
			else asn.push(new RelativeDistinguishedName([attr]));
			level = next;
		}
		return asn;
	}
	fromJSON(data) {
		const asn = new Name$1();
		for (const item of data) {
			const asnRdn = new RelativeDistinguishedName();
			for (const type in item) {
				const typeId = this.getTypeOid(type);
				const values = item[type];
				for (const value of values) {
					const asnAttr = this.createAttribute(typeId, value);
					asnRdn.push(asnAttr);
				}
			}
			asn.push(asnRdn);
		}
		return asn;
	}
	getTypeOid(type) {
		if (!/[\d.]+/.test(type)) type = this.getName(type) || "";
		if (!type) throw new Error(`Cannot get OID for name type '${type}'`);
		return type;
	}
	createAttribute(type, value) {
		const attr = new AttributeTypeAndValue({ type });
		if (typeof value === "object") for (const key in value) switch (key) {
			case "ia5String":
				attr.value.ia5String = value[key];
				break;
			case "utf8String":
				attr.value.utf8String = value[key];
				break;
			case "universalString":
				attr.value.universalString = value[key];
				break;
			case "bmpString":
				attr.value.bmpString = value[key];
				break;
			case "printableString": attr.value.printableString = value[key];
		}
		else if (value[0] === "#") attr.value.anyValue = Convert.FromHex(value.slice(1));
		else {
			const processedValue = this.processStringValue(value);
			if (type === this.getName("E") || type === this.getName("DC")) attr.value.ia5String = processedValue;
			else if (Name.isPrintableString(processedValue)) attr.value.printableString = processedValue;
			else attr.value.utf8String = processedValue;
		}
		return attr;
	}
	processStringValue(value) {
		const quotedMatches = /"(.*?[^\\])?"/.exec(value);
		if (quotedMatches) value = quotedMatches[1];
		return value.replace(/\\0a/gi, "\n").replace(/\\0d/gi, "\r").replace(/\\0g/gi, "	").replace(/\\(.)/g, "$1");
	}
	toArrayBuffer() {
		return AsnConvert.serialize(this.asn);
	}
	async getThumbprint(arg1, arg2) {
		let crypto;
		let algorithm = "SHA-1";
		if (arg1) if (typeof arg1 === "object" && "subtle" in arg1) crypto = arg1;
		else {
			algorithm = arg1;
			crypto = arg2;
		}
		crypto !== null && crypto !== void 0 || (crypto = cryptoProvider.get());
		return await crypto.subtle.digest(algorithm, this.toArrayBuffer());
	}
};
var ERR_GN_CONSTRUCTOR = "Cannot initialize GeneralName from ASN.1 data.";
var ERR_GN_STRING_FORMAT = `${ERR_GN_CONSTRUCTOR} Unsupported string format in use.`;
var ERR_GUID = `${ERR_GN_CONSTRUCTOR} Value doesn't match to GUID regular expression.`;
var GUID_REGEX = /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i;
var id_GUID = "1.3.6.1.4.1.311.25.1";
var id_UPN = "1.3.6.1.4.1.311.20.2.3";
var EMAIL = "email";
var GUID = "guid";
var GeneralName = class extends AsnData {
	constructor(...args) {
		let name;
		if (args.length === 2) switch (args[0]) {
			case "dn": {
				const derName = new Name(args[1]).toArrayBuffer();
				const asnName = AsnConvert.parse(derName, Name$1);
				name = new GeneralName$1({ directoryName: asnName });
				break;
			}
			case "dns":
				name = new GeneralName$1({ dNSName: args[1] });
				break;
			case EMAIL:
				name = new GeneralName$1({ rfc822Name: args[1] });
				break;
			case GUID: {
				const matches = new RegExp(GUID_REGEX, "i").exec(args[1]);
				if (!matches) throw new Error("Cannot parse GUID value. Value doesn't match to regular expression");
				const hex = matches.slice(1).map((o, i) => {
					if (i < 3) return Convert.ToHex(new Uint8Array(Convert.FromHex(o)).reverse());
					return o;
				}).join("");
				name = new GeneralName$1({ otherName: new OtherName({
					typeId: id_GUID,
					value: AsnConvert.serialize(new OctetString(Convert.FromHex(hex)))
				}) });
				break;
			}
			case "ip":
				name = new GeneralName$1({ iPAddress: args[1] });
				break;
			case "id":
				name = new GeneralName$1({ registeredID: args[1] });
				break;
			case "upn":
				name = new GeneralName$1({ otherName: new OtherName({
					typeId: id_UPN,
					value: AsnConvert.serialize(AsnUtf8StringConverter.toASN(args[1]))
				}) });
				break;
			case "url":
				name = new GeneralName$1({ uniformResourceIdentifier: args[1] });
				break;
			default: throw new Error("Cannot create GeneralName. Unsupported type of the name");
		}
		else if (BufferSourceConverter.isBufferSource(args[0])) name = AsnConvert.parse(args[0], GeneralName$1);
		else name = args[0];
		super(name);
	}
	onInit(asn) {
		if (asn.dNSName != void 0) {
			this.type = "dns";
			this.value = asn.dNSName;
		} else if (asn.rfc822Name != void 0) {
			this.type = EMAIL;
			this.value = asn.rfc822Name;
		} else if (asn.iPAddress != void 0) {
			this.type = "ip";
			this.value = asn.iPAddress;
		} else if (asn.uniformResourceIdentifier != void 0) {
			this.type = "url";
			this.value = asn.uniformResourceIdentifier;
		} else if (asn.registeredID != void 0) {
			this.type = "id";
			this.value = asn.registeredID;
		} else if (asn.directoryName != void 0) {
			this.type = "dn";
			this.value = new Name(asn.directoryName).toString();
		} else if (asn.otherName != void 0) if (asn.otherName.typeId === id_GUID) {
			this.type = GUID;
			const guid = AsnConvert.parse(asn.otherName.value, OctetString);
			const matches = new RegExp(GUID_REGEX, "i").exec(Convert.ToHex(guid));
			if (!matches) throw new Error(ERR_GUID);
			this.value = matches.slice(1).map((o, i) => {
				if (i < 3) return Convert.ToHex(new Uint8Array(Convert.FromHex(o)).reverse());
				return o;
			}).join("-");
		} else if (asn.otherName.typeId === id_UPN) {
			this.type = "upn";
			this.value = AsnConvert.parse(asn.otherName.value, DirectoryString).toString();
		} else throw new Error(ERR_GN_STRING_FORMAT);
		else throw new Error(ERR_GN_STRING_FORMAT);
	}
	toJSON() {
		return {
			type: this.type,
			value: this.value
		};
	}
	toTextObject() {
		let type;
		switch (this.type) {
			case "dn":
			case "dns":
			case GUID:
			case "ip":
			case "id":
			case "upn":
			case "url":
				type = this.type.toUpperCase();
				break;
			case EMAIL:
				type = "Email";
				break;
			default: throw new Error("Unsupported GeneralName type");
		}
		let value = this.value;
		if (this.type === "id") value = OidSerializer.toString(value);
		return new TextObject(type, void 0, value);
	}
};
var GeneralNames = class extends AsnData {
	constructor(params) {
		let names;
		if (params instanceof GeneralNames$1) names = params;
		else if (Array.isArray(params)) {
			const items = [];
			for (const name of params) if (name instanceof GeneralName$1) items.push(name);
			else {
				const asnName = AsnConvert.parse(new GeneralName(name.type, name.value).rawData, GeneralName$1);
				items.push(asnName);
			}
			names = new GeneralNames$1(items);
		} else if (BufferSourceConverter.isBufferSource(params)) names = AsnConvert.parse(params, GeneralNames$1);
		else throw new Error("Cannot initialize GeneralNames. Incorrect incoming arguments");
		super(names);
	}
	onInit(asn) {
		const items = [];
		for (const asnName of asn) {
			let name = null;
			try {
				name = new GeneralName(asnName);
			} catch {
				continue;
			}
			items.push(name);
		}
		this.items = items;
	}
	toJSON() {
		return this.items.map((o) => o.toJSON());
	}
	toTextObject() {
		const res = super.toTextObjectEmpty();
		for (const name of this.items) {
			const nameObj = name.toTextObject();
			let field = res[nameObj[TextObject.NAME]];
			if (!Array.isArray(field)) {
				field = [];
				res[nameObj[TextObject.NAME]] = field;
			}
			field.push(nameObj);
		}
		return res;
	}
};
GeneralNames.NAME = "GeneralNames";
var rPaddingTag = "-{5}";
var rEolChars = "\\n";
var rBeginTag = `${rPaddingTag}BEGIN (${`[^${rEolChars}]+`}(?=${rPaddingTag}))${rPaddingTag}`;
var rEndTag = `${rPaddingTag}END \\1${rPaddingTag}`;
var rEolGroup = "\\n";
var rPem = `${rBeginTag}${rEolGroup}(?:((?:${`[^:${rEolChars}]+`}: ${`(?:[^${rEolChars}]+${rEolGroup}(?: +[^${rEolChars}]+${rEolGroup})*)`})+))?${rEolGroup}?(${`(?:[a-zA-Z0-9=+/]+${rEolGroup})+`})${rEndTag}`;
var rEolPattern = new RegExp(`[${rEolChars}]+`, "g");
var PemConverter = class {
	static isPem(data) {
		return typeof data === "string" && new RegExp(rPem, "g").test(data.replace(/\r/g, ""));
	}
	static decodeWithHeaders(pem) {
		pem = pem.replace(/\r/g, "");
		const pattern = new RegExp(rPem, "g");
		const res = [];
		let matches = null;
		while (matches = pattern.exec(pem)) {
			const base64 = matches[3].replace(rEolPattern, "");
			const pemStruct = {
				type: matches[1],
				headers: [],
				rawData: Convert.FromBase64(base64)
			};
			const headersString = matches[2];
			if (headersString) {
				const headers = headersString.split(new RegExp(rEolGroup, "g"));
				let lastHeader = null;
				for (const header of headers) {
					const [key, value] = header.split(/:(.*)/);
					if (value === void 0) {
						if (!lastHeader) throw new Error("Cannot parse PEM string. Incorrect header value");
						lastHeader.value += key.trim();
					} else {
						if (lastHeader) pemStruct.headers.push(lastHeader);
						lastHeader = {
							key,
							value: value.trim()
						};
					}
				}
				if (lastHeader) pemStruct.headers.push(lastHeader);
			}
			res.push(pemStruct);
		}
		return res;
	}
	static decode(pem) {
		return this.decodeWithHeaders(pem).map((o) => o.rawData);
	}
	static decodeFirst(pem) {
		const items = this.decode(pem);
		if (!items.length) throw new RangeError("PEM string doesn't contain any objects");
		return items[0];
	}
	static encode(rawData, tag) {
		if (Array.isArray(rawData)) {
			const raws = new Array();
			if (tag) rawData.forEach((element) => {
				if (!BufferSourceConverter.isBufferSource(element)) throw new TypeError("Cannot encode array of BufferSource in PEM format. Not all items of the array are BufferSource");
				raws.push(this.encodeStruct({
					type: tag,
					rawData: BufferSourceConverter.toArrayBuffer(element)
				}));
			});
			else rawData.forEach((element) => {
				if (!("type" in element)) throw new TypeError("Cannot encode array of PemStruct in PEM format. Not all items of the array are PemStrut");
				raws.push(this.encodeStruct(element));
			});
			return raws.join("\n");
		} else {
			if (!tag) throw new Error("Required argument 'tag' is missed");
			return this.encodeStruct({
				type: tag,
				rawData: BufferSourceConverter.toArrayBuffer(rawData)
			});
		}
	}
	static encodeStruct(pem) {
		var _a;
		const upperCaseType = pem.type.toLocaleUpperCase();
		const res = [];
		res.push(`-----BEGIN ${upperCaseType}-----`);
		if ((_a = pem.headers) === null || _a === void 0 ? void 0 : _a.length) {
			for (const header of pem.headers) res.push(`${header.key}: ${header.value}`);
			res.push("");
		}
		const base64 = Convert.ToBase64(pem.rawData);
		for (let i = 0; i < base64.length; i += 64) res.push(base64.substring(i, i + 64));
		res.push(`-----END ${upperCaseType}-----`);
		return res.join("\n");
	}
};
PemConverter.CertificateTag = "CERTIFICATE";
PemConverter.CrlTag = "CRL";
PemConverter.CertificateRequestTag = "CERTIFICATE REQUEST";
PemConverter.PublicKeyTag = "PUBLIC KEY";
PemConverter.PrivateKeyTag = "PRIVATE KEY";
var PemData = class PemData extends AsnData {
	static isAsnEncoded(data) {
		return BufferSourceConverter.isBufferSource(data) || typeof data === "string";
	}
	static toArrayBuffer(raw) {
		if (typeof raw === "string") if (PemConverter.isPem(raw)) return PemConverter.decode(raw)[0];
		else if (Convert.isHex(raw)) return Convert.FromHex(raw);
		else if (Convert.isBase64(raw)) return Convert.FromBase64(raw);
		else if (Convert.isBase64Url(raw)) return Convert.FromBase64Url(raw);
		else throw new TypeError("Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url");
		else {
			const buffer = BufferSourceConverter.toUint8Array(raw);
			if (buffer.length > 0 && buffer[0] === 48) return BufferSourceConverter.toArrayBuffer(raw);
			const stringRaw = Convert.ToBinary(raw);
			if (PemConverter.isPem(stringRaw)) return PemConverter.decode(stringRaw)[0];
			else if (Convert.isHex(stringRaw)) return Convert.FromHex(stringRaw);
			else if (Convert.isBase64(stringRaw)) return Convert.FromBase64(stringRaw);
			else if (Convert.isBase64Url(stringRaw)) return Convert.FromBase64Url(stringRaw);
			throw new TypeError("Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url");
		}
	}
	constructor(...args) {
		if (PemData.isAsnEncoded(args[0])) super(PemData.toArrayBuffer(args[0]), args[1], args[2]);
		else super(args[0], args[1]);
	}
	toString(format = "pem") {
		switch (format) {
			case "pem": return PemConverter.encode(this.rawData, this.tag);
			default: return super.toString(format);
		}
	}
};
var PublicKey = class PublicKey extends PemData {
	static async create(data, crypto = cryptoProvider.get()) {
		if (data instanceof PublicKey) return data;
		else if (CryptoProvider.isCryptoKey(data)) {
			if (data.type !== "public") throw new TypeError("Public key is required");
			const spki = await crypto.subtle.exportKey("spki", data);
			return new PublicKey(spki);
		} else if (data.publicKey) return data.publicKey;
		else if (BufferSourceConverter.isBufferSource(data)) return new PublicKey(data);
		else throw new TypeError("Unsupported PublicKeyType");
	}
	constructor(param, options) {
		if (PemData.isAsnEncoded(param)) super(param, SubjectPublicKeyInfo, options);
		else super(param, options);
		this.tag = PemConverter.PublicKeyTag;
	}
	async export(arg1, arg2, arg3) {
		let crypto;
		let keyUsages = ["verify"];
		let algorithm = {
			hash: "SHA-256",
			...this.algorithm
		};
		if (arg2) {
			algorithm = arg1;
			keyUsages = arg2;
			crypto = arg3;
		} else crypto = arg1;
		crypto !== null && crypto !== void 0 || (crypto = cryptoProvider.get());
		let raw = this.rawData;
		const asnSpki = AsnConvert.parse(this.rawData, SubjectPublicKeyInfo, this.parseOptions);
		if (asnSpki.algorithm.algorithm === id_RSASSA_PSS) raw = convertSpkiToRsaPkcs1(asnSpki, raw);
		return crypto.subtle.importKey("spki", raw, algorithm, true, keyUsages);
	}
	onInit(asn) {
		const algProv = instance.resolve(diAlgorithmProvider);
		const algorithm = this.algorithm = algProv.toWebAlgorithm(asn.algorithm);
		switch (asn.algorithm.algorithm) {
			case id_rsaEncryption: {
				const rsaPublicKey = AsnConvert.parse(asn.subjectPublicKey, RSAPublicKey, this.parseOptions);
				const modulus = BufferSourceConverter.toUint8Array(rsaPublicKey.modulus);
				algorithm.publicExponent = BufferSourceConverter.toUint8Array(rsaPublicKey.publicExponent);
				algorithm.modulusLength = (!modulus[0] ? modulus.slice(1) : modulus).byteLength << 3;
				break;
			}
		}
	}
	async getThumbprint(arg1, arg2) {
		let crypto;
		let algorithm = "SHA-1";
		if (arg1) if (typeof arg1 === "object" && "subtle" in arg1) crypto = arg1;
		else {
			algorithm = arg1;
			crypto = arg2;
		}
		crypto !== null && crypto !== void 0 || (crypto = cryptoProvider.get());
		return await crypto.subtle.digest(algorithm, this.rawData);
	}
	async getKeyIdentifier(arg1, arg2) {
		let crypto;
		let algorithm = "SHA-1";
		if (arg1) if (typeof arg1 === "object" && "subtle" in arg1) crypto = arg1;
		else {
			algorithm = arg1;
			crypto = arg2;
		}
		crypto !== null && crypto !== void 0 || (crypto = cryptoProvider.get());
		const asn = AsnConvert.parse(this.rawData, SubjectPublicKeyInfo, this.parseOptions);
		return await crypto.subtle.digest(algorithm, asn.subjectPublicKey);
	}
	toTextObject() {
		const obj = this.toTextObjectEmpty();
		const asn = AsnConvert.parse(this.rawData, SubjectPublicKeyInfo, this.parseOptions);
		obj["Algorithm"] = TextConverter.serializeAlgorithm(asn.algorithm);
		switch (asn.algorithm.algorithm) {
			case id_ecPublicKey:
				obj["EC Point"] = asn.subjectPublicKey;
				break;
			case id_rsaEncryption:
			default: obj["Raw Data"] = asn.subjectPublicKey;
		}
		return obj;
	}
};
function convertSpkiToRsaPkcs1(asnSpki, raw) {
	asnSpki.algorithm = new AlgorithmIdentifier({
		algorithm: id_rsaEncryption,
		parameters: null
	});
	raw = AsnConvert.serialize(asnSpki);
	return raw;
}
var AuthorityKeyIdentifierExtension = class AuthorityKeyIdentifierExtension extends Extension {
	static async create(param, critical = false, crypto = cryptoProvider.get()) {
		if ("name" in param && "serialNumber" in param) return new AuthorityKeyIdentifierExtension(param, critical);
		const id = await (await PublicKey.create(param, crypto)).getKeyIdentifier(crypto);
		return new AuthorityKeyIdentifierExtension(Convert.ToHex(id), critical);
	}
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else if (typeof args[0] === "string") {
			const value = new AuthorityKeyIdentifier({ keyIdentifier: new KeyIdentifier(Convert.FromHex(args[0])) });
			super(id_ce_authorityKeyIdentifier, args[1], AsnConvert.serialize(value));
		} else {
			const certId = args[0];
			const certIdName = certId.name instanceof GeneralNames ? AsnConvert.parse(certId.name.rawData, GeneralNames$1) : certId.name;
			const value = new AuthorityKeyIdentifier({
				authorityCertIssuer: certIdName,
				authorityCertSerialNumber: Convert.FromHex(certId.serialNumber)
			});
			super(id_ce_authorityKeyIdentifier, args[1], AsnConvert.serialize(value));
		}
	}
	onInit(asn) {
		super.onInit(asn);
		const aki = AsnConvert.parse(asn.extnValue, AuthorityKeyIdentifier, this.parseOptions);
		if (aki.keyIdentifier) this.keyId = Convert.ToHex(aki.keyIdentifier);
		if (aki.authorityCertIssuer || aki.authorityCertSerialNumber) this.certId = {
			name: aki.authorityCertIssuer || [],
			serialNumber: aki.authorityCertSerialNumber ? Convert.ToHex(aki.authorityCertSerialNumber) : ""
		};
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		const asn = AsnConvert.parse(this.value, AuthorityKeyIdentifier, this.parseOptions);
		if (asn.authorityCertIssuer) obj["Authority Issuer"] = new GeneralNames(asn.authorityCertIssuer).toTextObject();
		if (asn.authorityCertSerialNumber) obj["Authority Serial Number"] = asn.authorityCertSerialNumber;
		if (asn.keyIdentifier) obj[""] = asn.keyIdentifier;
		return obj;
	}
};
AuthorityKeyIdentifierExtension.NAME = "Authority Key Identifier";
var BasicConstraintsExtension = class extends Extension {
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) {
			super(args[0], args[1]);
			const value = AsnConvert.parse(this.value, BasicConstraints, this.parseOptions);
			this.ca = value.cA;
			this.pathLength = value.pathLenConstraint;
		} else {
			const value = new BasicConstraints({
				cA: args[0],
				pathLenConstraint: args[1]
			});
			super(id_ce_basicConstraints, args[2], AsnConvert.serialize(value));
			this.ca = args[0];
			this.pathLength = args[1];
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		if (this.ca) obj["CA"] = this.ca;
		if (this.pathLength !== void 0) obj["Path Length"] = this.pathLength;
		return obj;
	}
};
BasicConstraintsExtension.NAME = "Basic Constraints";
var ExtendedKeyUsage;
(function(ExtendedKeyUsage) {
	ExtendedKeyUsage["serverAuth"] = "1.3.6.1.5.5.7.3.1";
	ExtendedKeyUsage["clientAuth"] = "1.3.6.1.5.5.7.3.2";
	ExtendedKeyUsage["codeSigning"] = "1.3.6.1.5.5.7.3.3";
	ExtendedKeyUsage["emailProtection"] = "1.3.6.1.5.5.7.3.4";
	ExtendedKeyUsage["timeStamping"] = "1.3.6.1.5.5.7.3.8";
	ExtendedKeyUsage["ocspSigning"] = "1.3.6.1.5.5.7.3.9";
})(ExtendedKeyUsage || (ExtendedKeyUsage = {}));
var ExtendedKeyUsageExtension = class extends Extension {
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) {
			super(args[0], args[1]);
			const value = AsnConvert.parse(this.value, ExtendedKeyUsage$1, this.parseOptions);
			this.usages = value.map((o) => o);
		} else {
			const value = new ExtendedKeyUsage$1(args[0]);
			super(id_ce_extKeyUsage, args[1], AsnConvert.serialize(value));
			this.usages = args[0];
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj[""] = this.usages.map((o) => OidSerializer.toString(o)).join(", ");
		return obj;
	}
};
ExtendedKeyUsageExtension.NAME = "Extended Key Usages";
var KeyUsageFlags;
(function(KeyUsageFlags) {
	KeyUsageFlags[KeyUsageFlags["digitalSignature"] = 1] = "digitalSignature";
	KeyUsageFlags[KeyUsageFlags["nonRepudiation"] = 2] = "nonRepudiation";
	KeyUsageFlags[KeyUsageFlags["keyEncipherment"] = 4] = "keyEncipherment";
	KeyUsageFlags[KeyUsageFlags["dataEncipherment"] = 8] = "dataEncipherment";
	KeyUsageFlags[KeyUsageFlags["keyAgreement"] = 16] = "keyAgreement";
	KeyUsageFlags[KeyUsageFlags["keyCertSign"] = 32] = "keyCertSign";
	KeyUsageFlags[KeyUsageFlags["cRLSign"] = 64] = "cRLSign";
	KeyUsageFlags[KeyUsageFlags["encipherOnly"] = 128] = "encipherOnly";
	KeyUsageFlags[KeyUsageFlags["decipherOnly"] = 256] = "decipherOnly";
})(KeyUsageFlags || (KeyUsageFlags = {}));
var KeyUsagesExtension = class extends Extension {
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) {
			super(args[0], args[1]);
			const value = AsnConvert.parse(this.value, KeyUsage, this.parseOptions);
			this.usages = value.toNumber();
		} else {
			const value = new KeyUsage(args[0]);
			super(id_ce_keyUsage, args[1], AsnConvert.serialize(value));
			this.usages = args[0];
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj[""] = AsnConvert.parse(this.value, KeyUsage, this.parseOptions).toJSON().join(", ");
		return obj;
	}
};
KeyUsagesExtension.NAME = "Key Usages";
var SubjectKeyIdentifierExtension = class SubjectKeyIdentifierExtension extends Extension {
	static async create(publicKey, critical = false, crypto = cryptoProvider.get()) {
		const id = await (await PublicKey.create(publicKey, crypto)).getKeyIdentifier(crypto);
		return new SubjectKeyIdentifierExtension(Convert.ToHex(id), critical);
	}
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) {
			super(args[0], args[1]);
			const value = AsnConvert.parse(this.value, SubjectKeyIdentifier, this.parseOptions);
			this.keyId = Convert.ToHex(value);
		} else {
			const identifier = typeof args[0] === "string" ? Convert.FromHex(args[0]) : args[0];
			const value = new SubjectKeyIdentifier(identifier);
			super(id_ce_subjectKeyIdentifier, args[1], AsnConvert.serialize(value));
			this.keyId = Convert.ToHex(identifier);
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj[""] = AsnConvert.parse(this.value, SubjectKeyIdentifier, this.parseOptions);
		return obj;
	}
};
SubjectKeyIdentifierExtension.NAME = "Subject Key Identifier";
var SubjectAlternativeNameExtension = class extends Extension {
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else super(id_ce_subjectAltName, args[1], new GeneralNames(args[0] || []).rawData);
	}
	onInit(asn) {
		super.onInit(asn);
		const value = AsnConvert.parse(asn.extnValue, SubjectAlternativeName, this.parseOptions);
		this.names = new GeneralNames(value);
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		const namesObj = this.names.toTextObject();
		for (const key in namesObj) obj[key] = namesObj[key];
		return obj;
	}
};
SubjectAlternativeNameExtension.NAME = "Subject Alternative Name";
var ExtensionFactory = class {
	static register(id, type) {
		this.items.set(id, type);
	}
	static create(data, options) {
		const extension = new Extension(data, options);
		const Type = this.items.get(extension.type);
		if (Type) return new Type(data, options);
		return extension;
	}
};
ExtensionFactory.items = /* @__PURE__ */ new Map();
var CertificatePolicyExtension = class extends Extension {
	constructor(...args) {
		var _a;
		if (BufferSourceConverter.isBufferSource(args[0])) {
			super(args[0], args[1]);
			const asnPolicies = AsnConvert.parse(this.value, CertificatePolicies, this.parseOptions);
			this.policies = asnPolicies.map((o) => o.policyIdentifier);
		} else {
			const policies = args[0];
			const critical = (_a = args[1]) !== null && _a !== void 0 ? _a : false;
			const value = new CertificatePolicies(policies.map((o) => new PolicyInformation({ policyIdentifier: o })));
			super(id_ce_certificatePolicies, critical, AsnConvert.serialize(value));
			this.policies = policies;
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj["Policy"] = this.policies.map((o) => new TextObject("", {}, OidSerializer.toString(o)));
		return obj;
	}
};
CertificatePolicyExtension.NAME = "Certificate Policies";
ExtensionFactory.register(id_ce_certificatePolicies, CertificatePolicyExtension);
var CRLDistributionPointsExtension = class extends Extension {
	constructor(...args) {
		var _a;
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else if (Array.isArray(args[0]) && typeof args[0][0] === "string") {
			const dps = args[0].map((url) => {
				return new DistributionPoint({ distributionPoint: new DistributionPointName({ fullName: [new GeneralName$1({ uniformResourceIdentifier: url })] }) });
			});
			const value = new CRLDistributionPoints(dps);
			super(id_ce_cRLDistributionPoints, args[1], AsnConvert.serialize(value));
		} else {
			const value = new CRLDistributionPoints(args[0]);
			super(id_ce_cRLDistributionPoints, args[1], AsnConvert.serialize(value));
		}
		(_a = this.distributionPoints) !== null && _a !== void 0 || (this.distributionPoints = []);
	}
	onInit(asn) {
		super.onInit(asn);
		const crlExt = AsnConvert.parse(asn.extnValue, CRLDistributionPoints, this.parseOptions);
		this.distributionPoints = crlExt;
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj["Distribution Point"] = this.distributionPoints.map((dp) => {
			var _a;
			const dpObj = new TextObject("");
			if ((_a = dp.distributionPoint) === null || _a === void 0 ? void 0 : _a.fullName) dpObj[""] = dp.distributionPoint.fullName.map((name) => new GeneralName(name).toString()).join(", ");
			if (dp.reasons) dpObj["Reasons"] = dp.reasons.toString();
			if (dp.cRLIssuer) dpObj["CRL Issuer"] = dp.cRLIssuer.map((issuer) => issuer.toString()).join(", ");
			return dpObj;
		});
		return obj;
	}
};
CRLDistributionPointsExtension.NAME = "CRL Distribution Points";
var AuthorityInfoAccessExtension = class extends Extension {
	constructor(...args) {
		var _a, _b, _c, _d;
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else if (args[0] instanceof AuthorityInfoAccessSyntax) {
			const value = new AuthorityInfoAccessSyntax(args[0]);
			super(id_pe_authorityInfoAccess, args[1], AsnConvert.serialize(value));
		} else {
			const params = args[0];
			const value = new AuthorityInfoAccessSyntax();
			addAccessDescriptions(value, params, id_ad_ocsp, "ocsp");
			addAccessDescriptions(value, params, id_ad_caIssuers, "caIssuers");
			addAccessDescriptions(value, params, id_ad_timeStamping, "timeStamping");
			addAccessDescriptions(value, params, id_ad_caRepository, "caRepository");
			super(id_pe_authorityInfoAccess, args[1], AsnConvert.serialize(value));
		}
		(_a = this.ocsp) !== null && _a !== void 0 || (this.ocsp = []);
		(_b = this.caIssuers) !== null && _b !== void 0 || (this.caIssuers = []);
		(_c = this.timeStamping) !== null && _c !== void 0 || (this.timeStamping = []);
		(_d = this.caRepository) !== null && _d !== void 0 || (this.caRepository = []);
	}
	onInit(asn) {
		super.onInit(asn);
		this.ocsp = [];
		this.caIssuers = [];
		this.timeStamping = [];
		this.caRepository = [];
		AsnConvert.parse(asn.extnValue, AuthorityInfoAccessSyntax, this.parseOptions).forEach((accessDescription) => {
			switch (accessDescription.accessMethod) {
				case id_ad_ocsp:
					this.ocsp.push(new GeneralName(accessDescription.accessLocation));
					break;
				case id_ad_caIssuers:
					this.caIssuers.push(new GeneralName(accessDescription.accessLocation));
					break;
				case id_ad_timeStamping:
					this.timeStamping.push(new GeneralName(accessDescription.accessLocation));
					break;
				case id_ad_caRepository: this.caRepository.push(new GeneralName(accessDescription.accessLocation));
			}
		});
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		if (this.ocsp.length) addUrlsToObject(obj, "OCSP", this.ocsp);
		if (this.caIssuers.length) addUrlsToObject(obj, "CA Issuers", this.caIssuers);
		if (this.timeStamping.length) addUrlsToObject(obj, "Time Stamping", this.timeStamping);
		if (this.caRepository.length) addUrlsToObject(obj, "CA Repository", this.caRepository);
		return obj;
	}
};
AuthorityInfoAccessExtension.NAME = "Authority Info Access";
function addUrlsToObject(obj, key, urls) {
	if (urls.length === 1) obj[key] = urls[0].toTextObject();
	else {
		const names = new TextObject("");
		urls.forEach((name, index) => {
			const nameObj = name.toTextObject();
			const indexedKey = `${nameObj[TextObject.NAME]} ${index + 1}`;
			let field = names[indexedKey];
			if (!Array.isArray(field)) {
				field = [];
				names[indexedKey] = field;
			}
			field.push(nameObj);
		});
		obj[key] = names;
	}
}
function addAccessDescriptions(value, params, method, key) {
	const items = params[key];
	if (items) (Array.isArray(items) ? items : [items]).forEach((url) => {
		if (typeof url === "string") url = new GeneralName("url", url);
		value.push(new AccessDescription({
			accessMethod: method,
			accessLocation: AsnConvert.parse(url.rawData, GeneralName$1)
		}));
	});
}
var IssuerAlternativeNameExtension = class extends Extension {
	constructor(...args) {
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else super(id_ce_issuerAltName, args[1], new GeneralNames(args[0] || []).rawData);
	}
	onInit(asn) {
		super.onInit(asn);
		const value = AsnConvert.parse(asn.extnValue, GeneralNames$1, this.parseOptions);
		this.names = new GeneralNames(value);
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		const namesObj = this.names.toTextObject();
		for (const key in namesObj) obj[key] = namesObj[key];
		return obj;
	}
};
IssuerAlternativeNameExtension.NAME = "Issuer Alternative Name";
var Attribute = class Attribute extends AsnData {
	constructor(...args) {
		let raw;
		let options;
		if (BufferSourceConverter.isBufferSource(args[0])) {
			raw = BufferSourceConverter.toArrayBuffer(args[0]);
			options = args[1];
		} else {
			const type = args[0];
			const values = Array.isArray(args[1]) ? args[1].map((o) => BufferSourceConverter.toArrayBuffer(o)) : [];
			raw = AsnConvert.serialize(new Attribute$1({
				type,
				values
			}));
		}
		super(raw, Attribute$1, options);
	}
	onInit(asn) {
		this.type = asn.type;
		this.values = asn.values;
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj["Value"] = this.values.map((o) => new TextObject("", { "": o }));
		return obj;
	}
	toTextObjectWithoutValue() {
		const obj = this.toTextObjectEmpty();
		if (obj[TextObject.NAME] === Attribute.NAME) obj[TextObject.NAME] = OidSerializer.toString(this.type);
		return obj;
	}
};
Attribute.NAME = "Attribute";
var ChallengePasswordAttribute = class extends Attribute {
	constructor(...args) {
		var _a;
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else {
			const value = new ChallengePassword({ printableString: args[0] });
			super(id_pkcs9_at_challengePassword, [AsnConvert.serialize(value)]);
		}
		(_a = this.password) !== null && _a !== void 0 || (this.password = "");
	}
	onInit(asn) {
		super.onInit(asn);
		if (this.values[0]) {
			const value = AsnConvert.parse(this.values[0], ChallengePassword, this.parseOptions);
			this.password = value.toString();
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		obj[TextObject.VALUE] = this.password;
		return obj;
	}
};
ChallengePasswordAttribute.NAME = "Challenge Password";
var ExtensionsAttribute = class extends Attribute {
	constructor(...args) {
		var _a;
		if (BufferSourceConverter.isBufferSource(args[0])) super(args[0], args[1]);
		else {
			const extensions = args[0];
			const value = new Extensions();
			for (const extension of extensions) value.push(AsnConvert.parse(extension.rawData, Extension$1));
			super(id_pkcs9_at_extensionRequest, [AsnConvert.serialize(value)]);
		}
		(_a = this.items) !== null && _a !== void 0 || (this.items = []);
	}
	onInit(asn) {
		super.onInit(asn);
		if (this.values[0]) {
			const value = AsnConvert.parse(this.values[0], Extensions, this.parseOptions);
			this.items = value.map((o) => ExtensionFactory.create(AsnConvert.serialize(o), this.parseOptions));
		}
	}
	toTextObject() {
		const obj = this.toTextObjectWithoutValue();
		const extensions = this.items.map((o) => o.toTextObject());
		for (const extension of extensions) obj[extension[TextObject.NAME]] = extension;
		return obj;
	}
};
ExtensionsAttribute.NAME = "Extensions";
var AttributeFactory = class {
	static register(id, type) {
		this.items.set(id, type);
	}
	static create(data, options) {
		const attribute = new Attribute(data, options);
		const Type = this.items.get(attribute.type);
		if (Type) return new Type(data, options);
		return attribute;
	}
};
AttributeFactory.items = /* @__PURE__ */ new Map();
var diAsnSignatureFormatter = "crypto.signatureFormatter";
var AsnDefaultSignatureFormatter = class {
	toAsnSignature(algorithm, signature) {
		return BufferSourceConverter.toArrayBuffer(signature);
	}
	toWebSignature(algorithm, signature) {
		return BufferSourceConverter.toArrayBuffer(signature);
	}
};
var RsaAlgorithm_1;
var RsaAlgorithm = RsaAlgorithm_1 = class RsaAlgorithm {
	static createPssParams(hash, saltLength) {
		const hashAlgorithm = RsaAlgorithm_1.getHashAlgorithm(hash);
		if (!hashAlgorithm) return null;
		return new RsaSaPssParams({
			hashAlgorithm,
			maskGenAlgorithm: new AlgorithmIdentifier({
				algorithm: id_mgf1,
				parameters: AsnConvert.serialize(hashAlgorithm)
			}),
			saltLength
		});
	}
	static getHashAlgorithm(alg) {
		const algProv = instance.resolve(diAlgorithmProvider);
		if (typeof alg === "string") return algProv.toAsnAlgorithm({ name: alg });
		if (typeof alg === "object" && alg && "name" in alg) return algProv.toAsnAlgorithm(alg);
		return null;
	}
	toAsnAlgorithm(alg) {
		switch (alg.name.toLowerCase()) {
			case "rsassa-pkcs1-v1_5":
				if ("hash" in alg) {
					let hash;
					if (typeof alg.hash === "string") hash = alg.hash;
					else if (alg.hash && typeof alg.hash === "object" && "name" in alg.hash && typeof alg.hash.name === "string") hash = alg.hash.name.toUpperCase();
					else throw new Error("Cannot get hash algorithm name");
					switch (hash.toLowerCase()) {
						case "sha-1": return new AlgorithmIdentifier({
							algorithm: id_sha1WithRSAEncryption,
							parameters: null
						});
						case "sha-256": return new AlgorithmIdentifier({
							algorithm: id_sha256WithRSAEncryption,
							parameters: null
						});
						case "sha-384": return new AlgorithmIdentifier({
							algorithm: id_sha384WithRSAEncryption,
							parameters: null
						});
						case "sha-512": return new AlgorithmIdentifier({
							algorithm: id_sha512WithRSAEncryption,
							parameters: null
						});
					}
				} else return new AlgorithmIdentifier({
					algorithm: id_rsaEncryption,
					parameters: null
				});
				break;
			case "rsa-pss": if ("hash" in alg) {
				if (!("saltLength" in alg && typeof alg.saltLength === "number")) throw new Error("Cannot get 'saltLength' from 'alg' argument");
				const pssParams = RsaAlgorithm_1.createPssParams(alg.hash, alg.saltLength);
				if (!pssParams) throw new Error("Cannot create PSS parameters");
				return new AlgorithmIdentifier({
					algorithm: id_RSASSA_PSS,
					parameters: AsnConvert.serialize(pssParams)
				});
			} else return new AlgorithmIdentifier({
				algorithm: id_RSASSA_PSS,
				parameters: null
			});
		}
		return null;
	}
	toWebAlgorithm(alg) {
		switch (alg.algorithm) {
			case id_rsaEncryption: return { name: "RSASSA-PKCS1-v1_5" };
			case id_sha1WithRSAEncryption: return {
				name: "RSASSA-PKCS1-v1_5",
				hash: { name: "SHA-1" }
			};
			case id_sha256WithRSAEncryption: return {
				name: "RSASSA-PKCS1-v1_5",
				hash: { name: "SHA-256" }
			};
			case id_sha384WithRSAEncryption: return {
				name: "RSASSA-PKCS1-v1_5",
				hash: { name: "SHA-384" }
			};
			case id_sha512WithRSAEncryption: return {
				name: "RSASSA-PKCS1-v1_5",
				hash: { name: "SHA-512" }
			};
			case id_RSASSA_PSS: if (alg.parameters) {
				const pssParams = AsnConvert.parse(alg.parameters, RsaSaPssParams);
				return {
					name: "RSA-PSS",
					hash: instance.resolve(diAlgorithmProvider).toWebAlgorithm(pssParams.hashAlgorithm),
					saltLength: pssParams.saltLength
				};
			} else return { name: "RSA-PSS" };
		}
		return null;
	}
};
RsaAlgorithm = RsaAlgorithm_1 = __decorate([injectable()], RsaAlgorithm);
instance.registerSingleton(diAlgorithm, RsaAlgorithm);
var ShaAlgorithm = class ShaAlgorithm {
	toAsnAlgorithm(alg) {
		switch (alg.name.toLowerCase()) {
			case "sha-1": return new AlgorithmIdentifier({ algorithm: id_sha1 });
			case "sha-256": return new AlgorithmIdentifier({ algorithm: id_sha256 });
			case "sha-384": return new AlgorithmIdentifier({ algorithm: id_sha384 });
			case "sha-512": return new AlgorithmIdentifier({ algorithm: id_sha512 });
		}
		return null;
	}
	toWebAlgorithm(alg) {
		switch (alg.algorithm) {
			case id_sha1: return { name: "SHA-1" };
			case id_sha256: return { name: "SHA-256" };
			case id_sha384: return { name: "SHA-384" };
			case id_sha512: return { name: "SHA-512" };
		}
		return null;
	}
};
ShaAlgorithm = __decorate([injectable()], ShaAlgorithm);
instance.registerSingleton(diAlgorithm, ShaAlgorithm);
var AsnEcSignatureFormatter = class AsnEcSignatureFormatter {
	addPadding(pointSize, data) {
		const bytes = BufferSourceConverter.toUint8Array(data);
		const res = new Uint8Array(pointSize);
		res.set(bytes, pointSize - bytes.length);
		return res.buffer;
	}
	removePadding(data, positive = false) {
		let bytes = BufferSourceConverter.toUint8Array(data);
		for (let i = 0; i < bytes.length; i++) {
			if (!bytes[i]) continue;
			bytes = bytes.slice(i);
			break;
		}
		if (positive && bytes[0] > 127) {
			const result = new Uint8Array(bytes.length + 1);
			result.set(bytes, 1);
			return result.buffer;
		}
		return bytes.buffer;
	}
	toAsnSignature(algorithm, signature) {
		if (algorithm.name === "ECDSA") {
			const namedCurve = algorithm.namedCurve;
			const pointSize = AsnEcSignatureFormatter.namedCurveSize.get(namedCurve) || AsnEcSignatureFormatter.defaultNamedCurveSize;
			const ecSignature = new ECDSASigValue();
			const uint8Signature = BufferSourceConverter.toUint8Array(signature);
			ecSignature.r = this.removePadding(uint8Signature.slice(0, pointSize), true);
			ecSignature.s = this.removePadding(uint8Signature.slice(pointSize, pointSize + pointSize), true);
			return AsnConvert.serialize(ecSignature);
		}
		return null;
	}
	toWebSignature(algorithm, signature) {
		if (algorithm.name === "ECDSA") {
			const ecSigValue = AsnConvert.parse(signature, ECDSASigValue);
			const namedCurve = algorithm.namedCurve;
			const pointSize = AsnEcSignatureFormatter.namedCurveSize.get(namedCurve) || AsnEcSignatureFormatter.defaultNamedCurveSize;
			const r = this.addPadding(pointSize, this.removePadding(ecSigValue.r));
			const s = this.addPadding(pointSize, this.removePadding(ecSigValue.s));
			return combine(r, s);
		}
		return null;
	}
};
AsnEcSignatureFormatter.namedCurveSize = /* @__PURE__ */ new Map();
AsnEcSignatureFormatter.defaultNamedCurveSize = 32;
var idX25519 = "1.3.101.110";
var idX448 = "1.3.101.111";
var idEd25519 = "1.3.101.112";
var idEd448 = "1.3.101.113";
var EdAlgorithm = class EdAlgorithm {
	toAsnAlgorithm(alg) {
		let algorithm = null;
		switch (alg.name.toLowerCase()) {
			case "ed25519":
				algorithm = idEd25519;
				break;
			case "x25519":
				algorithm = idX25519;
				break;
			case "eddsa":
				switch (alg.namedCurve.toLowerCase()) {
					case "ed25519":
						algorithm = idEd25519;
						break;
					case "ed448": algorithm = idEd448;
				}
				break;
			case "ecdh-es": switch (alg.namedCurve.toLowerCase()) {
				case "x25519":
					algorithm = idX25519;
					break;
				case "x448": algorithm = idX448;
			}
		}
		if (algorithm) return new AlgorithmIdentifier({ algorithm });
		return null;
	}
	toWebAlgorithm(alg) {
		switch (alg.algorithm) {
			case idEd25519: return { name: "Ed25519" };
			case idEd448: return {
				name: "EdDSA",
				namedCurve: "Ed448"
			};
			case idX25519: return { name: "X25519" };
			case idX448: return {
				name: "ECDH-ES",
				namedCurve: "X448"
			};
		}
		return null;
	}
};
EdAlgorithm = __decorate([injectable()], EdAlgorithm);
instance.registerSingleton(diAlgorithm, EdAlgorithm);
var MlDsaAlgorithm = class MlDsaAlgorithm {
	toAsnAlgorithm(alg) {
		let algorithm = null;
		switch (alg.name.toLowerCase()) {
			case "ml-dsa-44":
				algorithm = id_ml_dsa_44;
				break;
			case "ml-dsa-65":
				algorithm = id_ml_dsa_65;
				break;
			case "ml-dsa-87": algorithm = id_ml_dsa_87;
		}
		if (algorithm) return new AlgorithmIdentifier({ algorithm });
		return null;
	}
	toWebAlgorithm(alg) {
		switch (alg.algorithm) {
			case id_ml_dsa_44: return { name: "ML-DSA-44" };
			case id_ml_dsa_65: return { name: "ML-DSA-65" };
			case id_ml_dsa_87: return { name: "ML-DSA-87" };
		}
		return null;
	}
};
MlDsaAlgorithm = __decorate([injectable()], MlDsaAlgorithm);
instance.registerSingleton(diAlgorithm, MlDsaAlgorithm);
var SlhDsaAlgorithm = class SlhDsaAlgorithm {
	toAsnAlgorithm(alg) {
		let algorithm = null;
		switch (alg.name.toLowerCase()) {
			case "slh-dsa-sha2-128s":
				algorithm = id_slh_dsa_sha2_128s;
				break;
			case "slh-dsa-sha2-128f":
				algorithm = id_slh_dsa_sha2_128f;
				break;
			case "slh-dsa-sha2-192s":
				algorithm = id_slh_dsa_sha2_192s;
				break;
			case "slh-dsa-sha2-192f":
				algorithm = id_slh_dsa_sha2_192f;
				break;
			case "slh-dsa-sha2-256s":
				algorithm = id_slh_dsa_sha2_256s;
				break;
			case "slh-dsa-sha2-256f":
				algorithm = id_slh_dsa_sha2_256f;
				break;
			case "slh-dsa-shake-128s":
				algorithm = id_slh_dsa_shake_128s;
				break;
			case "slh-dsa-shake-128f":
				algorithm = id_slh_dsa_shake_128f;
				break;
			case "slh-dsa-shake-192s":
				algorithm = id_slh_dsa_shake_192s;
				break;
			case "slh-dsa-shake-192f":
				algorithm = id_slh_dsa_shake_192f;
				break;
			case "slh-dsa-shake-256s":
				algorithm = id_slh_dsa_shake_256s;
				break;
			case "slh-dsa-shake-256f": algorithm = id_slh_dsa_shake_256f;
		}
		if (algorithm) return new AlgorithmIdentifier({ algorithm });
		return null;
	}
	toWebAlgorithm(alg) {
		switch (alg.algorithm) {
			case id_slh_dsa_sha2_128s: return { name: "SLH-DSA-SHA2-128s" };
			case id_slh_dsa_sha2_128f: return { name: "SLH-DSA-SHA2-128f" };
			case id_slh_dsa_sha2_192s: return { name: "SLH-DSA-SHA2-192s" };
			case id_slh_dsa_sha2_192f: return { name: "SLH-DSA-SHA2-192f" };
			case id_slh_dsa_sha2_256s: return { name: "SLH-DSA-SHA2-256s" };
			case id_slh_dsa_sha2_256f: return { name: "SLH-DSA-SHA2-256f" };
			case id_slh_dsa_shake_128s: return { name: "SLH-DSA-SHAKE-128s" };
			case id_slh_dsa_shake_128f: return { name: "SLH-DSA-SHAKE-128f" };
			case id_slh_dsa_shake_192s: return { name: "SLH-DSA-SHAKE-192s" };
			case id_slh_dsa_shake_192f: return { name: "SLH-DSA-SHAKE-192f" };
			case id_slh_dsa_shake_256s: return { name: "SLH-DSA-SHAKE-256s" };
			case id_slh_dsa_shake_256f: return { name: "SLH-DSA-SHAKE-256f" };
		}
		return null;
	}
};
SlhDsaAlgorithm = __decorate([injectable()], SlhDsaAlgorithm);
instance.registerSingleton(diAlgorithm, SlhDsaAlgorithm);
var _Pkcs10CertificateRequest_tbs;
var _Pkcs10CertificateRequest_subjectName;
var _Pkcs10CertificateRequest_subject;
var _Pkcs10CertificateRequest_signatureAlgorithm;
var _Pkcs10CertificateRequest_signature;
var _Pkcs10CertificateRequest_publicKey;
var _Pkcs10CertificateRequest_attributes;
var _Pkcs10CertificateRequest_extensions;
var Pkcs10CertificateRequest = class extends PemData {
	get subjectName() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_subjectName, "f")) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_subjectName, new Name(this.asn.certificationRequestInfo.subject), "f");
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_subjectName, "f");
	}
	get subject() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_subject, "f")) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_subject, this.subjectName.toString(), "f");
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_subject, "f");
	}
	get signatureAlgorithm() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_signatureAlgorithm, "f")) {
			const algProv = instance.resolve(diAlgorithmProvider);
			__classPrivateFieldSet(this, _Pkcs10CertificateRequest_signatureAlgorithm, algProv.toWebAlgorithm(this.asn.signatureAlgorithm), "f");
		}
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_signatureAlgorithm, "f");
	}
	get signature() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_signature, "f")) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_signature, this.asn.signature, "f");
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_signature, "f");
	}
	get publicKey() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_publicKey, "f")) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_publicKey, new PublicKey(this.asn.certificationRequestInfo.subjectPKInfo, this.parseOptions), "f");
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_publicKey, "f");
	}
	get attributes() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_attributes, "f")) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_attributes, this.asn.certificationRequestInfo.attributes.map((o) => AttributeFactory.create(AsnConvert.serialize(o), this.parseOptions)), "f");
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_attributes, "f");
	}
	get extensions() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_extensions, "f")) {
			__classPrivateFieldSet(this, _Pkcs10CertificateRequest_extensions, [], "f");
			const extensions = this.getAttribute(id_pkcs9_at_extensionRequest);
			if (extensions instanceof ExtensionsAttribute) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_extensions, extensions.items, "f");
		}
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_extensions, "f");
	}
	get tbs() {
		if (!__classPrivateFieldGet(this, _Pkcs10CertificateRequest_tbs, "f")) __classPrivateFieldSet(this, _Pkcs10CertificateRequest_tbs, this.asn.certificationRequestInfoRaw || AsnConvert.serialize(this.asn.certificationRequestInfo), "f");
		return __classPrivateFieldGet(this, _Pkcs10CertificateRequest_tbs, "f");
	}
	constructor(param, options) {
		const args = PemData.isAsnEncoded(param) ? [
			param,
			CertificationRequest,
			options
		] : [param, options];
		super(args[0], args[1], args[2]);
		_Pkcs10CertificateRequest_tbs.set(this, void 0);
		_Pkcs10CertificateRequest_subjectName.set(this, void 0);
		_Pkcs10CertificateRequest_subject.set(this, void 0);
		_Pkcs10CertificateRequest_signatureAlgorithm.set(this, void 0);
		_Pkcs10CertificateRequest_signature.set(this, void 0);
		_Pkcs10CertificateRequest_publicKey.set(this, void 0);
		_Pkcs10CertificateRequest_attributes.set(this, void 0);
		_Pkcs10CertificateRequest_extensions.set(this, void 0);
		this.tag = PemConverter.CertificateRequestTag;
	}
	onInit(_asn) {}
	getAttribute(type) {
		for (const attr of this.attributes) if (attr.type === type) return attr;
		return null;
	}
	getAttributes(type) {
		return this.attributes.filter((o) => o.type === type);
	}
	getExtension(type) {
		for (const ext of this.extensions) if (ext.type === type) return ext;
		return null;
	}
	getExtensions(type) {
		return this.extensions.filter((o) => o.type === type);
	}
	async verify(crypto = cryptoProvider.get()) {
		const algorithm = {
			...this.publicKey.algorithm,
			...this.signatureAlgorithm
		};
		const publicKey = await this.publicKey.export(algorithm, ["verify"], crypto);
		const signatureFormatters = instance.resolveAll(diAsnSignatureFormatter).reverse();
		let signature = null;
		for (const signatureFormatter of signatureFormatters) {
			signature = signatureFormatter.toWebSignature(algorithm, this.signature);
			if (signature) break;
		}
		if (!signature) throw Error("Cannot convert WebCrypto signature value to ASN.1 format");
		return await crypto.subtle.verify(this.signatureAlgorithm, publicKey, signature, this.tbs);
	}
	toTextObject() {
		const obj = this.toTextObjectEmpty();
		const req = AsnConvert.parse(this.rawData, CertificationRequest, this.parseOptions);
		const tbs = req.certificationRequestInfo;
		const data = new TextObject("", {
			Version: `${Version[tbs.version]} (${tbs.version})`,
			Subject: this.subject,
			"Subject Public Key Info": this.publicKey
		});
		if (this.attributes.length) {
			const attrs = new TextObject("");
			for (const ext of this.attributes) {
				const attrObj = ext.toTextObject();
				attrs[attrObj[TextObject.NAME]] = attrObj;
			}
			data["Attributes"] = attrs;
		}
		obj["Data"] = data;
		obj["Signature"] = new TextObject("", {
			Algorithm: TextConverter.serializeAlgorithm(req.signatureAlgorithm),
			"": req.signature
		});
		return obj;
	}
};
_Pkcs10CertificateRequest_tbs = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_subjectName = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_subject = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_signatureAlgorithm = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_signature = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_publicKey = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_attributes = /* @__PURE__ */ new WeakMap(), _Pkcs10CertificateRequest_extensions = /* @__PURE__ */ new WeakMap();
Pkcs10CertificateRequest.NAME = "PKCS#10 Certificate Request";
function toPositiveIntegerOctets(input) {
	let firstNonZero = 0;
	while (firstNonZero < input.length - 1 && input[firstNonZero] === 0) firstNonZero++;
	let serialNumber = input.slice(firstNonZero);
	if (!serialNumber.length) serialNumber = new Uint8Array([0]);
	if (serialNumber[0] > 127) {
		const newSerialNumber = new Uint8Array(serialNumber.length + 1);
		newSerialNumber[0] = 0;
		newSerialNumber.set(serialNumber, 1);
		serialNumber = newSerialNumber;
	}
	return serialNumber.buffer;
}
function normalizeCertificateSerialNumber(input) {
	return toPositiveIntegerOctets(BufferSourceConverter.toUint8Array(Convert.FromHex(input || "")));
}
function getCertificateSerialNumber(raw) {
	let serialNumber = BufferSourceConverter.toUint8Array(raw);
	if (serialNumber.length > 1 && serialNumber[0] === 0 && serialNumber[1] > 127) serialNumber = serialNumber.slice(1);
	return Convert.ToHex(serialNumber);
}
var _X509Certificate_tbs;
var _X509Certificate_serialNumber;
var _X509Certificate_subjectName;
var _X509Certificate_subject;
var _X509Certificate_issuerName;
var _X509Certificate_issuer;
var _X509Certificate_notBefore;
var _X509Certificate_notAfter;
var _X509Certificate_signatureAlgorithm;
var _X509Certificate_signature;
var _X509Certificate_extensions;
var _X509Certificate_publicKey;
var X509Certificate = class extends PemData {
	get publicKey() {
		if (!__classPrivateFieldGet(this, _X509Certificate_publicKey, "f")) __classPrivateFieldSet(this, _X509Certificate_publicKey, new PublicKey(this.asn.tbsCertificate.subjectPublicKeyInfo, this.parseOptions), "f");
		return __classPrivateFieldGet(this, _X509Certificate_publicKey, "f");
	}
	get serialNumber() {
		if (!__classPrivateFieldGet(this, _X509Certificate_serialNumber, "f")) __classPrivateFieldSet(this, _X509Certificate_serialNumber, getCertificateSerialNumber(this.asn.tbsCertificate.serialNumber), "f");
		return __classPrivateFieldGet(this, _X509Certificate_serialNumber, "f");
	}
	get subjectName() {
		if (!__classPrivateFieldGet(this, _X509Certificate_subjectName, "f")) __classPrivateFieldSet(this, _X509Certificate_subjectName, new Name(this.asn.tbsCertificate.subject), "f");
		return __classPrivateFieldGet(this, _X509Certificate_subjectName, "f");
	}
	get subject() {
		if (!__classPrivateFieldGet(this, _X509Certificate_subject, "f")) __classPrivateFieldSet(this, _X509Certificate_subject, this.subjectName.toString(), "f");
		return __classPrivateFieldGet(this, _X509Certificate_subject, "f");
	}
	get issuerName() {
		if (!__classPrivateFieldGet(this, _X509Certificate_issuerName, "f")) __classPrivateFieldSet(this, _X509Certificate_issuerName, new Name(this.asn.tbsCertificate.issuer), "f");
		return __classPrivateFieldGet(this, _X509Certificate_issuerName, "f");
	}
	get issuer() {
		if (!__classPrivateFieldGet(this, _X509Certificate_issuer, "f")) __classPrivateFieldSet(this, _X509Certificate_issuer, this.issuerName.toString(), "f");
		return __classPrivateFieldGet(this, _X509Certificate_issuer, "f");
	}
	get notBefore() {
		if (!__classPrivateFieldGet(this, _X509Certificate_notBefore, "f")) {
			const notBefore = this.asn.tbsCertificate.validity.notBefore.utcTime || this.asn.tbsCertificate.validity.notBefore.generalTime;
			if (!notBefore) throw new Error("Cannot get 'notBefore' value");
			__classPrivateFieldSet(this, _X509Certificate_notBefore, notBefore, "f");
		}
		return __classPrivateFieldGet(this, _X509Certificate_notBefore, "f");
	}
	get notAfter() {
		if (!__classPrivateFieldGet(this, _X509Certificate_notAfter, "f")) {
			const notAfter = this.asn.tbsCertificate.validity.notAfter.utcTime || this.asn.tbsCertificate.validity.notAfter.generalTime;
			if (!notAfter) throw new Error("Cannot get 'notAfter' value");
			__classPrivateFieldSet(this, _X509Certificate_notAfter, notAfter, "f");
		}
		return __classPrivateFieldGet(this, _X509Certificate_notAfter, "f");
	}
	get signatureAlgorithm() {
		if (!__classPrivateFieldGet(this, _X509Certificate_signatureAlgorithm, "f")) {
			const algProv = instance.resolve(diAlgorithmProvider);
			__classPrivateFieldSet(this, _X509Certificate_signatureAlgorithm, algProv.toWebAlgorithm(this.asn.signatureAlgorithm), "f");
		}
		return __classPrivateFieldGet(this, _X509Certificate_signatureAlgorithm, "f");
	}
	get signature() {
		if (!__classPrivateFieldGet(this, _X509Certificate_signature, "f")) __classPrivateFieldSet(this, _X509Certificate_signature, this.asn.signatureValue, "f");
		return __classPrivateFieldGet(this, _X509Certificate_signature, "f");
	}
	get extensions() {
		if (!__classPrivateFieldGet(this, _X509Certificate_extensions, "f")) {
			__classPrivateFieldSet(this, _X509Certificate_extensions, [], "f");
			if (this.asn.tbsCertificate.extensions) __classPrivateFieldSet(this, _X509Certificate_extensions, this.asn.tbsCertificate.extensions.map((o) => ExtensionFactory.create(AsnConvert.serialize(o), this.parseOptions)), "f");
		}
		return __classPrivateFieldGet(this, _X509Certificate_extensions, "f");
	}
	get tbs() {
		if (!__classPrivateFieldGet(this, _X509Certificate_tbs, "f")) __classPrivateFieldSet(this, _X509Certificate_tbs, this.asn.tbsCertificateRaw || AsnConvert.serialize(this.asn.tbsCertificate), "f");
		return __classPrivateFieldGet(this, _X509Certificate_tbs, "f");
	}
	constructor(param, options) {
		const args = PemData.isAsnEncoded(param) ? [
			param,
			Certificate,
			options
		] : [param, options];
		super(args[0], args[1], args[2]);
		_X509Certificate_tbs.set(this, void 0);
		_X509Certificate_serialNumber.set(this, void 0);
		_X509Certificate_subjectName.set(this, void 0);
		_X509Certificate_subject.set(this, void 0);
		_X509Certificate_issuerName.set(this, void 0);
		_X509Certificate_issuer.set(this, void 0);
		_X509Certificate_notBefore.set(this, void 0);
		_X509Certificate_notAfter.set(this, void 0);
		_X509Certificate_signatureAlgorithm.set(this, void 0);
		_X509Certificate_signature.set(this, void 0);
		_X509Certificate_extensions.set(this, void 0);
		_X509Certificate_publicKey.set(this, void 0);
		this.tag = PemConverter.CertificateTag;
	}
	onInit(_asn) {}
	getExtension(type) {
		for (const ext of this.extensions) if (typeof type === "string") {
			if (ext.type === type) return ext;
		} else if (ext instanceof type) return ext;
		return null;
	}
	getExtensions(type) {
		return this.extensions.filter((o) => {
			if (typeof type === "string") return o.type === type;
			else return o instanceof type;
		});
	}
	async verify(params = {}, crypto = cryptoProvider.get()) {
		let keyAlgorithm;
		let publicKey;
		const paramsKey = params.publicKey;
		try {
			if (!paramsKey) {
				keyAlgorithm = {
					...this.publicKey.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = await this.publicKey.export(keyAlgorithm, ["verify"], crypto);
			} else if ("publicKey" in paramsKey) {
				keyAlgorithm = {
					...paramsKey.publicKey.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = await paramsKey.publicKey.export(keyAlgorithm, ["verify"], crypto);
			} else if (paramsKey instanceof PublicKey) {
				keyAlgorithm = {
					...paramsKey.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = await paramsKey.export(keyAlgorithm, ["verify"], crypto);
			} else if (BufferSourceConverter.isBufferSource(paramsKey)) {
				const key = new PublicKey(paramsKey);
				keyAlgorithm = {
					...key.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = await key.export(keyAlgorithm, ["verify"], crypto);
			} else {
				keyAlgorithm = {
					...paramsKey.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = paramsKey;
			}
		} catch {
			return false;
		}
		const signatureFormatters = instance.resolveAll(diAsnSignatureFormatter).reverse();
		let signature = null;
		for (const signatureFormatter of signatureFormatters) {
			signature = signatureFormatter.toWebSignature(keyAlgorithm, this.signature);
			if (signature) break;
		}
		if (!signature) throw Error("Cannot convert ASN.1 signature value to WebCrypto format");
		const ok = await crypto.subtle.verify(this.signatureAlgorithm, publicKey, signature, this.tbs);
		if (params.signatureOnly) return ok;
		else {
			const time = (params.date || /* @__PURE__ */ new Date()).getTime();
			return ok && this.notBefore.getTime() < time && time < this.notAfter.getTime();
		}
	}
	async getThumbprint(arg1, arg2) {
		let crypto;
		let algorithm = "SHA-1";
		if (arg1) if (typeof arg1 === "object" && "subtle" in arg1) crypto = arg1;
		else {
			algorithm = arg1;
			crypto = arg2;
		}
		crypto !== null && crypto !== void 0 || (crypto = cryptoProvider.get());
		return await crypto.subtle.digest(algorithm, this.rawData);
	}
	async isSelfSigned(crypto = cryptoProvider.get()) {
		return this.subject === this.issuer && await this.verify({ signatureOnly: true }, crypto);
	}
	toTextObject() {
		const obj = this.toTextObjectEmpty();
		const cert = AsnConvert.parse(this.rawData, Certificate, this.parseOptions);
		const tbs = cert.tbsCertificate;
		const data = new TextObject("", {
			Version: `${Version[tbs.version]} (${tbs.version})`,
			"Serial Number": tbs.serialNumber,
			"Signature Algorithm": TextConverter.serializeAlgorithm(tbs.signature),
			Issuer: this.issuer,
			Validity: new TextObject("", {
				"Not Before": tbs.validity.notBefore.getTime(),
				"Not After": tbs.validity.notAfter.getTime()
			}),
			Subject: this.subject,
			"Subject Public Key Info": this.publicKey
		});
		if (tbs.issuerUniqueID) data["Issuer Unique ID"] = tbs.issuerUniqueID;
		if (tbs.subjectUniqueID) data["Subject Unique ID"] = tbs.subjectUniqueID;
		if (this.extensions.length) {
			const extensions = new TextObject("");
			for (const ext of this.extensions) {
				const extObj = ext.toTextObject();
				extensions[extObj[TextObject.NAME]] = extObj;
			}
			data["Extensions"] = extensions;
		}
		obj["Data"] = data;
		obj["Signature"] = new TextObject("", {
			Algorithm: TextConverter.serializeAlgorithm(cert.signatureAlgorithm),
			"": cert.signatureValue
		});
		return obj;
	}
};
_X509Certificate_tbs = /* @__PURE__ */ new WeakMap(), _X509Certificate_serialNumber = /* @__PURE__ */ new WeakMap(), _X509Certificate_subjectName = /* @__PURE__ */ new WeakMap(), _X509Certificate_subject = /* @__PURE__ */ new WeakMap(), _X509Certificate_issuerName = /* @__PURE__ */ new WeakMap(), _X509Certificate_issuer = /* @__PURE__ */ new WeakMap(), _X509Certificate_notBefore = /* @__PURE__ */ new WeakMap(), _X509Certificate_notAfter = /* @__PURE__ */ new WeakMap(), _X509Certificate_signatureAlgorithm = /* @__PURE__ */ new WeakMap(), _X509Certificate_signature = /* @__PURE__ */ new WeakMap(), _X509Certificate_extensions = /* @__PURE__ */ new WeakMap(), _X509Certificate_publicKey = /* @__PURE__ */ new WeakMap();
X509Certificate.NAME = "Certificate";
var _X509Certificates_options;
var X509Certificates = class extends Array {
	constructor(param, options) {
		super();
		_X509Certificates_options.set(this, void 0);
		if (PemData.isAsnEncoded(param)) this.import(param, options);
		else if (param instanceof X509Certificate) this.push(param);
		else if (Array.isArray(param)) for (const item of param) this.push(item);
	}
	export(format) {
		const signedData = new SignedData();
		signedData.version = 1;
		signedData.encapContentInfo.eContentType = id_data;
		signedData.encapContentInfo.eContent = new EncapsulatedContent({ single: new OctetString() });
		signedData.certificates = new CertificateSet(this.map((o) => new CertificateChoices({ certificate: AsnConvert.parse(o.rawData, Certificate, __classPrivateFieldGet(this, _X509Certificates_options, "f")) })));
		const cms = new ContentInfo({
			contentType: id_signedData,
			content: AsnConvert.serialize(signedData)
		});
		const raw = AsnConvert.serialize(cms);
		if (format === "raw") return raw;
		return this.toString(format);
	}
	import(data, options) {
		const raw = PemData.toArrayBuffer(data);
		const cms = AsnConvert.parse(raw, ContentInfo, options);
		if (cms.contentType !== "1.2.840.113549.1.7.2") throw new TypeError("Cannot parse CMS package. Incoming data is not a SignedData object.");
		const signedData = AsnConvert.parse(cms.content, SignedData, options);
		const certificates = [];
		for (const item of signedData.certificates || []) if (item.certificate) certificates.push(new X509Certificate(item.certificate, options));
		this.clear();
		for (const certificate of certificates) this.push(certificate);
		__classPrivateFieldSet(this, _X509Certificates_options, options, "f");
	}
	clear() {
		while (this.pop());
	}
	toString(format = "pem") {
		const raw = this.export("raw");
		switch (format) {
			case "pem": return PemConverter.encode(raw, "CMS");
			case "pem-chain": return this.map((o) => o.toString("pem")).join("\n");
			case "asn": return AsnConvert.toString(raw, __classPrivateFieldGet(this, _X509Certificates_options, "f"));
			case "hex": return Convert.ToHex(raw);
			case "base64": return Convert.ToBase64(raw);
			case "base64url": return Convert.ToBase64Url(raw);
			case "text": return TextConverter.serialize(this.toTextObject());
			default: throw TypeError("Argument 'format' is unsupported value");
		}
	}
	toTextObject() {
		const contentInfo = AsnConvert.parse(this.export("raw"), ContentInfo, __classPrivateFieldGet(this, _X509Certificates_options, "f"));
		const signedData = AsnConvert.parse(contentInfo.content, SignedData, __classPrivateFieldGet(this, _X509Certificates_options, "f"));
		return new TextObject("X509Certificates", {
			"Content Type": OidSerializer.toString(contentInfo.contentType),
			Content: new TextObject("", {
				Version: `${CMSVersion[signedData.version]} (${signedData.version})`,
				Certificates: new TextObject("", { Certificate: this.map((o) => o.toTextObject()) })
			})
		});
	}
};
_X509Certificates_options = /* @__PURE__ */ new WeakMap();
var X509ChainBuilder = class {
	constructor(params = {}) {
		this.certificates = [];
		if (params.certificates) this.certificates = params.certificates;
	}
	async build(cert, crypto = cryptoProvider.get()) {
		const chain = new X509Certificates(cert);
		let current = cert;
		while (current = await this.findIssuer(current, crypto)) {
			const thumbprint = await current.getThumbprint(crypto);
			for (const item of chain) {
				const thumbprint2 = await item.getThumbprint(crypto);
				if (isEqual(thumbprint, thumbprint2)) throw new Error("Cannot build a certificate chain. Circular dependency.");
			}
			chain.push(current);
		}
		return chain;
	}
	async findIssuer(cert, crypto = cryptoProvider.get()) {
		if (!await cert.isSelfSigned(crypto)) {
			const akiExt = cert.getExtension(id_ce_authorityKeyIdentifier);
			for (const item of this.certificates) {
				if (item.subject !== cert.issuer) continue;
				if (akiExt) {
					if (akiExt.keyId) {
						const skiExt = item.getExtension(id_ce_subjectKeyIdentifier);
						if (skiExt && skiExt.keyId !== akiExt.keyId) continue;
					} else if (akiExt.certId) {
						const sanExt = item.getExtension(id_ce_subjectAltName);
						if (sanExt && !(akiExt.certId.serialNumber === item.serialNumber && isEqual(AsnConvert.serialize(akiExt.certId.name), AsnConvert.serialize(sanExt)))) continue;
					}
				}
				try {
					const algorithm = {
						...item.publicKey.algorithm,
						...cert.signatureAlgorithm
					};
					const publicKey = await item.publicKey.export(algorithm, ["verify"], crypto);
					if (!await cert.verify({
						publicKey,
						signatureOnly: true
					}, crypto)) continue;
				} catch {
					continue;
				}
				return item;
			}
		}
		return null;
	}
};
var _X509CrlEntry_serialNumber;
var _X509CrlEntry_revocationDate;
var _X509CrlEntry_reason;
var _X509CrlEntry_invalidity;
var _X509CrlEntry_extensions;
var X509CrlReason;
(function(X509CrlReason) {
	X509CrlReason[X509CrlReason["unspecified"] = 0] = "unspecified";
	X509CrlReason[X509CrlReason["keyCompromise"] = 1] = "keyCompromise";
	X509CrlReason[X509CrlReason["cACompromise"] = 2] = "cACompromise";
	X509CrlReason[X509CrlReason["affiliationChanged"] = 3] = "affiliationChanged";
	X509CrlReason[X509CrlReason["superseded"] = 4] = "superseded";
	X509CrlReason[X509CrlReason["cessationOfOperation"] = 5] = "cessationOfOperation";
	X509CrlReason[X509CrlReason["certificateHold"] = 6] = "certificateHold";
	X509CrlReason[X509CrlReason["removeFromCRL"] = 8] = "removeFromCRL";
	X509CrlReason[X509CrlReason["privilegeWithdrawn"] = 9] = "privilegeWithdrawn";
	X509CrlReason[X509CrlReason["aACompromise"] = 10] = "aACompromise";
})(X509CrlReason || (X509CrlReason = {}));
var X509CrlEntry = class extends AsnData {
	get serialNumber() {
		if (!__classPrivateFieldGet(this, _X509CrlEntry_serialNumber, "f")) __classPrivateFieldSet(this, _X509CrlEntry_serialNumber, getCertificateSerialNumber(this.asn.userCertificate), "f");
		return __classPrivateFieldGet(this, _X509CrlEntry_serialNumber, "f");
	}
	get revocationDate() {
		if (!__classPrivateFieldGet(this, _X509CrlEntry_revocationDate, "f")) __classPrivateFieldSet(this, _X509CrlEntry_revocationDate, this.asn.revocationDate.getTime(), "f");
		return __classPrivateFieldGet(this, _X509CrlEntry_revocationDate, "f");
	}
	get reason() {
		if (__classPrivateFieldGet(this, _X509CrlEntry_reason, "f") === void 0) this.extensions;
		return __classPrivateFieldGet(this, _X509CrlEntry_reason, "f");
	}
	get invalidity() {
		if (__classPrivateFieldGet(this, _X509CrlEntry_invalidity, "f") === void 0) this.extensions;
		return __classPrivateFieldGet(this, _X509CrlEntry_invalidity, "f");
	}
	get extensions() {
		if (!__classPrivateFieldGet(this, _X509CrlEntry_extensions, "f")) {
			__classPrivateFieldSet(this, _X509CrlEntry_extensions, [], "f");
			if (this.asn.crlEntryExtensions) __classPrivateFieldSet(this, _X509CrlEntry_extensions, this.asn.crlEntryExtensions.map((o) => {
				const extension = ExtensionFactory.create(AsnConvert.serialize(o), this.parseOptions);
				switch (extension.type) {
					case id_ce_cRLReasons:
						if (__classPrivateFieldGet(this, _X509CrlEntry_reason, "f") === void 0) __classPrivateFieldSet(this, _X509CrlEntry_reason, AsnConvert.parse(extension.value, CRLReason, this.parseOptions).reason, "f");
						break;
					case id_ce_invalidityDate: if (__classPrivateFieldGet(this, _X509CrlEntry_invalidity, "f") === void 0) __classPrivateFieldSet(this, _X509CrlEntry_invalidity, AsnConvert.parse(extension.value, InvalidityDate, this.parseOptions).value, "f");
				}
				return extension;
			}), "f");
		}
		return __classPrivateFieldGet(this, _X509CrlEntry_extensions, "f");
	}
	constructor(...args) {
		let raw;
		let options;
		if (BufferSourceConverter.isBufferSource(args[0])) {
			raw = BufferSourceConverter.toArrayBuffer(args[0]);
			options = args[1];
		} else if (typeof args[0] === "string") raw = AsnConvert.serialize(new RevokedCertificate({
			userCertificate: normalizeCertificateSerialNumber(args[0]),
			revocationDate: new Time(args[1]),
			crlEntryExtensions: args[2]
		}));
		else if (args[0] instanceof RevokedCertificate) {
			raw = args[0];
			options = args[1];
		}
		if (!raw) throw new TypeError("Cannot create X509CrlEntry instance. Wrong constructor arguments.");
		const superArgs = raw instanceof RevokedCertificate ? [raw, options] : [
			raw,
			RevokedCertificate,
			options
		];
		super(superArgs[0], superArgs[1], superArgs[2]);
		_X509CrlEntry_serialNumber.set(this, void 0);
		_X509CrlEntry_revocationDate.set(this, void 0);
		_X509CrlEntry_reason.set(this, void 0);
		_X509CrlEntry_invalidity.set(this, void 0);
		_X509CrlEntry_extensions.set(this, void 0);
	}
	onInit(_asn) {}
};
_X509CrlEntry_serialNumber = /* @__PURE__ */ new WeakMap(), _X509CrlEntry_revocationDate = /* @__PURE__ */ new WeakMap(), _X509CrlEntry_reason = /* @__PURE__ */ new WeakMap(), _X509CrlEntry_invalidity = /* @__PURE__ */ new WeakMap(), _X509CrlEntry_extensions = /* @__PURE__ */ new WeakMap();
var _X509Crl_tbs;
var _X509Crl_signatureAlgorithm;
var _X509Crl_issuerName;
var _X509Crl_thisUpdate;
var _X509Crl_nextUpdate;
var _X509Crl_entries;
var _X509Crl_extensions;
var X509Crl = class extends PemData {
	get version() {
		return this.asn.tbsCertList.version;
	}
	get signatureAlgorithm() {
		if (!__classPrivateFieldGet(this, _X509Crl_signatureAlgorithm, "f")) {
			const algProv = instance.resolve(diAlgorithmProvider);
			__classPrivateFieldSet(this, _X509Crl_signatureAlgorithm, algProv.toWebAlgorithm(this.asn.signatureAlgorithm), "f");
		}
		return __classPrivateFieldGet(this, _X509Crl_signatureAlgorithm, "f");
	}
	get signature() {
		return this.asn.signature;
	}
	get issuer() {
		return this.issuerName.toString();
	}
	get issuerName() {
		if (!__classPrivateFieldGet(this, _X509Crl_issuerName, "f")) __classPrivateFieldSet(this, _X509Crl_issuerName, new Name(this.asn.tbsCertList.issuer), "f");
		return __classPrivateFieldGet(this, _X509Crl_issuerName, "f");
	}
	get thisUpdate() {
		if (!__classPrivateFieldGet(this, _X509Crl_thisUpdate, "f")) {
			const thisUpdate = this.asn.tbsCertList.thisUpdate.getTime();
			if (!thisUpdate) throw new Error("Cannot get 'thisUpdate' value");
			__classPrivateFieldSet(this, _X509Crl_thisUpdate, thisUpdate, "f");
		}
		return __classPrivateFieldGet(this, _X509Crl_thisUpdate, "f");
	}
	get nextUpdate() {
		var _a;
		if (__classPrivateFieldGet(this, _X509Crl_nextUpdate, "f") === void 0) __classPrivateFieldSet(this, _X509Crl_nextUpdate, ((_a = this.asn.tbsCertList.nextUpdate) === null || _a === void 0 ? void 0 : _a.getTime()) || void 0, "f");
		return __classPrivateFieldGet(this, _X509Crl_nextUpdate, "f");
	}
	get entries() {
		var _a;
		if (!__classPrivateFieldGet(this, _X509Crl_entries, "f")) __classPrivateFieldSet(this, _X509Crl_entries, ((_a = this.asn.tbsCertList.revokedCertificates) === null || _a === void 0 ? void 0 : _a.map((o) => new X509CrlEntry(o, this.parseOptions))) || [], "f");
		return __classPrivateFieldGet(this, _X509Crl_entries, "f");
	}
	get extensions() {
		if (!__classPrivateFieldGet(this, _X509Crl_extensions, "f")) {
			__classPrivateFieldSet(this, _X509Crl_extensions, [], "f");
			if (this.asn.tbsCertList.crlExtensions) __classPrivateFieldSet(this, _X509Crl_extensions, this.asn.tbsCertList.crlExtensions.map((o) => ExtensionFactory.create(AsnConvert.serialize(o), this.parseOptions)), "f");
		}
		return __classPrivateFieldGet(this, _X509Crl_extensions, "f");
	}
	get tbs() {
		if (!__classPrivateFieldGet(this, _X509Crl_tbs, "f")) __classPrivateFieldSet(this, _X509Crl_tbs, this.asn.tbsCertListRaw || AsnConvert.serialize(this.asn.tbsCertList), "f");
		return __classPrivateFieldGet(this, _X509Crl_tbs, "f");
	}
	get tbsCertListSignatureAlgorithm() {
		return this.asn.tbsCertList.signature;
	}
	get certListSignatureAlgorithm() {
		return this.asn.signatureAlgorithm;
	}
	constructor(param, options) {
		const args = PemData.isAsnEncoded(param) ? [
			param,
			CertificateList,
			options
		] : [param, options];
		super(args[0], args[1], args[2]);
		this.tag = PemConverter.CrlTag;
		_X509Crl_tbs.set(this, void 0);
		_X509Crl_signatureAlgorithm.set(this, void 0);
		_X509Crl_issuerName.set(this, void 0);
		_X509Crl_thisUpdate.set(this, void 0);
		_X509Crl_nextUpdate.set(this, void 0);
		_X509Crl_entries.set(this, void 0);
		_X509Crl_extensions.set(this, void 0);
	}
	onInit(_asn) {}
	getExtension(type) {
		for (const ext of this.extensions) if (typeof type === "string") {
			if (ext.type === type) return ext;
		} else if (ext instanceof type) return ext;
		return null;
	}
	getExtensions(type) {
		return this.extensions.filter((o) => {
			if (typeof type === "string") return o.type === type;
			else return o instanceof type;
		});
	}
	async verify(params, crypto = cryptoProvider.get()) {
		if (!this.certListSignatureAlgorithm.isEqual(this.tbsCertListSignatureAlgorithm)) throw new Error("algorithm identifier in the sequence tbsCertList and CertificateList mismatch");
		let keyAlgorithm;
		let publicKey;
		const paramsKey = params.publicKey;
		try {
			if (paramsKey instanceof X509Certificate) {
				keyAlgorithm = {
					...paramsKey.publicKey.algorithm,
					...paramsKey.signatureAlgorithm
				};
				publicKey = await paramsKey.publicKey.export(keyAlgorithm, ["verify"]);
			} else if (paramsKey instanceof PublicKey) {
				keyAlgorithm = {
					...paramsKey.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = await paramsKey.export(keyAlgorithm, ["verify"]);
			} else {
				keyAlgorithm = {
					...paramsKey.algorithm,
					...this.signatureAlgorithm
				};
				publicKey = paramsKey;
			}
		} catch {
			return false;
		}
		const signatureFormatters = instance.resolveAll(diAsnSignatureFormatter).reverse();
		let signature = null;
		for (const signatureFormatter of signatureFormatters) {
			signature = signatureFormatter.toWebSignature(keyAlgorithm, this.signature);
			if (signature) break;
		}
		if (!signature) throw Error("Cannot convert ASN.1 signature value to WebCrypto format");
		return await crypto.subtle.verify(this.signatureAlgorithm, publicKey, signature, this.tbs);
	}
	async getThumbprint(arg1, arg2) {
		let crypto;
		let algorithm = "SHA-1";
		if (arg1) if (typeof arg1 === "object" && "subtle" in arg1) crypto = arg1;
		else {
			algorithm = arg1;
			crypto = arg2;
		}
		crypto !== null && crypto !== void 0 || (crypto = cryptoProvider.get());
		return await crypto.subtle.digest(algorithm, this.rawData);
	}
	findRevoked(certOrSerialNumber) {
		const serialBuffer = normalizeCertificateSerialNumber(typeof certOrSerialNumber === "string" ? certOrSerialNumber : certOrSerialNumber.serialNumber);
		for (const revoked of this.asn.tbsCertList.revokedCertificates || []) if (BufferSourceConverter.isEqual(revoked.userCertificate, serialBuffer)) return new X509CrlEntry(AsnConvert.serialize(revoked), this.parseOptions);
		return null;
	}
};
_X509Crl_tbs = /* @__PURE__ */ new WeakMap(), _X509Crl_signatureAlgorithm = /* @__PURE__ */ new WeakMap(), _X509Crl_issuerName = /* @__PURE__ */ new WeakMap(), _X509Crl_thisUpdate = /* @__PURE__ */ new WeakMap(), _X509Crl_nextUpdate = /* @__PURE__ */ new WeakMap(), _X509Crl_entries = /* @__PURE__ */ new WeakMap(), _X509Crl_extensions = /* @__PURE__ */ new WeakMap();
ExtensionFactory.register(id_ce_basicConstraints, BasicConstraintsExtension);
ExtensionFactory.register(id_ce_extKeyUsage, ExtendedKeyUsageExtension);
ExtensionFactory.register(id_ce_keyUsage, KeyUsagesExtension);
ExtensionFactory.register(id_ce_subjectKeyIdentifier, SubjectKeyIdentifierExtension);
ExtensionFactory.register(id_ce_authorityKeyIdentifier, AuthorityKeyIdentifierExtension);
ExtensionFactory.register(id_ce_subjectAltName, SubjectAlternativeNameExtension);
ExtensionFactory.register(id_ce_cRLDistributionPoints, CRLDistributionPointsExtension);
ExtensionFactory.register(id_pe_authorityInfoAccess, AuthorityInfoAccessExtension);
ExtensionFactory.register(id_ce_issuerAltName, IssuerAlternativeNameExtension);
AttributeFactory.register(id_pkcs9_at_challengePassword, ChallengePasswordAttribute);
AttributeFactory.register(id_pkcs9_at_extensionRequest, ExtensionsAttribute);
instance.registerSingleton(diAsnSignatureFormatter, AsnDefaultSignatureFormatter);
instance.registerSingleton(diAsnSignatureFormatter, AsnEcSignatureFormatter);
AsnEcSignatureFormatter.namedCurveSize.set("P-256", 32);
AsnEcSignatureFormatter.namedCurveSize.set("K-256", 32);
AsnEcSignatureFormatter.namedCurveSize.set("P-384", 48);
AsnEcSignatureFormatter.namedCurveSize.set("P-521", 66);
//#endregion
export { X509ChainBuilder as a, X509Certificate as i, CRLDistributionPointsExtension as n, X509Crl as o, SubjectKeyIdentifierExtension as r, AuthorityKeyIdentifierExtension as t };
