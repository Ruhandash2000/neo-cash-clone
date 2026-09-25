import { f as OctetString, h as AsnTypeTypes, l as AsnIntegerArrayBufferConverter, m as AsnPropTypes, o as AsnProp, s as AsnType } from "./@peculiar/asn1-android+[...].mjs";
import { f as AlgorithmIdentifier } from "./@peculiar/asn1-asym-key+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/asn1-ecc/build/es2015/object_identifiers.js
var id_ecPublicKey = "1.2.840.10045.2.1";
var id_ecdsaWithSHA1 = "1.2.840.10045.4.1";
var id_ecdsaWithSHA224 = "1.2.840.10045.4.3.1";
var id_ecdsaWithSHA256 = "1.2.840.10045.4.3.2";
var id_ecdsaWithSHA384 = "1.2.840.10045.4.3.3";
var id_ecdsaWithSHA512 = "1.2.840.10045.4.3.4";
var id_secp256r1 = "1.2.840.10045.3.1.7";
var id_secp384r1 = "1.3.132.0.34";
var id_secp521r1 = "1.3.132.0.35";
//#endregion
//#region node_modules/@peculiar/asn1-ecc/build/es2015/algorithms.js
function create(algorithm) {
	return new AlgorithmIdentifier({ algorithm });
}
var ecdsaWithSHA1 = create(id_ecdsaWithSHA1);
create(id_ecdsaWithSHA224);
var ecdsaWithSHA256 = create(id_ecdsaWithSHA256);
var ecdsaWithSHA384 = create(id_ecdsaWithSHA384);
var ecdsaWithSHA512 = create(id_ecdsaWithSHA512);
//#endregion
//#region node_modules/@peculiar/asn1-ecc/build/es2015/rfc3279.js
var FieldID = class FieldID {
	fieldType;
	parameters;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], FieldID.prototype, "fieldType", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], FieldID.prototype, "parameters", void 0);
FieldID = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], FieldID);
var ECPoint = class extends OctetString {};
var Curve = class Curve {
	a;
	b;
	seed;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.OctetString })], Curve.prototype, "a", void 0);
__decorate([AsnProp({ type: AsnPropTypes.OctetString })], Curve.prototype, "b", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	optional: true
})], Curve.prototype, "seed", void 0);
Curve = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], Curve);
var ECPVer;
(function(ECPVer) {
	ECPVer[ECPVer["ecpVer1"] = 1] = "ecpVer1";
})(ECPVer || (ECPVer = {}));
var SpecifiedECDomain = class SpecifiedECDomain {
	version = ECPVer.ecpVer1;
	fieldID;
	curve;
	base;
	order;
	cofactor;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SpecifiedECDomain.prototype, "version", void 0);
__decorate([AsnProp({ type: FieldID })], SpecifiedECDomain.prototype, "fieldID", void 0);
__decorate([AsnProp({ type: Curve })], SpecifiedECDomain.prototype, "curve", void 0);
__decorate([AsnProp({ type: ECPoint })], SpecifiedECDomain.prototype, "base", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], SpecifiedECDomain.prototype, "order", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	optional: true
})], SpecifiedECDomain.prototype, "cofactor", void 0);
SpecifiedECDomain = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], SpecifiedECDomain);
//#endregion
//#region node_modules/@peculiar/asn1-ecc/build/es2015/ec_parameters.js
var ECParameters = class ECParameters {
	namedCurve;
	implicitCurve;
	specifiedCurve;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], ECParameters.prototype, "namedCurve", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Null })], ECParameters.prototype, "implicitCurve", void 0);
__decorate([AsnProp({ type: SpecifiedECDomain })], ECParameters.prototype, "specifiedCurve", void 0);
ECParameters = __decorate([AsnType({ type: AsnTypeTypes.Choice })], ECParameters);
//#endregion
//#region node_modules/@peculiar/asn1-ecc/build/es2015/ec_private_key.js
var ECPrivateKey = class {
	version = 1;
	privateKey = new OctetString();
	parameters;
	publicKey;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], ECPrivateKey.prototype, "version", void 0);
__decorate([AsnProp({ type: OctetString })], ECPrivateKey.prototype, "privateKey", void 0);
__decorate([AsnProp({
	type: ECParameters,
	context: 0,
	optional: true
})], ECPrivateKey.prototype, "parameters", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	context: 1,
	optional: true
})], ECPrivateKey.prototype, "publicKey", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-ecc/build/es2015/ec_signature_value.js
var ECDSASigValue = class {
	r = /* @__PURE__ */ new ArrayBuffer(0);
	s = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], ECDSASigValue.prototype, "r", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], ECDSASigValue.prototype, "s", void 0);
//#endregion
export { ecdsaWithSHA384 as a, id_ecdsaWithSHA1 as c, id_ecdsaWithSHA384 as d, id_ecdsaWithSHA512 as f, id_secp521r1 as h, ecdsaWithSHA256 as i, id_ecdsaWithSHA224 as l, id_secp384r1 as m, ECParameters as n, ecdsaWithSHA512 as o, id_secp256r1 as p, ecdsaWithSHA1 as r, id_ecPublicKey as s, ECDSASigValue as t, id_ecdsaWithSHA256 as u };
