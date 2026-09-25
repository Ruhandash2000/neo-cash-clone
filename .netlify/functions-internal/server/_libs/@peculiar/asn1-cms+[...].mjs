import { c as AsnConstructedOctetStringConverter, f as OctetString, h as AsnTypeTypes, i as AsnArray, l as AsnIntegerArrayBufferConverter, m as AsnPropTypes, o as AsnProp, p as BitString, s as AsnType } from "./asn1-android+[...].mjs";
import { $ as id_ce, B as GeneralNames, et as id_pe, f as AlgorithmIdentifier, h as Attribute$1, l as Extensions, nt as GeneralName, o as Certificate, ot as Name, p as SubjectKeyIdentifier, tt as id_pkix, u as Time } from "./asn1-asym-key+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/asn1-cms/build/es2015/issuer_and_serial_number.js
var IssuerAndSerialNumber = class {
	issuer = new Name();
	serialNumber = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: Name })], IssuerAndSerialNumber.prototype, "issuer", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], IssuerAndSerialNumber.prototype, "serialNumber", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/signer_identifier.js
var SignerIdentifier = class SignerIdentifier {
	subjectKeyIdentifier;
	issuerAndSerialNumber;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: SubjectKeyIdentifier,
	context: 0,
	implicit: true
})], SignerIdentifier.prototype, "subjectKeyIdentifier", void 0);
__decorate([AsnProp({ type: IssuerAndSerialNumber })], SignerIdentifier.prototype, "issuerAndSerialNumber", void 0);
SignerIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SignerIdentifier);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/types.js
var CMSVersion;
(function(CMSVersion) {
	CMSVersion[CMSVersion["v0"] = 0] = "v0";
	CMSVersion[CMSVersion["v1"] = 1] = "v1";
	CMSVersion[CMSVersion["v2"] = 2] = "v2";
	CMSVersion[CMSVersion["v3"] = 3] = "v3";
	CMSVersion[CMSVersion["v4"] = 4] = "v4";
	CMSVersion[CMSVersion["v5"] = 5] = "v5";
})(CMSVersion || (CMSVersion = {}));
var DigestAlgorithmIdentifier = class DigestAlgorithmIdentifier extends AlgorithmIdentifier {};
DigestAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], DigestAlgorithmIdentifier);
var SignatureAlgorithmIdentifier = class SignatureAlgorithmIdentifier extends AlgorithmIdentifier {};
SignatureAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], SignatureAlgorithmIdentifier);
var KeyEncryptionAlgorithmIdentifier = class KeyEncryptionAlgorithmIdentifier extends AlgorithmIdentifier {};
KeyEncryptionAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], KeyEncryptionAlgorithmIdentifier);
var ContentEncryptionAlgorithmIdentifier = class ContentEncryptionAlgorithmIdentifier extends AlgorithmIdentifier {};
ContentEncryptionAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], ContentEncryptionAlgorithmIdentifier);
var MessageAuthenticationCodeAlgorithm = class MessageAuthenticationCodeAlgorithm extends AlgorithmIdentifier {};
MessageAuthenticationCodeAlgorithm = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], MessageAuthenticationCodeAlgorithm);
var KeyDerivationAlgorithmIdentifier = class KeyDerivationAlgorithmIdentifier extends AlgorithmIdentifier {};
KeyDerivationAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], KeyDerivationAlgorithmIdentifier);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/attribute.js
var Attribute = class {
	attrType = "";
	attrValues = [];
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], Attribute.prototype, "attrType", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	repeated: "set"
})], Attribute.prototype, "attrValues", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/signer_info.js
var SignerInfos_1;
var SignerInfo = class {
	version = CMSVersion.v0;
	sid = new SignerIdentifier();
	digestAlgorithm = new DigestAlgorithmIdentifier();
	signedAttrs;
	signedAttrsRaw;
	signatureAlgorithm = new SignatureAlgorithmIdentifier();
	signature = new OctetString();
	unsignedAttrs;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SignerInfo.prototype, "version", void 0);
__decorate([AsnProp({ type: SignerIdentifier })], SignerInfo.prototype, "sid", void 0);
__decorate([AsnProp({ type: DigestAlgorithmIdentifier })], SignerInfo.prototype, "digestAlgorithm", void 0);
__decorate([AsnProp({
	type: Attribute,
	repeated: "set",
	context: 0,
	implicit: true,
	optional: true,
	raw: true
})], SignerInfo.prototype, "signedAttrs", void 0);
__decorate([AsnProp({ type: SignatureAlgorithmIdentifier })], SignerInfo.prototype, "signatureAlgorithm", void 0);
__decorate([AsnProp({ type: OctetString })], SignerInfo.prototype, "signature", void 0);
__decorate([AsnProp({
	type: Attribute,
	repeated: "set",
	context: 1,
	implicit: true,
	optional: true
})], SignerInfo.prototype, "unsignedAttrs", void 0);
var SignerInfos = SignerInfos_1 = class SignerInfos extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, SignerInfos_1.prototype);
	}
};
SignerInfos = SignerInfos_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: SignerInfo
})], SignerInfos);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/attributes/counter_signature.js
var CounterSignature = class CounterSignature extends SignerInfo {};
CounterSignature = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], CounterSignature);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/attributes/signing_time.js
var SigningTime = class SigningTime extends Time {};
SigningTime = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SigningTime);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/aa_clear_attrs.js
var ACClearAttrs = class {
	acIssuer = new GeneralName();
	acSerial = 0;
	attrs = [];
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: GeneralName })], ACClearAttrs.prototype, "acIssuer", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], ACClearAttrs.prototype, "acSerial", void 0);
__decorate([AsnProp({
	type: Attribute$1,
	repeated: "sequence"
})], ACClearAttrs.prototype, "attrs", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_spec.js
var AttrSpec_1;
var AttrSpec = AttrSpec_1 = class AttrSpec extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, AttrSpec_1.prototype);
	}
};
AttrSpec = AttrSpec_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: AsnPropTypes.ObjectIdentifier
})], AttrSpec);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/aa_controls.js
var AAControls = class {
	pathLenConstraint;
	permittedAttrs;
	excludedAttrs;
	permitUnSpecified = true;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	optional: true
})], AAControls.prototype, "pathLenConstraint", void 0);
__decorate([AsnProp({
	type: AttrSpec,
	implicit: true,
	context: 0,
	optional: true
})], AAControls.prototype, "permittedAttrs", void 0);
__decorate([AsnProp({
	type: AttrSpec,
	implicit: true,
	context: 1,
	optional: true
})], AAControls.prototype, "excludedAttrs", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	defaultValue: true
})], AAControls.prototype, "permitUnSpecified", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/issuer_serial.js
var IssuerSerial = class {
	issuer = new GeneralNames();
	serial = /* @__PURE__ */ new ArrayBuffer(0);
	issuerUID = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: GeneralNames })], IssuerSerial.prototype, "issuer", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], IssuerSerial.prototype, "serial", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	optional: true
})], IssuerSerial.prototype, "issuerUID", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/object_digest_info.js
var DigestedObjectType;
(function(DigestedObjectType) {
	DigestedObjectType[DigestedObjectType["publicKey"] = 0] = "publicKey";
	DigestedObjectType[DigestedObjectType["publicKeyCert"] = 1] = "publicKeyCert";
	DigestedObjectType[DigestedObjectType["otherObjectTypes"] = 2] = "otherObjectTypes";
})(DigestedObjectType || (DigestedObjectType = {}));
var ObjectDigestInfo = class {
	digestedObjectType = DigestedObjectType.publicKey;
	otherObjectTypeID;
	digestAlgorithm = new AlgorithmIdentifier();
	objectDigest = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], ObjectDigestInfo.prototype, "digestedObjectType", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.ObjectIdentifier,
	optional: true
})], ObjectDigestInfo.prototype, "otherObjectTypeID", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], ObjectDigestInfo.prototype, "digestAlgorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], ObjectDigestInfo.prototype, "objectDigest", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/v2_form.js
var V2Form = class {
	issuerName;
	baseCertificateID;
	objectDigestInfo;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralNames,
	optional: true
})], V2Form.prototype, "issuerName", void 0);
__decorate([AsnProp({
	type: IssuerSerial,
	context: 0,
	implicit: true,
	optional: true
})], V2Form.prototype, "baseCertificateID", void 0);
__decorate([AsnProp({
	type: ObjectDigestInfo,
	context: 1,
	implicit: true,
	optional: true
})], V2Form.prototype, "objectDigestInfo", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_cert_issuer.js
var AttCertIssuer = class AttCertIssuer {
	v1Form;
	v2Form;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralName,
	repeated: "sequence"
})], AttCertIssuer.prototype, "v1Form", void 0);
__decorate([AsnProp({
	type: V2Form,
	context: 0,
	implicit: true
})], AttCertIssuer.prototype, "v2Form", void 0);
AttCertIssuer = __decorate([AsnType({ type: AsnTypeTypes.Choice })], AttCertIssuer);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/attr_cert_validity_period.js
var AttCertValidityPeriod = class {
	notBeforeTime = /* @__PURE__ */ new Date();
	notAfterTime = /* @__PURE__ */ new Date();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.GeneralizedTime })], AttCertValidityPeriod.prototype, "notBeforeTime", void 0);
__decorate([AsnProp({ type: AsnPropTypes.GeneralizedTime })], AttCertValidityPeriod.prototype, "notAfterTime", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/holder.js
var Holder = class {
	baseCertificateID;
	entityName;
	objectDigestInfo;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: IssuerSerial,
	implicit: true,
	context: 0,
	optional: true
})], Holder.prototype, "baseCertificateID", void 0);
__decorate([AsnProp({
	type: GeneralNames,
	implicit: true,
	context: 1,
	optional: true
})], Holder.prototype, "entityName", void 0);
__decorate([AsnProp({
	type: ObjectDigestInfo,
	implicit: true,
	context: 2,
	optional: true
})], Holder.prototype, "objectDigestInfo", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/attribute_certificate_info.js
var AttCertVersion;
(function(AttCertVersion) {
	AttCertVersion[AttCertVersion["v2"] = 1] = "v2";
})(AttCertVersion || (AttCertVersion = {}));
var AttributeCertificateInfo = class {
	version = AttCertVersion.v2;
	holder = new Holder();
	issuer = new AttCertIssuer();
	signature = new AlgorithmIdentifier();
	serialNumber = /* @__PURE__ */ new ArrayBuffer(0);
	attrCertValidityPeriod = new AttCertValidityPeriod();
	attributes = [];
	issuerUniqueID;
	extensions;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], AttributeCertificateInfo.prototype, "version", void 0);
__decorate([AsnProp({ type: Holder })], AttributeCertificateInfo.prototype, "holder", void 0);
__decorate([AsnProp({ type: AttCertIssuer })], AttributeCertificateInfo.prototype, "issuer", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], AttributeCertificateInfo.prototype, "signature", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], AttributeCertificateInfo.prototype, "serialNumber", void 0);
__decorate([AsnProp({ type: AttCertValidityPeriod })], AttributeCertificateInfo.prototype, "attrCertValidityPeriod", void 0);
__decorate([AsnProp({
	type: Attribute$1,
	repeated: "sequence"
})], AttributeCertificateInfo.prototype, "attributes", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	optional: true
})], AttributeCertificateInfo.prototype, "issuerUniqueID", void 0);
__decorate([AsnProp({
	type: Extensions,
	optional: true
})], AttributeCertificateInfo.prototype, "extensions", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/attribute_certificate.js
var AttributeCertificate = class {
	acinfo = new AttributeCertificateInfo();
	signatureAlgorithm = new AlgorithmIdentifier();
	signatureValue = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AttributeCertificateInfo })], AttributeCertificate.prototype, "acinfo", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], AttributeCertificate.prototype, "signatureAlgorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], AttributeCertificate.prototype, "signatureValue", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/class_list.js
var ClassListFlags;
(function(ClassListFlags) {
	ClassListFlags[ClassListFlags["unmarked"] = 1] = "unmarked";
	ClassListFlags[ClassListFlags["unclassified"] = 2] = "unclassified";
	ClassListFlags[ClassListFlags["restricted"] = 4] = "restricted";
	ClassListFlags[ClassListFlags["confidential"] = 8] = "confidential";
	ClassListFlags[ClassListFlags["secret"] = 16] = "secret";
	ClassListFlags[ClassListFlags["topSecret"] = 32] = "topSecret";
})(ClassListFlags || (ClassListFlags = {}));
var ClassList = class extends BitString {};
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/security_category.js
var SecurityCategory = class {
	type = "";
	value = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.ObjectIdentifier,
	implicit: true,
	context: 0
})], SecurityCategory.prototype, "type", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	implicit: true,
	context: 1
})], SecurityCategory.prototype, "value", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/clearance.js
var Clearance = class {
	policyId = "";
	classList = new ClassList(ClassListFlags.unclassified);
	securityCategories;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], Clearance.prototype, "policyId", void 0);
__decorate([AsnProp({
	type: ClassList,
	defaultValue: new ClassList(ClassListFlags.unclassified)
})], Clearance.prototype, "classList", void 0);
__decorate([AsnProp({
	type: SecurityCategory,
	repeated: "set"
})], Clearance.prototype, "securityCategories", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/ietf_attr_syntax.js
var IetfAttrSyntaxValueChoices = class {
	cotets;
	oid;
	string;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: OctetString })], IetfAttrSyntaxValueChoices.prototype, "cotets", void 0);
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], IetfAttrSyntaxValueChoices.prototype, "oid", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Utf8String })], IetfAttrSyntaxValueChoices.prototype, "string", void 0);
var IetfAttrSyntax = class {
	policyAuthority;
	values = [];
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralNames,
	implicit: true,
	context: 0,
	optional: true
})], IetfAttrSyntax.prototype, "policyAuthority", void 0);
__decorate([AsnProp({
	type: IetfAttrSyntaxValueChoices,
	repeated: "sequence"
})], IetfAttrSyntax.prototype, "values", void 0);
`${id_pe}`;
`${id_pe}`;
`${id_pe}`;
`${id_ce}`;
var id_aca = `${id_pkix}.10`;
`${id_aca}`;
`${id_aca}`;
`${id_aca}`;
`${id_aca}`;
`${id_aca}`;
var id_at = "2.5.4";
`${id_at}`;
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/target.js
var Targets_1;
var TargetCert = class {
	targetCertificate = new IssuerSerial();
	targetName;
	certDigestInfo;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: IssuerSerial })], TargetCert.prototype, "targetCertificate", void 0);
__decorate([AsnProp({
	type: GeneralName,
	optional: true
})], TargetCert.prototype, "targetName", void 0);
__decorate([AsnProp({
	type: ObjectDigestInfo,
	optional: true
})], TargetCert.prototype, "certDigestInfo", void 0);
var Target = class Target {
	targetName;
	targetGroup;
	targetCert;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralName,
	context: 0,
	implicit: true
})], Target.prototype, "targetName", void 0);
__decorate([AsnProp({
	type: GeneralName,
	context: 1,
	implicit: true
})], Target.prototype, "targetGroup", void 0);
__decorate([AsnProp({
	type: TargetCert,
	context: 2,
	implicit: true
})], Target.prototype, "targetCert", void 0);
Target = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Target);
var Targets = Targets_1 = class Targets extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, Targets_1.prototype);
	}
};
Targets = Targets_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: Target
})], Targets);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/proxy_info.js
var ProxyInfo_1;
var ProxyInfo = ProxyInfo_1 = class ProxyInfo extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, ProxyInfo_1.prototype);
	}
};
ProxyInfo = ProxyInfo_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: Targets
})], ProxyInfo);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/role_syntax.js
var RoleSyntax = class {
	roleAuthority;
	roleName;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralNames,
	implicit: true,
	context: 0,
	optional: true
})], RoleSyntax.prototype, "roleAuthority", void 0);
__decorate([AsnProp({
	type: GeneralName,
	implicit: true,
	context: 1
})], RoleSyntax.prototype, "roleName", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509-attr/build/es2015/svce_auth_info.js
var SvceAuthInfo = class {
	service = new GeneralName();
	ident = new GeneralName();
	authInfo;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: GeneralName })], SvceAuthInfo.prototype, "service", void 0);
__decorate([AsnProp({ type: GeneralName })], SvceAuthInfo.prototype, "ident", void 0);
__decorate([AsnProp({
	type: OctetString,
	optional: true
})], SvceAuthInfo.prototype, "authInfo", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/certificate_choices.js
var CertificateSet_1;
var OtherCertificateFormat = class {
	otherCertFormat = "";
	otherCert = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], OtherCertificateFormat.prototype, "otherCertFormat", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], OtherCertificateFormat.prototype, "otherCert", void 0);
var CertificateChoices = class CertificateChoices {
	certificate;
	v2AttrCert;
	other;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: Certificate })], CertificateChoices.prototype, "certificate", void 0);
__decorate([AsnProp({
	type: AttributeCertificate,
	context: 2,
	implicit: true
})], CertificateChoices.prototype, "v2AttrCert", void 0);
__decorate([AsnProp({
	type: OtherCertificateFormat,
	context: 3,
	implicit: true
})], CertificateChoices.prototype, "other", void 0);
CertificateChoices = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CertificateChoices);
var CertificateSet = CertificateSet_1 = class CertificateSet extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CertificateSet_1.prototype);
	}
};
CertificateSet = CertificateSet_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: CertificateChoices
})], CertificateSet);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/content_info.js
var ContentInfo = class {
	contentType = "";
	content = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], ContentInfo.prototype, "contentType", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 0
})], ContentInfo.prototype, "content", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/encapsulated_content_info.js
var EncapsulatedContent = class EncapsulatedContent {
	single;
	any;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: OctetString })], EncapsulatedContent.prototype, "single", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], EncapsulatedContent.prototype, "any", void 0);
EncapsulatedContent = __decorate([AsnType({ type: AsnTypeTypes.Choice })], EncapsulatedContent);
var EncapsulatedContentInfo = class {
	eContentType = "";
	eContent;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], EncapsulatedContentInfo.prototype, "eContentType", void 0);
__decorate([AsnProp({
	type: EncapsulatedContent,
	context: 0,
	optional: true
})], EncapsulatedContentInfo.prototype, "eContent", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/encrypted_content_info.js
var EncryptedContent = class EncryptedContent {
	value;
	constructedValue;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: OctetString,
	context: 0,
	implicit: true,
	optional: true
})], EncryptedContent.prototype, "value", void 0);
__decorate([AsnProp({
	type: OctetString,
	converter: AsnConstructedOctetStringConverter,
	context: 0,
	implicit: true,
	optional: true,
	repeated: "sequence"
})], EncryptedContent.prototype, "constructedValue", void 0);
EncryptedContent = __decorate([AsnType({ type: AsnTypeTypes.Choice })], EncryptedContent);
var EncryptedContentInfo = class {
	contentType = "";
	contentEncryptionAlgorithm = new ContentEncryptionAlgorithmIdentifier();
	encryptedContent;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], EncryptedContentInfo.prototype, "contentType", void 0);
__decorate([AsnProp({ type: ContentEncryptionAlgorithmIdentifier })], EncryptedContentInfo.prototype, "contentEncryptionAlgorithm", void 0);
__decorate([AsnProp({
	type: EncryptedContent,
	optional: true
})], EncryptedContentInfo.prototype, "encryptedContent", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/other_key_attribute.js
var OtherKeyAttribute = class {
	keyAttrId = "";
	keyAttr;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], OtherKeyAttribute.prototype, "keyAttrId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	optional: true
})], OtherKeyAttribute.prototype, "keyAttr", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/key_agree_recipient_info.js
var RecipientEncryptedKeys_1;
var RecipientKeyIdentifier = class {
	subjectKeyIdentifier = new SubjectKeyIdentifier();
	date;
	other;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: SubjectKeyIdentifier })], RecipientKeyIdentifier.prototype, "subjectKeyIdentifier", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.GeneralizedTime,
	optional: true
})], RecipientKeyIdentifier.prototype, "date", void 0);
__decorate([AsnProp({
	type: OtherKeyAttribute,
	optional: true
})], RecipientKeyIdentifier.prototype, "other", void 0);
var KeyAgreeRecipientIdentifier = class KeyAgreeRecipientIdentifier {
	rKeyId;
	issuerAndSerialNumber;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: RecipientKeyIdentifier,
	context: 0,
	implicit: true,
	optional: true
})], KeyAgreeRecipientIdentifier.prototype, "rKeyId", void 0);
__decorate([AsnProp({
	type: IssuerAndSerialNumber,
	optional: true
})], KeyAgreeRecipientIdentifier.prototype, "issuerAndSerialNumber", void 0);
KeyAgreeRecipientIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], KeyAgreeRecipientIdentifier);
var RecipientEncryptedKey = class {
	rid = new KeyAgreeRecipientIdentifier();
	encryptedKey = new OctetString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: KeyAgreeRecipientIdentifier })], RecipientEncryptedKey.prototype, "rid", void 0);
__decorate([AsnProp({ type: OctetString })], RecipientEncryptedKey.prototype, "encryptedKey", void 0);
var RecipientEncryptedKeys = RecipientEncryptedKeys_1 = class RecipientEncryptedKeys extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, RecipientEncryptedKeys_1.prototype);
	}
};
RecipientEncryptedKeys = RecipientEncryptedKeys_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: RecipientEncryptedKey
})], RecipientEncryptedKeys);
var OriginatorPublicKey = class {
	algorithm = new AlgorithmIdentifier();
	publicKey = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AlgorithmIdentifier })], OriginatorPublicKey.prototype, "algorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], OriginatorPublicKey.prototype, "publicKey", void 0);
var OriginatorIdentifierOrKey = class OriginatorIdentifierOrKey {
	subjectKeyIdentifier;
	originatorKey;
	issuerAndSerialNumber;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: SubjectKeyIdentifier,
	context: 0,
	implicit: true,
	optional: true
})], OriginatorIdentifierOrKey.prototype, "subjectKeyIdentifier", void 0);
__decorate([AsnProp({
	type: OriginatorPublicKey,
	context: 1,
	implicit: true,
	optional: true
})], OriginatorIdentifierOrKey.prototype, "originatorKey", void 0);
__decorate([AsnProp({
	type: IssuerAndSerialNumber,
	optional: true
})], OriginatorIdentifierOrKey.prototype, "issuerAndSerialNumber", void 0);
OriginatorIdentifierOrKey = __decorate([AsnType({ type: AsnTypeTypes.Choice })], OriginatorIdentifierOrKey);
var KeyAgreeRecipientInfo = class {
	version = CMSVersion.v3;
	originator = new OriginatorIdentifierOrKey();
	ukm;
	keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
	recipientEncryptedKeys = new RecipientEncryptedKeys();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KeyAgreeRecipientInfo.prototype, "version", void 0);
__decorate([AsnProp({
	type: OriginatorIdentifierOrKey,
	context: 0
})], KeyAgreeRecipientInfo.prototype, "originator", void 0);
__decorate([AsnProp({
	type: OctetString,
	context: 1,
	optional: true
})], KeyAgreeRecipientInfo.prototype, "ukm", void 0);
__decorate([AsnProp({ type: KeyEncryptionAlgorithmIdentifier })], KeyAgreeRecipientInfo.prototype, "keyEncryptionAlgorithm", void 0);
__decorate([AsnProp({ type: RecipientEncryptedKeys })], KeyAgreeRecipientInfo.prototype, "recipientEncryptedKeys", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/key_trans_recipient_info.js
var RecipientIdentifier = class RecipientIdentifier {
	subjectKeyIdentifier;
	issuerAndSerialNumber;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: SubjectKeyIdentifier,
	context: 0,
	implicit: true
})], RecipientIdentifier.prototype, "subjectKeyIdentifier", void 0);
__decorate([AsnProp({ type: IssuerAndSerialNumber })], RecipientIdentifier.prototype, "issuerAndSerialNumber", void 0);
RecipientIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], RecipientIdentifier);
var KeyTransRecipientInfo = class {
	version = CMSVersion.v0;
	rid = new RecipientIdentifier();
	keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
	encryptedKey = new OctetString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KeyTransRecipientInfo.prototype, "version", void 0);
__decorate([AsnProp({ type: RecipientIdentifier })], KeyTransRecipientInfo.prototype, "rid", void 0);
__decorate([AsnProp({ type: KeyEncryptionAlgorithmIdentifier })], KeyTransRecipientInfo.prototype, "keyEncryptionAlgorithm", void 0);
__decorate([AsnProp({ type: OctetString })], KeyTransRecipientInfo.prototype, "encryptedKey", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/kek_recipient_info.js
var KEKIdentifier = class {
	keyIdentifier = new OctetString();
	date;
	other;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: OctetString })], KEKIdentifier.prototype, "keyIdentifier", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.GeneralizedTime,
	optional: true
})], KEKIdentifier.prototype, "date", void 0);
__decorate([AsnProp({
	type: OtherKeyAttribute,
	optional: true
})], KEKIdentifier.prototype, "other", void 0);
var KEKRecipientInfo = class {
	version = CMSVersion.v4;
	kekid = new KEKIdentifier();
	keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
	encryptedKey = new OctetString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KEKRecipientInfo.prototype, "version", void 0);
__decorate([AsnProp({ type: KEKIdentifier })], KEKRecipientInfo.prototype, "kekid", void 0);
__decorate([AsnProp({ type: KeyEncryptionAlgorithmIdentifier })], KEKRecipientInfo.prototype, "keyEncryptionAlgorithm", void 0);
__decorate([AsnProp({ type: OctetString })], KEKRecipientInfo.prototype, "encryptedKey", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/password_recipient_info.js
var PasswordRecipientInfo = class {
	version = CMSVersion.v0;
	keyDerivationAlgorithm;
	keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();
	encryptedKey = new OctetString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], PasswordRecipientInfo.prototype, "version", void 0);
__decorate([AsnProp({
	type: KeyDerivationAlgorithmIdentifier,
	context: 0,
	optional: true
})], PasswordRecipientInfo.prototype, "keyDerivationAlgorithm", void 0);
__decorate([AsnProp({ type: KeyEncryptionAlgorithmIdentifier })], PasswordRecipientInfo.prototype, "keyEncryptionAlgorithm", void 0);
__decorate([AsnProp({ type: OctetString })], PasswordRecipientInfo.prototype, "encryptedKey", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/recipient_info.js
var OtherRecipientInfo = class {
	oriType = "";
	oriValue = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], OtherRecipientInfo.prototype, "oriType", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], OtherRecipientInfo.prototype, "oriValue", void 0);
var RecipientInfo = class RecipientInfo {
	ktri;
	kari;
	kekri;
	pwri;
	ori;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: KeyTransRecipientInfo,
	optional: true
})], RecipientInfo.prototype, "ktri", void 0);
__decorate([AsnProp({
	type: KeyAgreeRecipientInfo,
	context: 1,
	implicit: true,
	optional: true
})], RecipientInfo.prototype, "kari", void 0);
__decorate([AsnProp({
	type: KEKRecipientInfo,
	context: 2,
	implicit: true,
	optional: true
})], RecipientInfo.prototype, "kekri", void 0);
__decorate([AsnProp({
	type: PasswordRecipientInfo,
	context: 3,
	implicit: true,
	optional: true
})], RecipientInfo.prototype, "pwri", void 0);
__decorate([AsnProp({
	type: OtherRecipientInfo,
	context: 4,
	implicit: true,
	optional: true
})], RecipientInfo.prototype, "ori", void 0);
RecipientInfo = __decorate([AsnType({ type: AsnTypeTypes.Choice })], RecipientInfo);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/recipient_infos.js
var RecipientInfos_1;
var RecipientInfos = RecipientInfos_1 = class RecipientInfos extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, RecipientInfos_1.prototype);
	}
};
RecipientInfos = RecipientInfos_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: RecipientInfo
})], RecipientInfos);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/revocation_info_choice.js
var RevocationInfoChoices_1;
var id_ri = `${id_pkix}.16`;
`${id_ri}`;
`${id_ri}`;
var OtherRevocationInfoFormat = class {
	otherRevInfoFormat = "";
	otherRevInfo = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], OtherRevocationInfoFormat.prototype, "otherRevInfoFormat", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], OtherRevocationInfoFormat.prototype, "otherRevInfo", void 0);
var RevocationInfoChoice = class RevocationInfoChoice {
	other = new OtherRevocationInfoFormat();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: OtherRevocationInfoFormat,
	context: 1,
	implicit: true
})], RevocationInfoChoice.prototype, "other", void 0);
RevocationInfoChoice = __decorate([AsnType({ type: AsnTypeTypes.Choice })], RevocationInfoChoice);
var RevocationInfoChoices = RevocationInfoChoices_1 = class RevocationInfoChoices extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, RevocationInfoChoices_1.prototype);
	}
};
RevocationInfoChoices = RevocationInfoChoices_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: RevocationInfoChoice
})], RevocationInfoChoices);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/originator_info.js
var OriginatorInfo = class {
	certs;
	crls;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: CertificateSet,
	context: 0,
	implicit: true,
	optional: true
})], OriginatorInfo.prototype, "certs", void 0);
__decorate([AsnProp({
	type: RevocationInfoChoices,
	context: 1,
	implicit: true,
	optional: true
})], OriginatorInfo.prototype, "crls", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/enveloped_data.js
var UnprotectedAttributes_1;
var UnprotectedAttributes = UnprotectedAttributes_1 = class UnprotectedAttributes extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, UnprotectedAttributes_1.prototype);
	}
};
UnprotectedAttributes = UnprotectedAttributes_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: Attribute
})], UnprotectedAttributes);
var EnvelopedData = class {
	version = CMSVersion.v0;
	originatorInfo;
	recipientInfos = new RecipientInfos();
	encryptedContentInfo = new EncryptedContentInfo();
	unprotectedAttrs;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], EnvelopedData.prototype, "version", void 0);
__decorate([AsnProp({
	type: OriginatorInfo,
	context: 0,
	implicit: true,
	optional: true
})], EnvelopedData.prototype, "originatorInfo", void 0);
__decorate([AsnProp({ type: RecipientInfos })], EnvelopedData.prototype, "recipientInfos", void 0);
__decorate([AsnProp({ type: EncryptedContentInfo })], EnvelopedData.prototype, "encryptedContentInfo", void 0);
__decorate([AsnProp({
	type: UnprotectedAttributes,
	context: 1,
	implicit: true,
	optional: true
})], EnvelopedData.prototype, "unprotectedAttrs", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/object_identifiers.js
var id_data = "1.2.840.113549.1.7.1";
var id_signedData = "1.2.840.113549.1.7.2";
//#endregion
//#region node_modules/@peculiar/asn1-cms/build/es2015/signed_data.js
var DigestAlgorithmIdentifiers_1;
var DigestAlgorithmIdentifiers = DigestAlgorithmIdentifiers_1 = class DigestAlgorithmIdentifiers extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, DigestAlgorithmIdentifiers_1.prototype);
	}
};
DigestAlgorithmIdentifiers = DigestAlgorithmIdentifiers_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: DigestAlgorithmIdentifier
})], DigestAlgorithmIdentifiers);
var SignedData = class {
	version = CMSVersion.v0;
	digestAlgorithms = new DigestAlgorithmIdentifiers();
	encapContentInfo = new EncapsulatedContentInfo();
	certificates;
	crls;
	signerInfos = new SignerInfos();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SignedData.prototype, "version", void 0);
__decorate([AsnProp({ type: DigestAlgorithmIdentifiers })], SignedData.prototype, "digestAlgorithms", void 0);
__decorate([AsnProp({ type: EncapsulatedContentInfo })], SignedData.prototype, "encapContentInfo", void 0);
__decorate([AsnProp({
	type: CertificateSet,
	context: 0,
	implicit: true,
	optional: true
})], SignedData.prototype, "certificates", void 0);
__decorate([AsnProp({
	type: RevocationInfoChoices,
	context: 1,
	implicit: true,
	optional: true
})], SignedData.prototype, "crls", void 0);
__decorate([AsnProp({ type: SignerInfos })], SignedData.prototype, "signerInfos", void 0);
//#endregion
export { ContentInfo as a, id_at as c, CMSVersion as d, EncapsulatedContent as i, SignerInfo as l, id_data as n, CertificateChoices as o, id_signedData as r, CertificateSet as s, SignedData as t, Attribute as u };
