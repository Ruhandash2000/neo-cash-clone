import { h as AsnTypeTypes, i as AsnArray, m as AsnPropTypes, o as AsnProp, s as AsnType } from "./@peculiar/asn1-android+[...].mjs";
import { at as DirectoryString, f as AlgorithmIdentifier, l as Extensions, r as EncryptedPrivateKeyInfo$1, u as Time } from "./@peculiar/asn1-asym-key+[...].mjs";
import { a as ContentInfo, c as id_at, l as SignerInfo, u as Attribute } from "./@peculiar/asn1-cms+[...].mjs";
import { t as PFX } from "./@peculiar/asn1-pfx+[...].mjs";
import { __decorate } from "tslib";
//#region node_modules/@peculiar/asn1-pkcs9/build/es2015/index.js
var ExtensionRequest_1;
var ExtendedCertificateAttributes_1;
var SMIMECapabilities_1;
var id_pkcs9 = "1.2.840.113549.1.9";
`${id_pkcs9}`;
var id_pkcs9_oc = `${id_pkcs9}.24`;
var id_pkcs9_at = `${id_pkcs9}.25`;
var id_pkcs9_sx = `${id_pkcs9}.26`;
var id_pkcs9_mr = `${id_pkcs9}.27`;
`${id_pkcs9_oc}`;
`${id_pkcs9_oc}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
var id_pkcs9_at_challengePassword = `${id_pkcs9}.7`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
var id_pkcs9_at_extensionRequest = `${id_pkcs9}.14`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9_at}`;
`${id_pkcs9_at}`;
`${id_pkcs9_at}`;
`${id_pkcs9_at}`;
`${id_pkcs9_at}`;
var id_ietf_at = "1.3.6.1.5.5.7.9";
`${id_ietf_at}`;
`${id_ietf_at}`;
`${id_ietf_at}`;
`${id_ietf_at}`;
`${id_ietf_at}`;
`${id_pkcs9_sx}`;
`${id_pkcs9_sx}`;
`${id_pkcs9_mr}`;
`${id_pkcs9_mr}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_pkcs9}`;
`${id_at}`;
var PKCS9String = class PKCS9String extends DirectoryString {
	ia5String;
	constructor(params = {}) {
		super(params);
	}
	toString() {
		({}).toString();
		return this.ia5String || super.toString();
	}
};
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], PKCS9String.prototype, "ia5String", void 0);
PKCS9String = __decorate([AsnType({ type: AsnTypeTypes.Choice })], PKCS9String);
var Pkcs7PDU = class Pkcs7PDU extends ContentInfo {};
Pkcs7PDU = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], Pkcs7PDU);
var UserPKCS12 = class UserPKCS12 extends PFX {};
UserPKCS12 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], UserPKCS12);
var EncryptedPrivateKeyInfo = class EncryptedPrivateKeyInfo extends EncryptedPrivateKeyInfo$1 {};
EncryptedPrivateKeyInfo = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], EncryptedPrivateKeyInfo);
var EmailAddress = class EmailAddress {
	value;
	constructor(value = "") {
		this.value = value;
	}
	toString() {
		return this.value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.IA5String })], EmailAddress.prototype, "value", void 0);
EmailAddress = __decorate([AsnType({ type: AsnTypeTypes.Choice })], EmailAddress);
var UnstructuredName = class UnstructuredName extends PKCS9String {};
UnstructuredName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], UnstructuredName);
var UnstructuredAddress = class UnstructuredAddress extends DirectoryString {};
UnstructuredAddress = __decorate([AsnType({ type: AsnTypeTypes.Choice })], UnstructuredAddress);
var DateOfBirth = class DateOfBirth {
	value;
	constructor(value = /* @__PURE__ */ new Date()) {
		this.value = value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.GeneralizedTime })], DateOfBirth.prototype, "value", void 0);
DateOfBirth = __decorate([AsnType({ type: AsnTypeTypes.Choice })], DateOfBirth);
var PlaceOfBirth = class PlaceOfBirth extends DirectoryString {};
PlaceOfBirth = __decorate([AsnType({ type: AsnTypeTypes.Choice })], PlaceOfBirth);
var Gender = class Gender {
	value;
	constructor(value = "M") {
		this.value = value;
	}
	toString() {
		return this.value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.PrintableString })], Gender.prototype, "value", void 0);
Gender = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Gender);
var CountryOfCitizenship = class CountryOfCitizenship {
	value;
	constructor(value = "") {
		this.value = value;
	}
	toString() {
		return this.value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.PrintableString })], CountryOfCitizenship.prototype, "value", void 0);
CountryOfCitizenship = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CountryOfCitizenship);
var CountryOfResidence = class CountryOfResidence extends CountryOfCitizenship {};
CountryOfResidence = __decorate([AsnType({ type: AsnTypeTypes.Choice })], CountryOfResidence);
var Pseudonym = class Pseudonym extends DirectoryString {};
Pseudonym = __decorate([AsnType({ type: AsnTypeTypes.Choice })], Pseudonym);
var ContentType = class ContentType {
	value;
	constructor(value = "") {
		this.value = value;
	}
	toString() {
		return this.value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.ObjectIdentifier })], ContentType.prototype, "value", void 0);
ContentType = __decorate([AsnType({ type: AsnTypeTypes.Choice })], ContentType);
var SigningTime = class SigningTime extends Time {};
SigningTime = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SigningTime);
var SequenceNumber = class SequenceNumber {
	value;
	constructor(value = 0) {
		this.value = value;
	}
	toString() {
		return this.value.toString();
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], SequenceNumber.prototype, "value", void 0);
SequenceNumber = __decorate([AsnType({ type: AsnTypeTypes.Choice })], SequenceNumber);
var CounterSignature = class CounterSignature extends SignerInfo {};
CounterSignature = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], CounterSignature);
var ChallengePassword = class ChallengePassword extends DirectoryString {};
ChallengePassword = __decorate([AsnType({ type: AsnTypeTypes.Choice })], ChallengePassword);
var ExtensionRequest = ExtensionRequest_1 = class ExtensionRequest extends Extensions {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, ExtensionRequest_1.prototype);
	}
};
ExtensionRequest = ExtensionRequest_1 = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], ExtensionRequest);
var ExtendedCertificateAttributes = ExtendedCertificateAttributes_1 = class ExtendedCertificateAttributes extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, ExtendedCertificateAttributes_1.prototype);
	}
};
ExtendedCertificateAttributes = ExtendedCertificateAttributes_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: Attribute
})], ExtendedCertificateAttributes);
var FriendlyName = class FriendlyName {
	value;
	constructor(value = "") {
		this.value = value;
	}
	toString() {
		return this.value;
	}
};
__decorate([AsnProp({ type: AsnPropTypes.BmpString })], FriendlyName.prototype, "value", void 0);
FriendlyName = __decorate([AsnType({ type: AsnTypeTypes.Choice })], FriendlyName);
var SMIMECapability = class SMIMECapability extends AlgorithmIdentifier {};
SMIMECapability = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], SMIMECapability);
var SMIMECapabilities = SMIMECapabilities_1 = class SMIMECapabilities extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, SMIMECapabilities_1.prototype);
	}
};
SMIMECapabilities = SMIMECapabilities_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: SMIMECapability
})], SMIMECapabilities);
//#endregion
export { id_pkcs9_at_challengePassword as n, id_pkcs9_at_extensionRequest as r, ChallengePassword as t };
