import { _ as toUint8Array, f as OctetString, g as encode, h as AsnTypeTypes, i as AsnArray, l as AsnIntegerArrayBufferConverter, m as AsnPropTypes, o as AsnProp, p as BitString, s as AsnType, u as AsnOctetStringConverter } from "./asn1-android+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/utils/build/esm/bytes/equal.js
function equal(a, b, options = {}) {
	const left = toUint8Array(a);
	const right = toUint8Array(b);
	if (!options.constantTime && left.byteLength !== right.byteLength) return false;
	const length = Math.max(left.byteLength, right.byteLength);
	let diff = left.byteLength ^ right.byteLength;
	for (let i = 0; i < length; i++) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
	return diff === 0;
}
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/ip_converter.js
var IpConverter = class {
	static isIPv4(ip) {
		return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
	}
	static parseIPv4(ip) {
		const parts = ip.split(".");
		if (parts.length !== 4) throw new Error("Invalid IPv4 address");
		return parts.map((part) => {
			const num = parseInt(part, 10);
			if (isNaN(num) || num < 0 || num > 255) throw new Error("Invalid IPv4 address part");
			return num;
		});
	}
	static parseIPv6(ip) {
		const parts = this.expandIPv6(ip).split(":");
		if (parts.length !== 8) throw new Error("Invalid IPv6 address");
		return parts.reduce((bytes, part) => {
			const num = parseInt(part, 16);
			if (isNaN(num) || num < 0 || num > 65535) throw new Error("Invalid IPv6 address part");
			bytes.push(num >> 8 & 255);
			bytes.push(num & 255);
			return bytes;
		}, []);
	}
	static expandIPv6(ip) {
		if (!ip.includes("::")) return ip;
		const parts = ip.split("::");
		if (parts.length > 2) throw new Error("Invalid IPv6 address");
		const left = parts[0] ? parts[0].split(":") : [];
		const right = parts[1] ? parts[1].split(":") : [];
		const missing = 8 - (left.length + right.length);
		if (missing < 0) throw new Error("Invalid IPv6 address");
		return [
			...left,
			...Array(missing).fill("0"),
			...right
		].join(":");
	}
	static formatIPv6(bytes) {
		const parts = [];
		for (let i = 0; i < 16; i += 2) parts.push((bytes[i] << 8 | bytes[i + 1]).toString(16));
		return this.compressIPv6(parts.join(":"));
	}
	static compressIPv6(ip) {
		const parts = ip.split(":");
		let longestZeroStart = -1;
		let longestZeroLength = 0;
		let currentZeroStart = -1;
		let currentZeroLength = 0;
		for (let i = 0; i < parts.length; i++) if (parts[i] === "0") {
			if (currentZeroStart === -1) currentZeroStart = i;
			currentZeroLength++;
		} else {
			if (currentZeroLength > longestZeroLength) {
				longestZeroStart = currentZeroStart;
				longestZeroLength = currentZeroLength;
			}
			currentZeroStart = -1;
			currentZeroLength = 0;
		}
		if (currentZeroLength > longestZeroLength) {
			longestZeroStart = currentZeroStart;
			longestZeroLength = currentZeroLength;
		}
		if (longestZeroLength > 1) return `${parts.slice(0, longestZeroStart).join(":")}::${parts.slice(longestZeroStart + longestZeroLength).join(":")}`;
		return ip;
	}
	static parseCIDR(text) {
		const [addr, prefixStr] = text.split("/");
		const prefix = parseInt(prefixStr, 10);
		if (this.isIPv4(addr)) {
			if (prefix < 0 || prefix > 32) throw new Error("Invalid IPv4 prefix length");
			return [this.parseIPv4(addr), prefix];
		} else {
			if (prefix < 0 || prefix > 128) throw new Error("Invalid IPv6 prefix length");
			return [this.parseIPv6(addr), prefix];
		}
	}
	static decodeIP(value) {
		if (value.length === 64 && parseInt(value, 16) === 0) return "::/0";
		if (value.length !== 16) return value;
		const mask = parseInt(value.slice(8), 16).toString(2).split("").reduce((a, k) => a + +k, 0);
		let ip = value.slice(0, 8).replace(/(.{2})/g, (match) => `${parseInt(match, 16)}.`);
		ip = ip.slice(0, -1);
		return `${ip}/${mask}`;
	}
	static toString(buf) {
		const uint8 = new Uint8Array(buf);
		if (uint8.length === 4) return Array.from(uint8).join(".");
		if (uint8.length === 16) return this.formatIPv6(uint8);
		if (uint8.length === 8 || uint8.length === 32) {
			const half = uint8.length / 2;
			const addrBytes = uint8.slice(0, half);
			const maskBytes = uint8.slice(half);
			if (uint8.every((byte) => byte === 0)) return uint8.length === 8 ? "0.0.0.0/0" : "::/0";
			const prefixLen = maskBytes.reduce((a, b) => a + (b.toString(2).match(/1/g) || []).length, 0);
			if (uint8.length === 8) return `${Array.from(addrBytes).join(".")}/${prefixLen}`;
			else return `${this.formatIPv6(addrBytes)}/${prefixLen}`;
		}
		return this.decodeIP(encode(buf));
	}
	static fromString(text) {
		if (text.includes("/")) {
			const [addr, prefix] = this.parseCIDR(text);
			const maskBytes = new Uint8Array(addr.length);
			let bitsLeft = prefix;
			for (let i = 0; i < maskBytes.length; i++) if (bitsLeft >= 8) {
				maskBytes[i] = 255;
				bitsLeft -= 8;
			} else if (bitsLeft > 0) {
				maskBytes[i] = 255 << 8 - bitsLeft;
				bitsLeft = 0;
			}
			const out = new Uint8Array(addr.length * 2);
			out.set(addr, 0);
			out.set(maskBytes, addr.length);
			return out.buffer;
		}
		const bytes = this.isIPv4(text) ? this.parseIPv4(text) : this.parseIPv6(text);
		return new Uint8Array(bytes).buffer;
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/name.js
var RelativeDistinguishedName_1;
var RDNSequence_1;
var Name_1;
var DirectoryString = class DirectoryString {
	teletexString;
	printableString;
	universalString;
	utf8String;
	bmpString;
	constructor(params = {}) {
		Object.assign(this, params);
	}
	toString() {
		return this.bmpString || this.printableString || this.teletexString || this.universalString || this.utf8String || "";
	}
};
__decorate([AsnProp({ type: AsnPropTypes.TeletexString })], DirectoryString.prototype, "teletexString", void 0);
__decorate([AsnProp({ type: AsnPropTypes.PrintableString })], DirectoryString.prototype, "printableString", void 0);
__decorate([AsnProp({ type: AsnPropTypes.UniversalString })], DirectoryString.prototype, "universalString", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Utf8String })], DirectoryString.prototype, "utf8String", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BmpString })], DirectoryString.prototype, "bmpString", void 0);
DirectoryString = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DirectoryString);
var AttributeValue = class AttributeValue extends DirectoryString {
	ia5String;
	anyValue;
	constructor(params = {}) {
		super(params);
		Object.assign(this, params);
	}
	toString() {
		return this.ia5String || (this.anyValue ? encode(this.anyValue) : super.toString());
	}
};
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], AttributeValue.prototype, "ia5String", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], AttributeValue.prototype, "anyValue", void 0);
AttributeValue = __decorate([AsnType({ type: AsnTypeTypes.Choice })], AttributeValue);
var AttributeTypeAndValue = class {
	type = "";
	value = new AttributeValue();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], AttributeTypeAndValue.prototype, "type", void 0);
__decorate([AsnProp({ type: AttributeValue })], AttributeTypeAndValue.prototype, "value", void 0);
var RelativeDistinguishedName = RelativeDistinguishedName_1 = class RelativeDistinguishedName extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, RelativeDistinguishedName_1.prototype);
	}
};
RelativeDistinguishedName = RelativeDistinguishedName_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: AttributeTypeAndValue
})], RelativeDistinguishedName);
var RDNSequence = RDNSequence_1 = class RDNSequence extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, RDNSequence_1.prototype);
	}
};
RDNSequence = RDNSequence_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: RelativeDistinguishedName
})], RDNSequence);
var Name = Name_1 = class Name extends RDNSequence {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, Name_1.prototype);
	}
};
Name = Name_1 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], Name);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/general_name.js
var AsnIpConverter = {
	fromASN: (value) => IpConverter.toString(AsnOctetStringConverter.fromASN(value)),
	toASN: (value) => AsnOctetStringConverter.toASN(IpConverter.fromString(value))
};
var OtherName = class {
	typeId = "";
	value = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], OtherName.prototype, "typeId", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 0
})], OtherName.prototype, "value", void 0);
var EDIPartyName = class {
	nameAssigner;
	partyName = new DirectoryString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: DirectoryString,
	optional: true,
	context: 0,
	implicit: true
})], EDIPartyName.prototype, "nameAssigner", void 0);
__decorate([AsnProp({
	type: DirectoryString,
	context: 1,
	implicit: true
})], EDIPartyName.prototype, "partyName", void 0);
var GeneralName = class GeneralName {
	otherName;
	rfc822Name;
	dNSName;
	x400Address;
	directoryName;
	ediPartyName;
	uniformResourceIdentifier;
	iPAddress;
	registeredID;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: OtherName,
	context: 0,
	implicit: true
})], GeneralName.prototype, "otherName", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.IA5String,
	context: 1,
	implicit: true
})], GeneralName.prototype, "rfc822Name", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.IA5String,
	context: 2,
	implicit: true
})], GeneralName.prototype, "dNSName", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	context: 3,
	implicit: true
})], GeneralName.prototype, "x400Address", void 0);
__decorate([AsnProp({
	type: Name,
	context: 4,
	implicit: false
})], GeneralName.prototype, "directoryName", void 0);
__decorate([AsnProp({
	type: EDIPartyName,
	context: 5
})], GeneralName.prototype, "ediPartyName", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.IA5String,
	context: 6,
	implicit: true
})], GeneralName.prototype, "uniformResourceIdentifier", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.OctetString,
	context: 7,
	implicit: true,
	converter: AsnIpConverter
})], GeneralName.prototype, "iPAddress", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.ObjectIdentifier,
	context: 8,
	implicit: true
})], GeneralName.prototype, "registeredID", void 0);
GeneralName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], GeneralName);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/object_identifiers.js
var id_pkix = "1.3.6.1.5.5.7";
var id_pe = `${id_pkix}.1`;
var id_qt = `${id_pkix}.2`;
var id_kp = `${id_pkix}.3`;
var id_ad = `${id_pkix}.48`;
`${id_qt}`;
`${id_qt}`;
var id_ad_ocsp = `${id_ad}.1`;
var id_ad_caIssuers = `${id_ad}.2`;
var id_ad_timeStamping = `${id_ad}.3`;
var id_ad_caRepository = `${id_ad}.5`;
var id_ce = "2.5.29";
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/authority_information_access.js
var AuthorityInfoAccessSyntax_1;
var id_pe_authorityInfoAccess = `${id_pe}.1`;
var AccessDescription = class {
	accessMethod = "";
	accessLocation = new GeneralName();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], AccessDescription.prototype, "accessMethod", void 0);
__decorate([AsnProp({ type: GeneralName })], AccessDescription.prototype, "accessLocation", void 0);
var AuthorityInfoAccessSyntax = AuthorityInfoAccessSyntax_1 = class AuthorityInfoAccessSyntax extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, AuthorityInfoAccessSyntax_1.prototype);
	}
};
AuthorityInfoAccessSyntax = AuthorityInfoAccessSyntax_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: AccessDescription
})], AuthorityInfoAccessSyntax);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/authority_key_identifier.js
var id_ce_authorityKeyIdentifier = `${id_ce}.35`;
var KeyIdentifier = class extends OctetString {};
var AuthorityKeyIdentifier = class {
	keyIdentifier;
	authorityCertIssuer;
	authorityCertSerialNumber;
	constructor(params = {}) {
		if (params) Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: KeyIdentifier,
	context: 0,
	optional: true,
	implicit: true
})], AuthorityKeyIdentifier.prototype, "keyIdentifier", void 0);
__decorate([AsnProp({
	type: GeneralName,
	context: 1,
	optional: true,
	implicit: true,
	repeated: "sequence"
})], AuthorityKeyIdentifier.prototype, "authorityCertIssuer", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 2,
	optional: true,
	implicit: true,
	converter: AsnIntegerArrayBufferConverter
})], AuthorityKeyIdentifier.prototype, "authorityCertSerialNumber", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/basic_constraints.js
var id_ce_basicConstraints = `${id_ce}.19`;
var BasicConstraints = class {
	cA = false;
	pathLenConstraint;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	defaultValue: false
})], BasicConstraints.prototype, "cA", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	optional: true
})], BasicConstraints.prototype, "pathLenConstraint", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/general_names.js
var GeneralNames_1;
var GeneralNames = GeneralNames_1 = class GeneralNames extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, GeneralNames_1.prototype);
	}
};
GeneralNames = GeneralNames_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: GeneralName
})], GeneralNames);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/certificate_issuer.js
var CertificateIssuer_1;
`${id_ce}`;
var CertificateIssuer = CertificateIssuer_1 = class CertificateIssuer extends GeneralNames {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CertificateIssuer_1.prototype);
	}
};
CertificateIssuer = CertificateIssuer_1 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], CertificateIssuer);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/certificate_policies.js
var CertificatePolicies_1;
var id_ce_certificatePolicies = `${id_ce}.32`;
`${id_ce_certificatePolicies}`;
var DisplayText = class DisplayText {
	ia5String;
	visibleString;
	bmpString;
	utf8String;
	constructor(params = {}) {
		Object.assign(this, params);
	}
	toString() {
		return this.ia5String || this.visibleString || this.bmpString || this.utf8String || "";
	}
};
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], DisplayText.prototype, "ia5String", void 0);
__decorate([AsnProp({ type: AsnPropTypes.VisibleString })], DisplayText.prototype, "visibleString", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BmpString })], DisplayText.prototype, "bmpString", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Utf8String })], DisplayText.prototype, "utf8String", void 0);
DisplayText = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DisplayText);
var NoticeReference = class {
	organization = new DisplayText();
	noticeNumbers = [];
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: DisplayText })], NoticeReference.prototype, "organization", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	repeated: "sequence"
})], NoticeReference.prototype, "noticeNumbers", void 0);
var UserNotice = class {
	noticeRef;
	explicitText;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: NoticeReference,
	optional: true
})], UserNotice.prototype, "noticeRef", void 0);
__decorate([AsnProp({
	type: DisplayText,
	optional: true
})], UserNotice.prototype, "explicitText", void 0);
var Qualifier = class Qualifier {
	cPSuri;
	userNotice;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], Qualifier.prototype, "cPSuri", void 0);
__decorate([AsnProp({ type: UserNotice })], Qualifier.prototype, "userNotice", void 0);
Qualifier = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Qualifier);
var PolicyQualifierInfo = class {
	policyQualifierId = "";
	qualifier = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], PolicyQualifierInfo.prototype, "policyQualifierId", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Any })], PolicyQualifierInfo.prototype, "qualifier", void 0);
var PolicyInformation = class {
	policyIdentifier = "";
	policyQualifiers;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], PolicyInformation.prototype, "policyIdentifier", void 0);
__decorate([AsnProp({
	type: PolicyQualifierInfo,
	repeated: "sequence",
	optional: true
})], PolicyInformation.prototype, "policyQualifiers", void 0);
var CertificatePolicies = CertificatePolicies_1 = class CertificatePolicies extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CertificatePolicies_1.prototype);
	}
};
CertificatePolicies = CertificatePolicies_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: PolicyInformation
})], CertificatePolicies);
`${id_ce}`;
var CRLNumber = class CRLNumber {
	value;
	constructor(value = 0) {
		this.value = value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], CRLNumber.prototype, "value", void 0);
CRLNumber = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CRLNumber);
`${id_ce}`;
var BaseCRLNumber = class BaseCRLNumber extends CRLNumber {};
BaseCRLNumber = __decorate([AsnType({ type: AsnTypeTypes.Choice })], BaseCRLNumber);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_distribution_points.js
var CRLDistributionPoints_1;
var id_ce_cRLDistributionPoints = `${id_ce}.31`;
var ReasonFlags;
(function(ReasonFlags) {
	ReasonFlags[ReasonFlags["unused"] = 1] = "unused";
	ReasonFlags[ReasonFlags["keyCompromise"] = 2] = "keyCompromise";
	ReasonFlags[ReasonFlags["cACompromise"] = 4] = "cACompromise";
	ReasonFlags[ReasonFlags["affiliationChanged"] = 8] = "affiliationChanged";
	ReasonFlags[ReasonFlags["superseded"] = 16] = "superseded";
	ReasonFlags[ReasonFlags["cessationOfOperation"] = 32] = "cessationOfOperation";
	ReasonFlags[ReasonFlags["certificateHold"] = 64] = "certificateHold";
	ReasonFlags[ReasonFlags["privilegeWithdrawn"] = 128] = "privilegeWithdrawn";
	ReasonFlags[ReasonFlags["aACompromise"] = 256] = "aACompromise";
})(ReasonFlags || (ReasonFlags = {}));
var Reason = class extends BitString {
	toJSON() {
		const res = [];
		const flags = this.toNumber();
		if (flags & ReasonFlags.aACompromise) res.push("aACompromise");
		if (flags & ReasonFlags.affiliationChanged) res.push("affiliationChanged");
		if (flags & ReasonFlags.cACompromise) res.push("cACompromise");
		if (flags & ReasonFlags.certificateHold) res.push("certificateHold");
		if (flags & ReasonFlags.cessationOfOperation) res.push("cessationOfOperation");
		if (flags & ReasonFlags.keyCompromise) res.push("keyCompromise");
		if (flags & ReasonFlags.privilegeWithdrawn) res.push("privilegeWithdrawn");
		if (flags & ReasonFlags.superseded) res.push("superseded");
		if (flags & ReasonFlags.unused) res.push("unused");
		return res;
	}
	toString() {
		return `[${this.toJSON().join(", ")}]`;
	}
};
var DistributionPointName = class DistributionPointName {
	fullName;
	nameRelativeToCRLIssuer;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralName,
	context: 0,
	repeated: "sequence",
	implicit: true
})], DistributionPointName.prototype, "fullName", void 0);
__decorate([AsnProp({
	type: RelativeDistinguishedName,
	context: 1,
	implicit: true
})], DistributionPointName.prototype, "nameRelativeToCRLIssuer", void 0);
DistributionPointName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DistributionPointName);
var DistributionPoint = class {
	distributionPoint;
	reasons;
	cRLIssuer;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: DistributionPointName,
	context: 0,
	optional: true
})], DistributionPoint.prototype, "distributionPoint", void 0);
__decorate([AsnProp({
	type: Reason,
	context: 1,
	optional: true,
	implicit: true
})], DistributionPoint.prototype, "reasons", void 0);
__decorate([AsnProp({
	type: GeneralName,
	context: 2,
	optional: true,
	repeated: "sequence",
	implicit: true
})], DistributionPoint.prototype, "cRLIssuer", void 0);
var CRLDistributionPoints = CRLDistributionPoints_1 = class CRLDistributionPoints extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, CRLDistributionPoints_1.prototype);
	}
};
CRLDistributionPoints = CRLDistributionPoints_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: DistributionPoint
})], CRLDistributionPoints);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_freshest.js
var FreshestCRL_1;
`${id_ce}`;
var FreshestCRL = FreshestCRL_1 = class FreshestCRL extends CRLDistributionPoints {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, FreshestCRL_1.prototype);
	}
};
FreshestCRL = FreshestCRL_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: DistributionPoint
})], FreshestCRL);
`${id_ce}`;
var IssuingDistributionPoint = class IssuingDistributionPoint {
	static ONLY = false;
	distributionPoint;
	onlyContainsUserCerts = IssuingDistributionPoint.ONLY;
	onlyContainsCACerts = IssuingDistributionPoint.ONLY;
	onlySomeReasons;
	indirectCRL = IssuingDistributionPoint.ONLY;
	onlyContainsAttributeCerts = IssuingDistributionPoint.ONLY;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: DistributionPointName,
	context: 0,
	optional: true
})], IssuingDistributionPoint.prototype, "distributionPoint", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	context: 1,
	defaultValue: IssuingDistributionPoint.ONLY,
	implicit: true
})], IssuingDistributionPoint.prototype, "onlyContainsUserCerts", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	context: 2,
	defaultValue: IssuingDistributionPoint.ONLY,
	implicit: true
})], IssuingDistributionPoint.prototype, "onlyContainsCACerts", void 0);
__decorate([AsnProp({
	type: Reason,
	context: 3,
	optional: true,
	implicit: true
})], IssuingDistributionPoint.prototype, "onlySomeReasons", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	context: 4,
	defaultValue: IssuingDistributionPoint.ONLY,
	implicit: true
})], IssuingDistributionPoint.prototype, "indirectCRL", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	context: 5,
	defaultValue: IssuingDistributionPoint.ONLY,
	implicit: true
})], IssuingDistributionPoint.prototype, "onlyContainsAttributeCerts", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/crl_reason.js
var id_ce_cRLReasons = `${id_ce}.21`;
var CRLReasons;
(function(CRLReasons) {
	CRLReasons[CRLReasons["unspecified"] = 0] = "unspecified";
	CRLReasons[CRLReasons["keyCompromise"] = 1] = "keyCompromise";
	CRLReasons[CRLReasons["cACompromise"] = 2] = "cACompromise";
	CRLReasons[CRLReasons["affiliationChanged"] = 3] = "affiliationChanged";
	CRLReasons[CRLReasons["superseded"] = 4] = "superseded";
	CRLReasons[CRLReasons["cessationOfOperation"] = 5] = "cessationOfOperation";
	CRLReasons[CRLReasons["certificateHold"] = 6] = "certificateHold";
	CRLReasons[CRLReasons["removeFromCRL"] = 8] = "removeFromCRL";
	CRLReasons[CRLReasons["privilegeWithdrawn"] = 9] = "privilegeWithdrawn";
	CRLReasons[CRLReasons["aACompromise"] = 10] = "aACompromise";
})(CRLReasons || (CRLReasons = {}));
var CRLReason = class CRLReason {
	reason = CRLReasons.unspecified;
	constructor(reason = CRLReasons.unspecified) {
		this.reason = reason;
	}
	toJSON() {
		return CRLReasons[this.reason];
	}
	toString() {
		return this.toJSON();
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], CRLReason.prototype, "reason", void 0);
CRLReason = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CRLReason);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/extended_key_usage.js
var ExtendedKeyUsage_1;
var id_ce_extKeyUsage = `${id_ce}.37`;
var ExtendedKeyUsage = ExtendedKeyUsage_1 = class ExtendedKeyUsage extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, ExtendedKeyUsage_1.prototype);
	}
};
ExtendedKeyUsage = ExtendedKeyUsage_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: AsnPropTypes.ObjectIdentifier
})], ExtendedKeyUsage);
`${id_ce_extKeyUsage}`;
var id_kp_serverAuth = `${id_kp}.1`;
var id_kp_clientAuth = `${id_kp}.2`;
var id_kp_codeSigning = `${id_kp}.3`;
var id_kp_emailProtection = `${id_kp}.4`;
var id_kp_timeStamping = `${id_kp}.8`;
var id_kp_OCSPSigning = `${id_kp}.9`;
`${id_ce}`;
var InhibitAnyPolicy = class InhibitAnyPolicy {
	value;
	constructor(value = /* @__PURE__ */ new ArrayBuffer(0)) {
		this.value = value;
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], InhibitAnyPolicy.prototype, "value", void 0);
InhibitAnyPolicy = __decorate([AsnType({ type: AsnTypeTypes.Choice })], InhibitAnyPolicy);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/invalidity_date.js
var id_ce_invalidityDate = `${id_ce}.24`;
var InvalidityDate = class InvalidityDate {
	value = /* @__PURE__ */ new Date();
	constructor(value) {
		if (value) this.value = value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.GeneralizedTime })], InvalidityDate.prototype, "value", void 0);
InvalidityDate = __decorate([AsnType({ type: AsnTypeTypes.Choice })], InvalidityDate);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/issuer_alternative_name.js
var IssueAlternativeName_1;
var id_ce_issuerAltName = `${id_ce}.18`;
var IssueAlternativeName = IssueAlternativeName_1 = class IssueAlternativeName extends GeneralNames {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, IssueAlternativeName_1.prototype);
	}
};
IssueAlternativeName = IssueAlternativeName_1 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], IssueAlternativeName);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/key_usage.js
var id_ce_keyUsage = `${id_ce}.15`;
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
var KeyUsage = class extends BitString {
	toJSON() {
		const flag = this.toNumber();
		const res = [];
		if (flag & KeyUsageFlags.cRLSign) res.push("crlSign");
		if (flag & KeyUsageFlags.dataEncipherment) res.push("dataEncipherment");
		if (flag & KeyUsageFlags.decipherOnly) res.push("decipherOnly");
		if (flag & KeyUsageFlags.digitalSignature) res.push("digitalSignature");
		if (flag & KeyUsageFlags.encipherOnly) res.push("encipherOnly");
		if (flag & KeyUsageFlags.keyAgreement) res.push("keyAgreement");
		if (flag & KeyUsageFlags.keyCertSign) res.push("keyCertSign");
		if (flag & KeyUsageFlags.keyEncipherment) res.push("keyEncipherment");
		if (flag & KeyUsageFlags.nonRepudiation) res.push("nonRepudiation");
		return res;
	}
	toString() {
		return `[${this.toJSON().join(", ")}]`;
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/name_constraints.js
var GeneralSubtrees_1;
`${id_ce}`;
var GeneralSubtree = class {
	base = new GeneralName();
	minimum = 0;
	maximum;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: GeneralName })], GeneralSubtree.prototype, "base", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 0,
	defaultValue: 0,
	implicit: true
})], GeneralSubtree.prototype, "minimum", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 1,
	optional: true,
	implicit: true
})], GeneralSubtree.prototype, "maximum", void 0);
var GeneralSubtrees = GeneralSubtrees_1 = class GeneralSubtrees extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, GeneralSubtrees_1.prototype);
	}
};
GeneralSubtrees = GeneralSubtrees_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: GeneralSubtree
})], GeneralSubtrees);
var NameConstraints = class {
	permittedSubtrees;
	excludedSubtrees;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: GeneralSubtrees,
	context: 0,
	optional: true,
	implicit: true
})], NameConstraints.prototype, "permittedSubtrees", void 0);
__decorate([AsnProp({
	type: GeneralSubtrees,
	context: 1,
	optional: true,
	implicit: true
})], NameConstraints.prototype, "excludedSubtrees", void 0);
`${id_ce}`;
var PolicyConstraints = class {
	requireExplicitPolicy;
	inhibitPolicyMapping;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 0,
	implicit: true,
	optional: true,
	converter: AsnIntegerArrayBufferConverter
})], PolicyConstraints.prototype, "requireExplicitPolicy", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 1,
	implicit: true,
	optional: true,
	converter: AsnIntegerArrayBufferConverter
})], PolicyConstraints.prototype, "inhibitPolicyMapping", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/policy_mappings.js
var PolicyMappings_1;
`${id_ce}`;
var PolicyMapping = class {
	issuerDomainPolicy = "";
	subjectDomainPolicy = "";
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], PolicyMapping.prototype, "issuerDomainPolicy", void 0);
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], PolicyMapping.prototype, "subjectDomainPolicy", void 0);
var PolicyMappings = PolicyMappings_1 = class PolicyMappings extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, PolicyMappings_1.prototype);
	}
};
PolicyMappings = PolicyMappings_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: PolicyMapping
})], PolicyMappings);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_alternative_name.js
var SubjectAlternativeName_1;
var id_ce_subjectAltName = `${id_ce}.17`;
var SubjectAlternativeName = SubjectAlternativeName_1 = class SubjectAlternativeName extends GeneralNames {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, SubjectAlternativeName_1.prototype);
	}
};
SubjectAlternativeName = SubjectAlternativeName_1 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], SubjectAlternativeName);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/attribute.js
var Attribute = class {
	type = "";
	values = [];
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], Attribute.prototype, "type", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	repeated: "set"
})], Attribute.prototype, "values", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_directory_attributes.js
var SubjectDirectoryAttributes_1;
`${id_ce}`;
var SubjectDirectoryAttributes = SubjectDirectoryAttributes_1 = class SubjectDirectoryAttributes extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, SubjectDirectoryAttributes_1.prototype);
	}
};
SubjectDirectoryAttributes = SubjectDirectoryAttributes_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: Attribute
})], SubjectDirectoryAttributes);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_key_identifier.js
var id_ce_subjectKeyIdentifier = `${id_ce}.14`;
var SubjectKeyIdentifier = class extends KeyIdentifier {};
`${id_ce}`;
var PrivateKeyUsagePeriod = class {
	notBefore;
	notAfter;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.GeneralizedTime,
	context: 0,
	implicit: true,
	optional: true
})], PrivateKeyUsagePeriod.prototype, "notBefore", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.GeneralizedTime,
	context: 1,
	implicit: true,
	optional: true
})], PrivateKeyUsagePeriod.prototype, "notAfter", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/entrust_version_info.js
var EntrustInfoFlags;
(function(EntrustInfoFlags) {
	EntrustInfoFlags[EntrustInfoFlags["keyUpdateAllowed"] = 1] = "keyUpdateAllowed";
	EntrustInfoFlags[EntrustInfoFlags["newExtensions"] = 2] = "newExtensions";
	EntrustInfoFlags[EntrustInfoFlags["pKIXCertificate"] = 4] = "pKIXCertificate";
})(EntrustInfoFlags || (EntrustInfoFlags = {}));
var EntrustInfo = class extends BitString {
	toJSON() {
		const res = [];
		const flags = this.toNumber();
		if (flags & EntrustInfoFlags.pKIXCertificate) res.push("pKIXCertificate");
		if (flags & EntrustInfoFlags.newExtensions) res.push("newExtensions");
		if (flags & EntrustInfoFlags.keyUpdateAllowed) res.push("keyUpdateAllowed");
		return res;
	}
	toString() {
		return `[${this.toJSON().join(", ")}]`;
	}
};
var EntrustVersionInfo = class {
	entrustVers = "";
	entrustInfoFlags = new EntrustInfo();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.GeneralString })], EntrustVersionInfo.prototype, "entrustVers", void 0);
__decorate([AsnProp({ type: EntrustInfo })], EntrustVersionInfo.prototype, "entrustInfoFlags", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extensions/subject_info_access.js
var SubjectInfoAccessSyntax_1;
`${id_pe}`;
var SubjectInfoAccessSyntax = SubjectInfoAccessSyntax_1 = class SubjectInfoAccessSyntax extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, SubjectInfoAccessSyntax_1.prototype);
	}
};
SubjectInfoAccessSyntax = SubjectInfoAccessSyntax_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: AccessDescription
})], SubjectInfoAccessSyntax);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/algorithm_identifier.js
var AlgorithmIdentifier = class AlgorithmIdentifier {
	algorithm = "";
	parameters;
	constructor(params = {}) {
		Object.assign(this, params);
	}
	isEqual(data) {
		return data instanceof AlgorithmIdentifier && data.algorithm == this.algorithm && (data.parameters && this.parameters && equal(data.parameters, this.parameters) || data.parameters === this.parameters);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], AlgorithmIdentifier.prototype, "algorithm", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Any,
	optional: true
})], AlgorithmIdentifier.prototype, "parameters", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/subject_public_key_info.js
var SubjectPublicKeyInfo = class {
	algorithm = new AlgorithmIdentifier();
	subjectPublicKey = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AlgorithmIdentifier })], SubjectPublicKeyInfo.prototype, "algorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], SubjectPublicKeyInfo.prototype, "subjectPublicKey", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/time.js
var Time = class Time {
	utcTime;
	generalTime;
	constructor(time) {
		if (time) if (typeof time === "string" || typeof time === "number" || time instanceof Date) {
			const date = new Date(time);
			date.setMilliseconds(0);
			if (date.getUTCFullYear() > 2049) this.generalTime = date;
			else this.utcTime = date;
		} else Object.assign(this, time);
	}
	getTime() {
		const time = this.utcTime || this.generalTime;
		if (!time) throw new Error("Cannot get time from CHOICE object");
		return time;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.UTCTime })], Time.prototype, "utcTime", void 0);
__decorate([AsnProp({ type: AsnPropTypes.GeneralizedTime })], Time.prototype, "generalTime", void 0);
Time = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Time);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/validity.js
var Validity = class {
	notBefore = new Time(/* @__PURE__ */ new Date());
	notAfter = new Time(/* @__PURE__ */ new Date());
	constructor(params) {
		if (params) {
			this.notBefore = new Time(params.notBefore);
			this.notAfter = new Time(params.notAfter);
		}
	}
};
__decorate([AsnProp({ type: Time })], Validity.prototype, "notBefore", void 0);
__decorate([AsnProp({ type: Time })], Validity.prototype, "notAfter", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/extension.js
var Extensions_1;
var Extension = class Extension {
	static CRITICAL = false;
	extnID = "";
	critical = Extension.CRITICAL;
	extnValue = new OctetString();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], Extension.prototype, "extnID", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Boolean,
	defaultValue: Extension.CRITICAL
})], Extension.prototype, "critical", void 0);
__decorate([AsnProp({ type: OctetString })], Extension.prototype, "extnValue", void 0);
var Extensions = Extensions_1 = class Extensions extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, Extensions_1.prototype);
	}
};
Extensions = Extensions_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: Extension
})], Extensions);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/types.js
var Version$2;
(function(Version) {
	Version[Version["v1"] = 0] = "v1";
	Version[Version["v2"] = 1] = "v2";
	Version[Version["v3"] = 2] = "v3";
})(Version$2 || (Version$2 = {}));
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/tbs_certificate.js
var TBSCertificate = class {
	version = Version$2.v1;
	serialNumber = /* @__PURE__ */ new ArrayBuffer(0);
	signature = new AlgorithmIdentifier();
	issuer = new Name();
	validity = new Validity();
	subject = new Name();
	subjectPublicKeyInfo = new SubjectPublicKeyInfo();
	issuerUniqueID;
	subjectUniqueID;
	extensions;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	context: 0,
	defaultValue: Version$2.v1
})], TBSCertificate.prototype, "version", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], TBSCertificate.prototype, "serialNumber", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], TBSCertificate.prototype, "signature", void 0);
__decorate([AsnProp({ type: Name })], TBSCertificate.prototype, "issuer", void 0);
__decorate([AsnProp({ type: Validity })], TBSCertificate.prototype, "validity", void 0);
__decorate([AsnProp({ type: Name })], TBSCertificate.prototype, "subject", void 0);
__decorate([AsnProp({ type: SubjectPublicKeyInfo })], TBSCertificate.prototype, "subjectPublicKeyInfo", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	context: 1,
	implicit: true,
	optional: true
})], TBSCertificate.prototype, "issuerUniqueID", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	context: 2,
	implicit: true,
	optional: true
})], TBSCertificate.prototype, "subjectUniqueID", void 0);
__decorate([AsnProp({
	type: Extensions,
	context: 3,
	optional: true
})], TBSCertificate.prototype, "extensions", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/certificate.js
var Certificate = class {
	tbsCertificate = new TBSCertificate();
	tbsCertificateRaw;
	signatureAlgorithm = new AlgorithmIdentifier();
	signatureValue = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: TBSCertificate,
	raw: true
})], Certificate.prototype, "tbsCertificate", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], Certificate.prototype, "signatureAlgorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], Certificate.prototype, "signatureValue", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/tbs_cert_list.js
var RevokedCertificate = class {
	userCertificate = /* @__PURE__ */ new ArrayBuffer(0);
	revocationDate = new Time();
	crlEntryExtensions;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	converter: AsnIntegerArrayBufferConverter
})], RevokedCertificate.prototype, "userCertificate", void 0);
__decorate([AsnProp({ type: Time })], RevokedCertificate.prototype, "revocationDate", void 0);
__decorate([AsnProp({
	type: Extension,
	optional: true,
	repeated: "sequence"
})], RevokedCertificate.prototype, "crlEntryExtensions", void 0);
var TBSCertList = class {
	version;
	signature = new AlgorithmIdentifier();
	issuer = new Name();
	thisUpdate = new Time();
	nextUpdate;
	revokedCertificates;
	crlExtensions;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AsnPropTypes.Integer,
	optional: true
})], TBSCertList.prototype, "version", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], TBSCertList.prototype, "signature", void 0);
__decorate([AsnProp({ type: Name })], TBSCertList.prototype, "issuer", void 0);
__decorate([AsnProp({ type: Time })], TBSCertList.prototype, "thisUpdate", void 0);
__decorate([AsnProp({
	type: Time,
	optional: true
})], TBSCertList.prototype, "nextUpdate", void 0);
__decorate([AsnProp({
	type: RevokedCertificate,
	repeated: "sequence",
	optional: true
})], TBSCertList.prototype, "revokedCertificates", void 0);
__decorate([AsnProp({
	type: Extension,
	optional: true,
	context: 0,
	repeated: "sequence"
})], TBSCertList.prototype, "crlExtensions", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-x509/build/es2015/certificate_list.js
var CertificateList = class {
	tbsCertList = new TBSCertList();
	tbsCertListRaw;
	signatureAlgorithm = new AlgorithmIdentifier();
	signature = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: TBSCertList,
	raw: true
})], CertificateList.prototype, "tbsCertList", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], CertificateList.prototype, "signatureAlgorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.BitString })], CertificateList.prototype, "signature", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-pkcs8/build/es2015/encrypted_private_key_info.js
var EncryptedData = class extends OctetString {};
var EncryptedPrivateKeyInfo = class {
	encryptionAlgorithm = new AlgorithmIdentifier();
	encryptedData = new EncryptedData();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AlgorithmIdentifier })], EncryptedPrivateKeyInfo.prototype, "encryptionAlgorithm", void 0);
__decorate([AsnProp({ type: EncryptedData })], EncryptedPrivateKeyInfo.prototype, "encryptedData", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-pkcs8/build/es2015/private_key_info.js
var Attributes_1;
var Version$1;
(function(Version) {
	Version[Version["v1"] = 0] = "v1";
})(Version$1 || (Version$1 = {}));
var PrivateKey = class extends OctetString {};
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
var PrivateKeyInfo$1 = class {
	version = Version$1.v1;
	privateKeyAlgorithm = new AlgorithmIdentifier();
	privateKey = new PrivateKey();
	attributes;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], PrivateKeyInfo$1.prototype, "version", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], PrivateKeyInfo$1.prototype, "privateKeyAlgorithm", void 0);
__decorate([AsnProp({ type: PrivateKey })], PrivateKeyInfo$1.prototype, "privateKey", void 0);
__decorate([AsnProp({
	type: Attributes,
	implicit: true,
	context: 0,
	optional: true
})], PrivateKeyInfo$1.prototype, "attributes", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-asym-key/build/es2015/index.js
var AsymmetricKeyPackage_1;
var Version;
(function(Version) {
	Version[Version["v1"] = 0] = "v1";
	Version[Version["v2"] = 1] = "v2";
})(Version || (Version = {}));
var PrivateKeyAlgorithmIdentifier = class PrivateKeyAlgorithmIdentifier extends AlgorithmIdentifier {};
PrivateKeyAlgorithmIdentifier = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], PrivateKeyAlgorithmIdentifier);
var OneAsymmetricKey = class OneAsymmetricKey {
	version = Version.v1;
	privateKeyAlgorithm = new AlgorithmIdentifier();
	privateKey = /* @__PURE__ */ new ArrayBuffer(0);
	attributes;
	publicKey;
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], OneAsymmetricKey.prototype, "version", void 0);
__decorate([AsnProp({ type: AlgorithmIdentifier })], OneAsymmetricKey.prototype, "privateKeyAlgorithm", void 0);
__decorate([AsnProp({ type: AsnPropTypes.OctetString })], OneAsymmetricKey.prototype, "privateKey", void 0);
__decorate([AsnProp({
	type: Attributes,
	context: 0,
	implicit: true,
	optional: true
})], OneAsymmetricKey.prototype, "attributes", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.BitString,
	context: 1,
	implicit: true,
	optional: true
})], OneAsymmetricKey.prototype, "publicKey", void 0);
OneAsymmetricKey = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], OneAsymmetricKey);
var PrivateKeyInfo = class PrivateKeyInfo extends OneAsymmetricKey {};
PrivateKeyInfo = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], PrivateKeyInfo);
var AsymmetricKeyPackage = AsymmetricKeyPackage_1 = class AsymmetricKeyPackage extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, AsymmetricKeyPackage_1.prototype);
	}
};
AsymmetricKeyPackage = AsymmetricKeyPackage_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: OneAsymmetricKey
})], AsymmetricKeyPackage);
//#endregion
export { id_ce as $, id_kp_timeStamping as A, GeneralNames as B, ExtendedKeyUsage as C, id_kp_codeSigning as D, id_kp_clientAuth as E, DistributionPointName as F, id_ce_authorityKeyIdentifier as G, id_ce_basicConstraints as H, id_ce_cRLDistributionPoints as I, id_pe_authorityInfoAccess as J, AccessDescription as K, CertificatePolicies as L, id_ce_cRLReasons as M, CRLDistributionPoints as N, id_kp_emailProtection as O, DistributionPoint as P, id_ad_timeStamping as Q, PolicyInformation as R, id_ce_invalidityDate as S, id_kp_OCSPSigning as T, AuthorityKeyIdentifier as U, BasicConstraints as V, KeyIdentifier as W, id_ad_caRepository as X, id_ad_caIssuers as Y, id_ad_ocsp as Z, id_ce_subjectAltName as _, RevokedCertificate as a, DirectoryString as at, id_ce_issuerAltName as b, Extension as c, SubjectPublicKeyInfo as d, id_pe as et, AlgorithmIdentifier as f, SubjectAlternativeName as g, Attribute as h, CertificateList as i, AttributeTypeAndValue as it, CRLReason as j, id_kp_serverAuth as k, Extensions as l, id_ce_subjectKeyIdentifier as m, PrivateKeyInfo$1 as n, GeneralName as nt, Certificate as o, Name as ot, SubjectKeyIdentifier as p, AuthorityInfoAccessSyntax as q, EncryptedPrivateKeyInfo as r, OtherName as rt, Version$2 as s, RelativeDistinguishedName as st, OneAsymmetricKey as t, id_pkix as tt, Time as u, KeyUsage as v, id_ce_extKeyUsage as w, InvalidityDate as x, id_ce_keyUsage as y, id_ce_certificatePolicies as z };
