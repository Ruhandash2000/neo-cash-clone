import { h as AsnTypeTypes, i as AsnArray, m as AsnPropTypes, o as AsnProp, s as AsnType } from "./@peculiar/asn1-android+[...].mjs";
import { d as SubjectPublicKeyInfo, f as AlgorithmIdentifier, h as Attribute, ot as Name } from "./@peculiar/asn1-asym-key+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/asn1-csr/build/es2015/attributes.js
var Attributes_1;
var Attributes = Attributes_1 = class Attributes extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, Attributes_1.prototype);
	}
};
Attributes = Attributes_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: Attribute
})], Attributes);
//#endregion
//#region node_modules/@peculiar/asn1-csr/build/es2015/certification_request_info.js
var CertificationRequestInfo = class {
	version = 0;
	subject = new Name();
	subjectPKInfo = new SubjectPublicKeyInfo();
	attributes = new Attributes();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], CertificationRequestInfo.prototype, "version", void 0);
__decorate([AsnProp({ type: Name })], CertificationRequestInfo.prototype, "subject", void 0);
__decorate([AsnProp({ type: SubjectPublicKeyInfo })], CertificationRequestInfo.prototype, "subjectPKInfo", void 0);
__decorate([AsnProp({
	type: Attributes,
	implicit: true,
	context: 0,
	optional: true
})], CertificationRequestInfo.prototype, "attributes", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-csr/build/es2015/certification_request.js
var CertificationRequest = class {
	certificationRequestInfo = new CertificationRequestInfo();
	certificationRequestInfoRaw;
	signatureAlgorithm = new AlgorithmIdentifier();
	signature = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: CertificationRequestInfo,
	raw: true
})], CertificationRequest.prototype, "certificationRequestInfo", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], CertificationRequest.prototype, "signatureAlgorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], CertificationRequest.prototype, "signature", void 0);
//#endregion
export { CertificationRequest as t };
