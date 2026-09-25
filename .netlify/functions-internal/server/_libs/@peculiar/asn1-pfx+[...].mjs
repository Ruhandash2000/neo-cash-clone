import { f as OctetString, h as AsnTypeTypes, i as AsnArray, l as AsnIntegerArrayBufferConverter, m as AsnPropTypes, o as AsnProp, r as AsnConvert, s as AsnType, u as AsnOctetStringConverter } from "./asn1-android+[...].mjs";
import { f as AlgorithmIdentifier, n as PrivateKeyInfo, r as EncryptedPrivateKeyInfo } from "./asn1-asym-key+[...].mjs";
import { a as ContentInfo } from "./asn1-cms+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/asn1-rsa/build/es2015/object_identifiers.js
var id_pkcs_1 = "1.2.840.113549.1.1";
var id_rsaEncryption = `${id_pkcs_1}.1`;
var id_RSAES_OAEP = `${id_pkcs_1}.7`;
var id_pSpecified = `${id_pkcs_1}.9`;
var id_RSASSA_PSS = `${id_pkcs_1}.10`;
var id_md2WithRSAEncryption = `${id_pkcs_1}.2`;
var id_md5WithRSAEncryption = `${id_pkcs_1}.4`;
var id_sha1WithRSAEncryption = `${id_pkcs_1}.5`;
var id_sha224WithRSAEncryption = `${id_pkcs_1}.14`;
var id_sha256WithRSAEncryption = `${id_pkcs_1}.11`;
var id_sha384WithRSAEncryption = `${id_pkcs_1}.12`;
var id_sha512WithRSAEncryption = `${id_pkcs_1}.13`;
var id_sha512_224WithRSAEncryption = `${id_pkcs_1}.15`;
var id_sha512_256WithRSAEncryption = `${id_pkcs_1}.16`;
var id_sha1 = "1.3.14.3.2.26";
var id_sha224 = "2.16.840.1.101.3.4.2.4";
var id_sha256 = "2.16.840.1.101.3.4.2.1";
var id_sha384 = "2.16.840.1.101.3.4.2.2";
var id_sha512 = "2.16.840.1.101.3.4.2.3";
var id_sha512_224 = "2.16.840.1.101.3.4.2.5";
var id_sha512_256 = "2.16.840.1.101.3.4.2.6";
var id_md2 = "1.2.840.113549.2.2";
var id_md5 = "1.2.840.113549.2.5";
var id_mgf1 = `${id_pkcs_1}.8`;
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/algorithms.js
function create(algorithm) {
	return new AlgorithmIdentifier({
		algorithm,
		parameters: null
	});
}
create(id_md2);
create(id_md5);
var sha1 = create(id_sha1);
create(id_sha224);
create(id_sha256);
create(id_sha384);
create(id_sha512);
create(id_sha512_224);
create(id_sha512_256);
var mgf1SHA1 = new AlgorithmIdentifier({
	algorithm: id_mgf1,
	parameters: AsnConvert.serialize(sha1)
});
var pSpecifiedEmpty = new AlgorithmIdentifier({
	algorithm: id_pSpecified,
	parameters: AsnConvert.serialize(AsnOctetStringConverter.toASN(new Uint8Array([
		218,
		57,
		163,
		238,
		94,
		107,
		75,
		13,
		50,
		85,
		191,
		239,
		149,
		96,
		24,
		144,
		175,
		216,
		7,
		9
	]).buffer))
});
create(id_rsaEncryption);
create(id_md2WithRSAEncryption);
create(id_md5WithRSAEncryption);
create(id_sha1WithRSAEncryption);
create(id_sha512_224WithRSAEncryption);
create(id_sha512_256WithRSAEncryption);
create(id_sha384WithRSAEncryption);
create(id_sha512WithRSAEncryption);
create(id_sha512_224WithRSAEncryption);
create(id_sha512_256WithRSAEncryption);
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsaes_oaep.js
var RsaEsOaepParams = class {
	hashAlgorithm = new AlgorithmIdentifier(sha1);
	maskGenAlgorithm = new AlgorithmIdentifier({
		algorithm: id_mgf1,
		parameters: AsnConvert.serialize(sha1)
	});
	pSourceAlgorithm = new AlgorithmIdentifier(pSpecifiedEmpty);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AlgorithmIdentifier,
	context: 0,
	defaultValue: sha1
})], RsaEsOaepParams.prototype, "hashAlgorithm", void 0);
__decorate([AsnProp({
	type: AlgorithmIdentifier,
	context: 1,
	defaultValue: mgf1SHA1
})], RsaEsOaepParams.prototype, "maskGenAlgorithm", void 0);
__decorate([AsnProp({
	type: AlgorithmIdentifier,
	context: 2,
	defaultValue: pSpecifiedEmpty
})], RsaEsOaepParams.prototype, "pSourceAlgorithm", void 0);
new AlgorithmIdentifier({
	algorithm: id_RSAES_OAEP,
	parameters: AsnConvert.serialize(new RsaEsOaepParams())
});
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsassa_pss.js
var RsaSaPssParams = class {
	hashAlgorithm = new AlgorithmIdentifier(sha1);
	maskGenAlgorithm = new AlgorithmIdentifier({
		algorithm: id_mgf1,
		parameters: AsnConvert.serialize(sha1)
	});
	saltLength = 20;
	trailerField = 1;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AlgorithmIdentifier,
	context: 0,
	defaultValue: sha1
})], RsaSaPssParams.prototype, "hashAlgorithm", void 0);
__decorate([AsnProp({
	type: AlgorithmIdentifier,
	context: 1,
	defaultValue: mgf1SHA1
})], RsaSaPssParams.prototype, "maskGenAlgorithm", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 2,
	defaultValue: 20
})], RsaSaPssParams.prototype, "saltLength", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 3,
	defaultValue: 1
})], RsaSaPssParams.prototype, "trailerField", void 0);
new AlgorithmIdentifier({
	algorithm: id_RSASSA_PSS,
	parameters: AsnConvert.serialize(new RsaSaPssParams())
});
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/parameters/rsassa_pkcs1_v1_5.js
var DigestInfo = class {
	digestAlgorithm = new AlgorithmIdentifier();
	digest = new OctetString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AlgorithmIdentifier })], DigestInfo.prototype, "digestAlgorithm", void 0);
__decorate([AsnProp({ type: OctetString })], DigestInfo.prototype, "digest", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/other_prime_info.js
var OtherPrimeInfos_1;
var OtherPrimeInfo = class {
	prime = /* @__PURE__ */ new ArrayBuffer(0);
	exponent = /* @__PURE__ */ new ArrayBuffer(0);
	coefficient = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], OtherPrimeInfo.prototype, "prime", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], OtherPrimeInfo.prototype, "exponent", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], OtherPrimeInfo.prototype, "coefficient", void 0);
var OtherPrimeInfos = OtherPrimeInfos_1 = class OtherPrimeInfos extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, OtherPrimeInfos_1.prototype);
	}
};
OtherPrimeInfos = OtherPrimeInfos_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: OtherPrimeInfo
})], OtherPrimeInfos);
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/rsa_private_key.js
var RSAPrivateKey = class {
	version = 0;
	modulus = /* @__PURE__ */ new ArrayBuffer(0);
	publicExponent = /* @__PURE__ */ new ArrayBuffer(0);
	privateExponent = /* @__PURE__ */ new ArrayBuffer(0);
	prime1 = /* @__PURE__ */ new ArrayBuffer(0);
	prime2 = /* @__PURE__ */ new ArrayBuffer(0);
	exponent1 = /* @__PURE__ */ new ArrayBuffer(0);
	exponent2 = /* @__PURE__ */ new ArrayBuffer(0);
	coefficient = /* @__PURE__ */ new ArrayBuffer(0);
	otherPrimeInfos;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], RSAPrivateKey.prototype, "version", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "modulus", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "publicExponent", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "privateExponent", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "prime1", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "prime2", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "exponent1", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "exponent2", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPrivateKey.prototype, "coefficient", void 0);
__decorate([AsnProp({
	type: OtherPrimeInfos,
	optional: true
})], RSAPrivateKey.prototype, "otherPrimeInfos", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-rsa/build/es2015/rsa_public_key.js
var RSAPublicKey = class {
	modulus = /* @__PURE__ */ new ArrayBuffer(0);
	publicExponent = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPublicKey.prototype, "modulus", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RSAPublicKey.prototype, "publicExponent", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/attribute.js
var PKCS12AttrSet_1;
var PKCS12Attribute = class {
	attrId = "";
	attrValues = [];
	constructor(params = {}) {
		Object.assign(params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], PKCS12Attribute.prototype, "attrId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	repeated: "set"
})], PKCS12Attribute.prototype, "attrValues", void 0);
var PKCS12AttrSet = PKCS12AttrSet_1 = class PKCS12AttrSet extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, PKCS12AttrSet_1.prototype);
	}
};
PKCS12AttrSet = PKCS12AttrSet_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: PKCS12Attribute
})], PKCS12AttrSet);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/authenticated_safe.js
var AuthenticatedSafe_1;
var AuthenticatedSafe = AuthenticatedSafe_1 = class AuthenticatedSafe extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, AuthenticatedSafe_1.prototype);
	}
};
AuthenticatedSafe = AuthenticatedSafe_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: ContentInfo
})], AuthenticatedSafe);
var id_pkcs_12 = `1.2.840.113549.1.12`;
var id_pkcs_12PbeIds = `${id_pkcs_12}.1`;
`${id_pkcs_12PbeIds}`;
`${id_pkcs_12PbeIds}`;
`${id_pkcs_12PbeIds}`;
`${id_pkcs_12PbeIds}`;
`${id_pkcs_12PbeIds}`;
`${id_pkcs_12PbeIds}`;
var id_bagtypes = `${id_pkcs_12}.10.1`;
`${id_bagtypes}`;
`${id_bagtypes}`;
`${id_bagtypes}`;
`${id_bagtypes}`;
`${id_bagtypes}`;
`${id_bagtypes}`;
var id_pkcs_9 = "1.2.840.113549.1.9";
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/bags/cert_bag.js
var CertBag = class {
	certId = "";
	certValue = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], CertBag.prototype, "certId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 0
})], CertBag.prototype, "certValue", void 0);
var id_certTypes = `${id_pkcs_9}.22`;
`${id_certTypes}`;
`${id_certTypes}`;
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/bags/crl_bag.js
var CRLBag = class {
	crlId = "";
	crltValue = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], CRLBag.prototype, "crlId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 0
})], CRLBag.prototype, "crltValue", void 0);
`${id_pkcs_9}`;
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/bags/key_bag.js
var KeyBag = class KeyBag extends PrivateKeyInfo {};
KeyBag = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], KeyBag);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/bags/pkcs8_shrouded_key_bag.js
var PKCS8ShroudedKeyBag = class PKCS8ShroudedKeyBag extends EncryptedPrivateKeyInfo {};
PKCS8ShroudedKeyBag = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], PKCS8ShroudedKeyBag);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/bags/secret_bag.js
var SecretBag = class {
	secretTypeId = "";
	secretValue = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], SecretBag.prototype, "secretTypeId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 0
})], SecretBag.prototype, "secretValue", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/mac_data.js
var MacData = class {
	mac = new DigestInfo();
	macSalt = new OctetString();
	iterations = 1;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: DigestInfo })], MacData.prototype, "mac", void 0);
__decorate([AsnProp({ type: OctetString })], MacData.prototype, "macSalt", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	defaultValue: 1
})], MacData.prototype, "iterations", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/pfx.js
var PFX = class {
	version = 3;
	authSafe = new ContentInfo();
	macData = new MacData();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], PFX.prototype, "version", void 0);
__decorate([AsnProp({ type: ContentInfo })], PFX.prototype, "authSafe", void 0);
__decorate([AsnProp({
	type: MacData,
	optional: true
})], PFX.prototype, "macData", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-pfx/build/es2015/safe_bag.js
var SafeContents_1;
var SafeBag = class {
	bagId = "";
	bagValue = /* @__PURE__ */ new ArrayBuffer(0);
	bagAttributes;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], SafeBag.prototype, "bagId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 0
})], SafeBag.prototype, "bagValue", void 0);
__decorate([AsnProp({
	type: PKCS12Attribute,
	repeated: "set",
	optional: true
})], SafeBag.prototype, "bagAttributes", void 0);
var SafeContents = SafeContents_1 = class SafeContents extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, SafeContents_1.prototype);
	}
};
SafeContents = SafeContents_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: SafeBag
})], SafeContents);
//#endregion
export { id_mgf1 as a, id_sha1WithRSAEncryption as c, id_sha256 as d, id_sha256WithRSAEncryption as f, id_sha512WithRSAEncryption as g, id_sha512 as h, id_RSASSA_PSS as i, id_sha224 as l, id_sha384WithRSAEncryption as m, RSAPublicKey as n, id_rsaEncryption as o, id_sha384 as p, RsaSaPssParams as r, id_sha1 as s, PFX as t, id_sha224WithRSAEncryption as u };
