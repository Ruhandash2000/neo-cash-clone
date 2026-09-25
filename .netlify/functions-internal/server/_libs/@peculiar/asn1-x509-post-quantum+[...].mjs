import { h as AsnTypeTypes, i as AsnArray, m as AsnPropTypes, s as AsnType } from "./asn1-android+[...].mjs";
import { d as SubjectPublicKeyInfo, f as AlgorithmIdentifier, t as OneAsymmetricKey } from "./asn1-asym-key+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/asn1-x509-post-quantum/build/es2015/composite_signatures.js
var CompositeParams_1;
var CompositeSignatureValue_1;
var CompositeParams = CompositeParams_1 = class CompositeParams extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CompositeParams_1.prototype);
	}
};
CompositeParams = CompositeParams_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: AlgorithmIdentifier
})], CompositeParams);
var CompositeSignatureValue = CompositeSignatureValue_1 = class CompositeSignatureValue extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CompositeSignatureValue_1.prototype);
	}
};
CompositeSignatureValue = CompositeSignatureValue_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: AsnPropTypes.BitString
})], CompositeSignatureValue);
//#endregion
//#region node_modules/@peculiar/asn1-x509-post-quantum/build/es2015/composite_keys.js
var CompositePublicKey_1;
var CompositePrivateKey_1;
var CompositeAlgorithmIdentifier = class CompositeAlgorithmIdentifier extends AlgorithmIdentifier {};
CompositeAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], CompositeAlgorithmIdentifier);
var CompositePublicKey = CompositePublicKey_1 = class CompositePublicKey extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CompositePublicKey_1.prototype);
	}
};
CompositePublicKey = CompositePublicKey_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: SubjectPublicKeyInfo
})], CompositePublicKey);
var CompositePrivateKey = CompositePrivateKey_1 = class CompositePrivateKey extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CompositePrivateKey_1.prototype);
	}
};
CompositePrivateKey = CompositePrivateKey_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: OneAsymmetricKey
})], CompositePrivateKey);
//#endregion
//#region node_modules/@peculiar/asn1-x509-post-quantum/build/es2015/object_identifiers.js
var id_sigAlgs = "2.16.840.1.101.3.4.3";
var id_ml_dsa_44 = `${id_sigAlgs}.17`;
var id_ml_dsa_65 = `${id_sigAlgs}.18`;
var id_ml_dsa_87 = `${id_sigAlgs}.19`;
var id_slh_dsa_sha2_128s = `${id_sigAlgs}.20`;
var id_slh_dsa_sha2_128f = `${id_sigAlgs}.21`;
var id_slh_dsa_sha2_192s = `${id_sigAlgs}.22`;
var id_slh_dsa_sha2_192f = `${id_sigAlgs}.23`;
var id_slh_dsa_sha2_256s = `${id_sigAlgs}.24`;
var id_slh_dsa_sha2_256f = `${id_sigAlgs}.25`;
var id_slh_dsa_shake_128s = `${id_sigAlgs}.26`;
var id_slh_dsa_shake_128f = `${id_sigAlgs}.27`;
var id_slh_dsa_shake_192s = `${id_sigAlgs}.28`;
var id_slh_dsa_shake_192f = `${id_sigAlgs}.29`;
var id_slh_dsa_shake_256s = `${id_sigAlgs}.30`;
var id_slh_dsa_shake_256f = `${id_sigAlgs}.31`;
//#endregion
export { id_slh_dsa_sha2_128s as a, id_slh_dsa_sha2_256f as c, id_slh_dsa_shake_128s as d, id_slh_dsa_shake_192f as f, id_slh_dsa_shake_256s as h, id_slh_dsa_sha2_128f as i, id_slh_dsa_sha2_256s as l, id_slh_dsa_shake_256f as m, id_ml_dsa_65 as n, id_slh_dsa_sha2_192f as o, id_slh_dsa_shake_192s as p, id_ml_dsa_87 as r, id_slh_dsa_sha2_192s as s, id_ml_dsa_44 as t, id_slh_dsa_shake_128f as u };
