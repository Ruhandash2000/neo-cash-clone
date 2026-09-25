import { n as __exportAll } from "../../_runtime.mjs";
import { __decorate } from "tslib";
//#region node_modules/pvtsutils/build/index.es.js
/*!
* MIT License
* 
* Copyright (c) 2017-2024 Peculiar Ventures, LLC
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
var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
var BufferSourceConverter = class BufferSourceConverter {
	static isArrayBuffer(data) {
		return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
	}
	static toArrayBuffer(data) {
		if (this.isArrayBuffer(data)) return data;
		if (data.byteLength === data.buffer.byteLength) return data.buffer;
		if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) return data.buffer;
		return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
	}
	static toUint8Array(data) {
		return this.toView(data, Uint8Array);
	}
	static toView(data, type) {
		if (data.constructor === type) return data;
		if (this.isArrayBuffer(data)) return new type(data);
		if (this.isArrayBufferView(data)) return new type(data.buffer, data.byteOffset, data.byteLength);
		throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
	}
	static isBufferSource(data) {
		return this.isArrayBufferView(data) || this.isArrayBuffer(data);
	}
	static isArrayBufferView(data) {
		return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
	}
	static isEqual(a, b) {
		const aView = BufferSourceConverter.toUint8Array(a);
		const bView = BufferSourceConverter.toUint8Array(b);
		if (aView.length !== bView.byteLength) return false;
		for (let i = 0; i < aView.length; i++) if (aView[i] !== bView[i]) return false;
		return true;
	}
	static concat(...args) {
		let buffers;
		if (Array.isArray(args[0]) && !(args[1] instanceof Function)) buffers = args[0];
		else if (Array.isArray(args[0]) && args[1] instanceof Function) buffers = args[0];
		else if (args[args.length - 1] instanceof Function) buffers = args.slice(0, args.length - 1);
		else buffers = args;
		let size = 0;
		for (const buffer of buffers) size += buffer.byteLength;
		const res = new Uint8Array(size);
		let offset = 0;
		for (const buffer of buffers) {
			const view = this.toUint8Array(buffer);
			res.set(view, offset);
			offset += view.length;
		}
		if (args[args.length - 1] instanceof Function) return this.toView(res, args[args.length - 1]);
		return res.buffer;
	}
};
var STRING_TYPE = "string";
var HEX_REGEX = /^[0-9a-f\s]+$/i;
var BASE64_REGEX$1 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
var BASE64URL_REGEX$1 = /^[a-zA-Z0-9-_]+$/;
var Utf8Converter = class {
	static fromString(text) {
		const s = unescape(encodeURIComponent(text));
		const uintArray = new Uint8Array(s.length);
		for (let i = 0; i < s.length; i++) uintArray[i] = s.charCodeAt(i);
		return uintArray.buffer;
	}
	static toString(buffer) {
		const buf = BufferSourceConverter.toUint8Array(buffer);
		let encodedString = "";
		for (let i = 0; i < buf.length; i++) encodedString += String.fromCharCode(buf[i]);
		return decodeURIComponent(escape(encodedString));
	}
};
var Utf16Converter = class {
	static toString(buffer, littleEndian = false) {
		const arrayBuffer = BufferSourceConverter.toArrayBuffer(buffer);
		const dataView = new DataView(arrayBuffer);
		let res = "";
		for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
			const code = dataView.getUint16(i, littleEndian);
			res += String.fromCharCode(code);
		}
		return res;
	}
	static fromString(text, littleEndian = false) {
		const res = /* @__PURE__ */ new ArrayBuffer(text.length * 2);
		const dataView = new DataView(res);
		for (let i = 0; i < text.length; i++) dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
		return res;
	}
};
var Convert = class Convert {
	static isHex(data) {
		return typeof data === STRING_TYPE && HEX_REGEX.test(data);
	}
	static isBase64(data) {
		return typeof data === STRING_TYPE && BASE64_REGEX$1.test(data);
	}
	static isBase64Url(data) {
		return typeof data === STRING_TYPE && BASE64URL_REGEX$1.test(data);
	}
	static ToString(buffer, enc = "utf8") {
		const buf = BufferSourceConverter.toUint8Array(buffer);
		switch (enc.toLowerCase()) {
			case "utf8": return this.ToUtf8String(buf);
			case "binary": return this.ToBinary(buf);
			case "hex": return this.ToHex(buf);
			case "base64": return this.ToBase64(buf);
			case "base64url": return this.ToBase64Url(buf);
			case "utf16le": return Utf16Converter.toString(buf, true);
			case "utf16":
			case "utf16be": return Utf16Converter.toString(buf);
			default: throw new Error(`Unknown type of encoding '${enc}'`);
		}
	}
	static FromString(str, enc = "utf8") {
		if (!str) return /* @__PURE__ */ new ArrayBuffer(0);
		switch (enc.toLowerCase()) {
			case "utf8": return this.FromUtf8String(str);
			case "binary": return this.FromBinary(str);
			case "hex": return this.FromHex(str);
			case "base64": return this.FromBase64(str);
			case "base64url": return this.FromBase64Url(str);
			case "utf16le": return Utf16Converter.fromString(str, true);
			case "utf16":
			case "utf16be": return Utf16Converter.fromString(str);
			default: throw new Error(`Unknown type of encoding '${enc}'`);
		}
	}
	static ToBase64(buffer) {
		const buf = BufferSourceConverter.toUint8Array(buffer);
		if (typeof btoa !== "undefined") {
			const binary = this.ToString(buf, "binary");
			return btoa(binary);
		} else return Buffer.from(buf).toString("base64");
	}
	static FromBase64(base64) {
		const formatted = this.formatString(base64);
		if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
		if (!Convert.isBase64(formatted)) throw new TypeError("Argument 'base64Text' is not Base64 encoded");
		if (typeof atob !== "undefined") return this.FromBinary(atob(formatted));
		else return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
	}
	static FromBase64Url(base64url) {
		const formatted = this.formatString(base64url);
		if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
		if (!Convert.isBase64Url(formatted)) throw new TypeError("Argument 'base64url' is not Base64Url encoded");
		return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
	}
	static ToBase64Url(data) {
		return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
	}
	static FromUtf8String(text, encoding = Convert.DEFAULT_UTF8_ENCODING) {
		switch (encoding) {
			case "ascii": return this.FromBinary(text);
			case "utf8": return Utf8Converter.fromString(text);
			case "utf16":
			case "utf16be": return Utf16Converter.fromString(text);
			case "utf16le":
			case "usc2": return Utf16Converter.fromString(text, true);
			default: throw new Error(`Unknown type of encoding '${encoding}'`);
		}
	}
	static ToUtf8String(buffer, encoding = Convert.DEFAULT_UTF8_ENCODING) {
		switch (encoding) {
			case "ascii": return this.ToBinary(buffer);
			case "utf8": return Utf8Converter.toString(buffer);
			case "utf16":
			case "utf16be": return Utf16Converter.toString(buffer);
			case "utf16le":
			case "usc2": return Utf16Converter.toString(buffer, true);
			default: throw new Error(`Unknown type of encoding '${encoding}'`);
		}
	}
	static FromBinary(text) {
		const stringLength = text.length;
		const resultView = new Uint8Array(stringLength);
		for (let i = 0; i < stringLength; i++) resultView[i] = text.charCodeAt(i);
		return resultView.buffer;
	}
	static ToBinary(buffer) {
		const buf = BufferSourceConverter.toUint8Array(buffer);
		let res = "";
		for (let i = 0; i < buf.length; i++) res += String.fromCharCode(buf[i]);
		return res;
	}
	static ToHex(buffer) {
		const buf = BufferSourceConverter.toUint8Array(buffer);
		let result = "";
		const len = buf.length;
		for (let i = 0; i < len; i++) {
			const byte = buf[i];
			if (byte < 16) result += "0";
			result += byte.toString(16);
		}
		return result;
	}
	static FromHex(hexString) {
		let formatted = this.formatString(hexString);
		if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
		if (!Convert.isHex(formatted)) throw new TypeError("Argument 'hexString' is not HEX encoded");
		if (formatted.length % 2) formatted = `0${formatted}`;
		const res = new Uint8Array(formatted.length / 2);
		for (let i = 0; i < formatted.length; i = i + 2) {
			const c = formatted.slice(i, i + 2);
			res[i / 2] = parseInt(c, 16);
		}
		return res.buffer;
	}
	static ToUtf16String(buffer, littleEndian = false) {
		return Utf16Converter.toString(buffer, littleEndian);
	}
	static FromUtf16String(text, littleEndian = false) {
		return Utf16Converter.fromString(text, littleEndian);
	}
	static Base64Padding(base64) {
		const padCount = 4 - base64.length % 4;
		if (padCount < 4) for (let i = 0; i < padCount; i++) base64 += "=";
		return base64;
	}
	static formatString(data) {
		return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
	}
};
Convert.DEFAULT_UTF8_ENCODING = "utf8";
function combine(...buf) {
	const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
	const res = new Uint8Array(totalByteLength);
	let currentPos = 0;
	buf.map((item) => new Uint8Array(item)).forEach((arr) => {
		for (const item2 of arr) res[currentPos++] = item2;
	});
	return res.buffer;
}
function isEqual(bytes1, bytes2) {
	if (!(bytes1 && bytes2)) return false;
	if (bytes1.byteLength !== bytes2.byteLength) return false;
	const b1 = new Uint8Array(bytes1);
	const b2 = new Uint8Array(bytes2);
	for (let i = 0; i < bytes1.byteLength; i++) if (b1[i] !== b2[i]) return false;
	return true;
}
//#endregion
//#region node_modules/pvutils/build/utils.es.js
/*!
Copyright (c) Peculiar Ventures, LLC
*/
function utilFromBase(inputBuffer, inputBase) {
	let result = 0;
	if (inputBuffer.length === 1) return inputBuffer[0];
	for (let i = inputBuffer.length - 1; i >= 0; i--) result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
	return result;
}
function utilToBase(value, base, reserved = -1) {
	const internalReserved = reserved;
	let internalValue = value;
	let result = 0;
	let biggest = Math.pow(2, base);
	for (let i = 1; i < 8; i++) {
		if (value < biggest) {
			let retBuf;
			if (internalReserved < 0) {
				retBuf = new ArrayBuffer(i);
				result = i;
			} else {
				if (internalReserved < i) return /* @__PURE__ */ new ArrayBuffer(0);
				retBuf = new ArrayBuffer(internalReserved);
				result = internalReserved;
			}
			const retView = new Uint8Array(retBuf);
			for (let j = i - 1; j >= 0; j--) {
				const basis = Math.pow(2, j * base);
				retView[result - j - 1] = Math.floor(internalValue / basis);
				internalValue -= retView[result - j - 1] * basis;
			}
			return retBuf;
		}
		biggest *= Math.pow(2, base);
	}
	return /* @__PURE__ */ new ArrayBuffer(0);
}
function utilConcatView(...views) {
	let outputLength = 0;
	let prevLength = 0;
	for (const view of views) outputLength += view.length;
	const retBuf = new ArrayBuffer(outputLength);
	const retView = new Uint8Array(retBuf);
	for (const view of views) {
		retView.set(view, prevLength);
		prevLength += view.length;
	}
	return retView;
}
function utilDecodeTC() {
	const buf = new Uint8Array(this.valueHex);
	if (this.valueHex.byteLength >= 2) {
		const condition1 = buf[0] === 255 && buf[1] & 128;
		const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
		if (condition1 || condition2) this.warnings.push("Needlessly long format");
	}
	const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
	const bigIntView = new Uint8Array(bigIntBuffer);
	for (let i = 0; i < this.valueHex.byteLength; i++) bigIntView[i] = 0;
	bigIntView[0] = buf[0] & 128;
	const bigInt = utilFromBase(bigIntView, 8);
	const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
	const smallIntView = new Uint8Array(smallIntBuffer);
	for (let j = 0; j < this.valueHex.byteLength; j++) smallIntView[j] = buf[j];
	smallIntView[0] &= 127;
	return utilFromBase(smallIntView, 8) - bigInt;
}
function utilEncodeTC(value) {
	const modValue = value < 0 ? value * -1 : value;
	let bigInt = 128;
	for (let i = 1; i < 8; i++) {
		if (modValue <= bigInt) {
			if (value < 0) {
				const retBuf = utilToBase(bigInt - modValue, 8, i);
				const retView = new Uint8Array(retBuf);
				retView[0] |= 128;
				return retBuf;
			}
			let retBuf = utilToBase(modValue, 8, i);
			let retView = new Uint8Array(retBuf);
			if (retView[0] & 128) {
				const tempBuf = retBuf.slice(0);
				const tempView = new Uint8Array(tempBuf);
				retBuf = new ArrayBuffer(retBuf.byteLength + 1);
				retView = new Uint8Array(retBuf);
				for (let k = 0; k < tempBuf.byteLength; k++) retView[k + 1] = tempView[k];
				retView[0] = 0;
			}
			return retBuf;
		}
		bigInt *= Math.pow(2, 8);
	}
	return /* @__PURE__ */ new ArrayBuffer(0);
}
function isEqualBuffer(inputBuffer1, inputBuffer2) {
	if (inputBuffer1.byteLength !== inputBuffer2.byteLength) return false;
	const view1 = new Uint8Array(inputBuffer1);
	const view2 = new Uint8Array(inputBuffer2);
	for (let i = 0; i < view1.length; i++) if (view1[i] !== view2[i]) return false;
	return true;
}
function padNumber(inputNumber, fullLength) {
	const str = inputNumber.toString(10);
	if (fullLength < str.length) return "";
	const dif = fullLength - str.length;
	const padding = Array.from({ length: dif });
	for (let i = 0; i < dif; i++) padding[i] = "0";
	return padding.join("").concat(str);
}
//#endregion
//#region node_modules/asn1js/build/index.es.js
/*!
* Copyright (c) 2014, GMO GlobalSign
* Copyright (c) 2015-2022, Peculiar Ventures
* All rights reserved.
* 
* Author 2014-2019, Yury Strozhevsky
* 
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
* 
* * Redistributions of source code must retain the above copyright notice, this
*   list of conditions and the following disclaimer.
* 
* * Redistributions in binary form must reproduce the above copyright notice, this
*   list of conditions and the following disclaimer in the documentation and/or
*   other materials provided with the distribution.
* 
* * Neither the name of the copyright holder nor the names of its
*   contributors may be used to endorse or promote products derived from
*   this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* 
*/
var index_es_exports = /* @__PURE__ */ __exportAll({
	Any: () => Any,
	BaseBlock: () => BaseBlock,
	BaseStringBlock: () => BaseStringBlock,
	BitString: () => BitString$1,
	BmpString: () => BmpString,
	Boolean: () => Boolean$1,
	CharacterString: () => CharacterString,
	Choice: () => Choice,
	Constructed: () => Constructed,
	DATE: () => DATE,
	DEFAULT_MAX_CONTENT_LENGTH: () => DEFAULT_MAX_CONTENT_LENGTH,
	DEFAULT_MAX_DEPTH: () => 100,
	DEFAULT_MAX_NODES: () => DEFAULT_MAX_NODES,
	DateTime: () => DateTime,
	Duration: () => Duration,
	EndOfContent: () => EndOfContent,
	Enumerated: () => Enumerated,
	GeneralString: () => GeneralString,
	GeneralizedTime: () => GeneralizedTime,
	GraphicString: () => GraphicString,
	HexBlock: () => HexBlock,
	IA5String: () => IA5String,
	Integer: () => Integer,
	Null: () => Null,
	NumericString: () => NumericString,
	ObjectIdentifier: () => ObjectIdentifier,
	OctetString: () => OctetString$1,
	Primitive: () => Primitive,
	PrintableString: () => PrintableString,
	RawData: () => RawData,
	RelativeObjectIdentifier: () => RelativeObjectIdentifier,
	Repeated: () => Repeated,
	Sequence: () => Sequence,
	Set: () => Set$1,
	TIME: () => TIME,
	TeletexString: () => TeletexString,
	TimeOfDay: () => TimeOfDay,
	UTCTime: () => UTCTime,
	UniversalString: () => UniversalString,
	Utf8String: () => Utf8String,
	ValueBlock: () => ValueBlock,
	VideotexString: () => VideotexString,
	ViewWriter: () => ViewWriter,
	VisibleString: () => VisibleString,
	compareSchema: () => compareSchema,
	fromBER: () => fromBER,
	verifySchema: () => verifySchema
});
function assertBigInt() {
	if (typeof BigInt === "undefined") throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
}
function concat(buffers) {
	let outputLength = 0;
	let prevLength = 0;
	for (let i = 0; i < buffers.length; i++) {
		const buffer = buffers[i];
		outputLength += buffer.byteLength;
	}
	const retView = new Uint8Array(outputLength);
	for (let i = 0; i < buffers.length; i++) {
		const buffer = buffers[i];
		retView.set(new Uint8Array(buffer), prevLength);
		prevLength += buffer.byteLength;
	}
	return retView.buffer;
}
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
	if (!(inputBuffer instanceof Uint8Array)) {
		baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
		return false;
	}
	if (!inputBuffer.byteLength) {
		baseBlock.error = "Wrong parameter: inputBuffer has zero length";
		return false;
	}
	if (inputOffset < 0) {
		baseBlock.error = "Wrong parameter: inputOffset less than zero";
		return false;
	}
	if (inputLength < 0) {
		baseBlock.error = "Wrong parameter: inputLength less than zero";
		return false;
	}
	if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
		baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
		return false;
	}
	return true;
}
var ViewWriter = class {
	constructor() {
		this.items = [];
	}
	write(buf) {
		this.items.push(buf);
	}
	final() {
		return concat(this.items);
	}
};
var powers2 = [new Uint8Array([1])];
var digitsString = "0123456789";
var NAME = "name";
var VALUE_HEX_VIEW = "valueHexView";
var IS_HEX_ONLY = "isHexOnly";
var ID_BLOCK = "idBlock";
var TAG_CLASS = "tagClass";
var TAG_NUMBER = "tagNumber";
var IS_CONSTRUCTED = "isConstructed";
var FROM_BER = "fromBER";
var TO_BER = "toBER";
var LOCAL = "local";
var EMPTY_STRING = "";
var EMPTY_BUFFER = /* @__PURE__ */ new ArrayBuffer(0);
var EMPTY_VIEW = /* @__PURE__ */ new Uint8Array(0);
var END_OF_CONTENT_NAME = "EndOfContent";
var OCTET_STRING_NAME = "OCTET STRING";
var BIT_STRING_NAME = "BIT STRING";
function HexBlock(BaseClass) {
	var _a;
	return _a = class Some extends BaseClass {
		get valueHex() {
			return this.valueHexView.slice().buffer;
		}
		set valueHex(value) {
			this.valueHexView = new Uint8Array(value);
		}
		constructor(...args) {
			var _b;
			super(...args);
			const params = args[0] || {};
			this.isHexOnly = (_b = params.isHexOnly) !== null && _b !== void 0 ? _b : false;
			this.valueHexView = params.valueHex ? BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
		}
		fromBER(inputBuffer, inputOffset, inputLength, _context) {
			const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
			if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
			const endLength = inputOffset + inputLength;
			this.valueHexView = view.subarray(inputOffset, endLength);
			if (!this.valueHexView.length) {
				this.warnings.push("Zero buffer length");
				return inputOffset;
			}
			this.blockLength = inputLength;
			return endLength;
		}
		toBER(sizeOnly = false) {
			if (!this.isHexOnly) {
				this.error = "Flag 'isHexOnly' is not set, abort";
				return EMPTY_BUFFER;
			}
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
			return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
		}
		toJSON() {
			return {
				...super.toJSON(),
				isHexOnly: this.isHexOnly,
				valueHex: Convert.ToHex(this.valueHexView)
			};
		}
	}, _a.NAME = "hexBlock", _a;
}
var LocalBaseBlock = class {
	static blockName() {
		return this.NAME;
	}
	get valueBeforeDecode() {
		return this.valueBeforeDecodeView.slice().buffer;
	}
	set valueBeforeDecode(value) {
		this.valueBeforeDecodeView = new Uint8Array(value);
	}
	constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
		this.blockLength = blockLength;
		this.error = error;
		this.warnings = warnings;
		this.valueBeforeDecodeView = BufferSourceConverter.toUint8Array(valueBeforeDecode);
	}
	toJSON() {
		return {
			blockName: this.constructor.NAME,
			blockLength: this.blockLength,
			error: this.error,
			warnings: this.warnings,
			valueBeforeDecode: Convert.ToHex(this.valueBeforeDecodeView)
		};
	}
};
LocalBaseBlock.NAME = "baseBlock";
var ValueBlock = class extends LocalBaseBlock {
	fromBER(_inputBuffer, _inputOffset, _inputLength, _context) {
		throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
	}
	toBER(_sizeOnly, _writer) {
		throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
	}
};
ValueBlock.NAME = "valueBlock";
var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
	constructor({ idBlock = {} } = {}) {
		var _a, _b, _c, _d;
		super();
		if (idBlock) {
			this.isHexOnly = (_a = idBlock.isHexOnly) !== null && _a !== void 0 ? _a : false;
			this.valueHexView = idBlock.valueHex ? BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
			this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
			this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
			this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
		} else {
			this.tagClass = -1;
			this.tagNumber = -1;
			this.isConstructed = false;
		}
	}
	toBER(sizeOnly = false) {
		let firstOctet = 0;
		switch (this.tagClass) {
			case 1:
				firstOctet |= 0;
				break;
			case 2:
				firstOctet |= 64;
				break;
			case 3:
				firstOctet |= 128;
				break;
			case 4:
				firstOctet |= 192;
				break;
			default:
				this.error = "Unknown tag class";
				return EMPTY_BUFFER;
		}
		if (this.isConstructed) firstOctet |= 32;
		if (this.tagNumber < 31 && !this.isHexOnly) {
			const retView = /* @__PURE__ */ new Uint8Array(1);
			if (!sizeOnly) {
				let number = this.tagNumber;
				number &= 31;
				firstOctet |= number;
				retView[0] = firstOctet;
			}
			return retView.buffer;
		}
		if (!this.isHexOnly) {
			const encodedBuf = utilToBase(this.tagNumber, 7);
			const encodedView = new Uint8Array(encodedBuf);
			const size = encodedBuf.byteLength;
			const retView = new Uint8Array(size + 1);
			retView[0] = firstOctet | 31;
			if (!sizeOnly) {
				for (let i = 0; i < size - 1; i++) retView[i + 1] = encodedView[i] | 128;
				retView[size] = encodedView[size - 1];
			}
			return retView.buffer;
		}
		const retView = new Uint8Array(this.valueHexView.byteLength + 1);
		retView[0] = firstOctet | 31;
		if (!sizeOnly) {
			const curView = this.valueHexView;
			for (let i = 0; i < curView.length - 1; i++) retView[i + 1] = curView[i] | 128;
			retView[this.valueHexView.byteLength] = curView[curView.length - 1];
		}
		return retView.buffer;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		if (intBuffer.length === 0) {
			this.error = "Zero buffer length";
			return -1;
		}
		switch (intBuffer[0] & 192) {
			case 0:
				this.tagClass = 1;
				break;
			case 64:
				this.tagClass = 2;
				break;
			case 128:
				this.tagClass = 3;
				break;
			case 192:
				this.tagClass = 4;
				break;
			default:
				this.error = "Unknown tag class";
				return -1;
		}
		this.isConstructed = (intBuffer[0] & 32) === 32;
		this.isHexOnly = false;
		const tagNumberMask = intBuffer[0] & 31;
		if (tagNumberMask !== 31) {
			this.tagNumber = tagNumberMask;
			this.blockLength = 1;
		} else {
			let count = 0;
			while (true) {
				const tagByteIndex = count + 1;
				if (tagByteIndex >= intBuffer.length) {
					this.error = "End of input reached before message was fully decoded";
					return -1;
				}
				count++;
				if ((intBuffer[tagByteIndex] & 128) === 0) break;
			}
			this.blockLength = count + 1;
			const intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
			for (let i = 0; i < count; i++) intTagNumberBuffer[i] = intBuffer[i + 1] & 127;
			if (this.blockLength <= 9) this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
			else {
				this.isHexOnly = true;
				this.warnings.push("Tag too long, represented as hex-coded");
			}
		}
		if (this.tagClass === 1 && this.isConstructed) switch (this.tagNumber) {
			case 1:
			case 2:
			case 5:
			case 6:
			case 9:
			case 13:
			case 14:
			case 23:
			case 24:
			case 31:
			case 32:
			case 33:
			case 34:
				this.error = "Constructed encoding used for primitive type";
				return -1;
		}
		return inputOffset + this.blockLength;
	}
	toJSON() {
		return {
			...super.toJSON(),
			tagClass: this.tagClass,
			tagNumber: this.tagNumber,
			isConstructed: this.isConstructed
		};
	}
};
LocalIdentificationBlock.NAME = "identificationBlock";
var LocalLengthBlock = class extends LocalBaseBlock {
	constructor({ lenBlock = {} } = {}) {
		var _a, _b, _c;
		super();
		this.isIndefiniteForm = (_a = lenBlock.isIndefiniteForm) !== null && _a !== void 0 ? _a : false;
		this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
		this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const view = BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
		const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
		if (intBuffer.length === 0) {
			this.error = "Zero buffer length";
			return -1;
		}
		if (intBuffer[0] === 255) {
			this.error = "Length block 0xFF is reserved by standard";
			return -1;
		}
		this.isIndefiniteForm = intBuffer[0] === 128;
		if (this.isIndefiniteForm) {
			this.blockLength = 1;
			return inputOffset + this.blockLength;
		}
		this.longFormUsed = !!(intBuffer[0] & 128);
		if (this.longFormUsed === false) {
			this.length = intBuffer[0];
			this.blockLength = 1;
			return inputOffset + this.blockLength;
		}
		const count = intBuffer[0] & 127;
		if (count > 8) {
			this.error = "Too big integer";
			return -1;
		}
		if (count + 1 > intBuffer.length) {
			this.error = "End of input reached before message was fully decoded";
			return -1;
		}
		const lenOffset = inputOffset + 1;
		const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
		if (lengthBufferView[count - 1] === 0) this.warnings.push("Needlessly long encoded length");
		this.length = utilFromBase(lengthBufferView, 8);
		if (this.longFormUsed && this.length <= 127) this.warnings.push("Unnecessary usage of long length form");
		this.blockLength = count + 1;
		return inputOffset + this.blockLength;
	}
	toBER(sizeOnly = false) {
		let retBuf;
		let retView;
		if (this.length > 127) this.longFormUsed = true;
		if (this.isIndefiniteForm) {
			retBuf = /* @__PURE__ */ new ArrayBuffer(1);
			if (sizeOnly === false) {
				retView = new Uint8Array(retBuf);
				retView[0] = 128;
			}
			return retBuf;
		}
		if (this.longFormUsed) {
			const encodedBuf = utilToBase(this.length, 8);
			if (encodedBuf.byteLength > 127) {
				this.error = "Too big length";
				return EMPTY_BUFFER;
			}
			retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
			if (sizeOnly) return retBuf;
			const encodedView = new Uint8Array(encodedBuf);
			retView = new Uint8Array(retBuf);
			retView[0] = encodedBuf.byteLength | 128;
			for (let i = 0; i < encodedBuf.byteLength; i++) retView[i + 1] = encodedView[i];
			return retBuf;
		}
		retBuf = /* @__PURE__ */ new ArrayBuffer(1);
		if (sizeOnly === false) {
			retView = new Uint8Array(retBuf);
			retView[0] = this.length;
		}
		return retBuf;
	}
	toJSON() {
		return {
			...super.toJSON(),
			isIndefiniteForm: this.isIndefiniteForm,
			longFormUsed: this.longFormUsed,
			length: this.length
		};
	}
};
LocalLengthBlock.NAME = "lengthBlock";
var typeStore = {};
var BaseBlock = class extends LocalBaseBlock {
	constructor({ name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
		super(parameters);
		this.name = name;
		this.optional = optional;
		if (primitiveSchema) this.primitiveSchema = primitiveSchema;
		this.idBlock = new LocalIdentificationBlock(parameters);
		this.lenBlock = new LocalLengthBlock(parameters);
		this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length, context);
		if (resultOffset === -1) {
			this.error = this.valueBlock.error;
			return resultOffset;
		}
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
		return resultOffset;
	}
	toBER(sizeOnly, writer) {
		const _writer = writer || new ViewWriter();
		if (!writer) prepareIndefiniteForm(this);
		const idBlockBuf = this.idBlock.toBER(sizeOnly);
		_writer.write(idBlockBuf);
		if (this.lenBlock.isIndefiniteForm) {
			_writer.write(new Uint8Array([128]).buffer);
			this.valueBlock.toBER(sizeOnly, _writer);
			_writer.write(/* @__PURE__ */ new ArrayBuffer(2));
		} else {
			const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
			this.lenBlock.length = valueBlockBuf.byteLength;
			const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
			_writer.write(lenBlockBuf);
			_writer.write(valueBlockBuf);
		}
		if (!writer) return _writer.final();
		return EMPTY_BUFFER;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			idBlock: this.idBlock.toJSON(),
			lenBlock: this.lenBlock.toJSON(),
			valueBlock: this.valueBlock.toJSON(),
			name: this.name,
			optional: this.optional
		};
		if (this.primitiveSchema) object.primitiveSchema = this.primitiveSchema.toJSON();
		return object;
	}
	toString(encoding = "ascii") {
		if (encoding === "ascii") return this.onAsciiEncoding();
		return Convert.ToHex(this.toBER());
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
	}
	isEqual(other) {
		if (this === other) return true;
		if (!(other instanceof this.constructor)) return false;
		return isEqualBuffer(this.toBER(), other.toBER());
	}
};
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
	var _a;
	if (baseBlock instanceof typeStore.Constructed) {
		for (const value of baseBlock.valueBlock.value) if (prepareIndefiniteForm(value)) baseBlock.lenBlock.isIndefiniteForm = true;
	}
	return !!((_a = baseBlock.lenBlock) === null || _a === void 0 ? void 0 : _a.isIndefiniteForm);
}
var BaseStringBlock = class extends BaseBlock {
	getValue() {
		return this.valueBlock.value;
	}
	setValue(value) {
		this.valueBlock.value = value;
	}
	constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
		super(parameters, stringValueBlockType);
		if (value) this.fromString(value);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
		if (resultOffset === -1) {
			this.error = this.valueBlock.error;
			return resultOffset;
		}
		this.fromBuffer(this.valueBlock.valueHexView);
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
		return resultOffset;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
	}
};
BaseStringBlock.NAME = "BaseStringBlock";
var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ isHexOnly = true, ...parameters } = {}) {
		super(parameters);
		this.isHexOnly = isHexOnly;
	}
};
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
var _a$w;
var Primitive = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalPrimitiveValueBlock);
		this.idBlock.isConstructed = false;
	}
};
_a$w = Primitive;
(() => {
	typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";
var DEFAULT_MAX_NODES = 1e4;
var DEFAULT_MAX_CONTENT_LENGTH = 16777216;
var MAX_DEPTH_EXCEEDED_ERROR = "Maximum ASN.1 nesting depth exceeded";
var MAX_NODES_EXCEEDED_ERROR = "Maximum ASN.1 node count exceeded";
var MAX_CONTENT_LENGTH_EXCEEDED_ERROR = "Maximum ASN.1 content length exceeded";
function createFromBerContext(options = {}) {
	var _a, _b, _c;
	return {
		depth: 0,
		maxDepth: (_a = options.maxDepth) !== null && _a !== void 0 ? _a : 100,
		nodesCount: 0,
		maxNodes: (_b = options.maxNodes) !== null && _b !== void 0 ? _b : DEFAULT_MAX_NODES,
		maxContentLength: (_c = options.maxContentLength) !== null && _c !== void 0 ? _c : DEFAULT_MAX_CONTENT_LENGTH
	};
}
function createErrorResult(error) {
	const result = new BaseBlock({}, ValueBlock);
	result.error = error;
	return {
		offset: -1,
		result
	};
}
function checkNodesLimit(context) {
	context.nodesCount += 1;
	if (context.nodesCount > context.maxNodes) return MAX_NODES_EXCEEDED_ERROR;
}
function checkContentLengthLimit(inputLength, context) {
	if (inputLength > context.maxContentLength) return MAX_CONTENT_LENGTH_EXCEEDED_ERROR;
}
function localFromBERWithChildContext(inputBuffer, inputOffset, inputLength, context) {
	const childDepth = context.depth + 1;
	if (childDepth > context.maxDepth) return createErrorResult(MAX_DEPTH_EXCEEDED_ERROR);
	context.depth = childDepth;
	try {
		return localFromBER(inputBuffer, inputOffset, inputLength, context);
	} finally {
		context.depth -= 1;
	}
}
function localChangeType(inputObject, newType) {
	if (inputObject instanceof newType) return inputObject;
	const newObject = new newType();
	newObject.idBlock = inputObject.idBlock;
	newObject.lenBlock = inputObject.lenBlock;
	newObject.warnings = inputObject.warnings;
	newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
	return newObject;
}
function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length, context = createFromBerContext()) {
	const incomingOffset = inputOffset;
	let returnObject = new BaseBlock({}, ValueBlock);
	const baseBlock = new LocalBaseBlock();
	if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
		returnObject.error = baseBlock.error;
		return {
			offset: -1,
			result: returnObject
		};
	}
	if (!inputBuffer.subarray(inputOffset, inputOffset + inputLength).length) {
		returnObject.error = "Zero buffer length";
		return {
			offset: -1,
			result: returnObject
		};
	}
	const nodesLimitError = checkNodesLimit(context);
	if (nodesLimitError) {
		returnObject.error = nodesLimitError;
		return {
			offset: -1,
			result: returnObject
		};
	}
	let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
	if (returnObject.idBlock.warnings.length) returnObject.warnings.concat(returnObject.idBlock.warnings);
	if (resultOffset === -1) {
		returnObject.error = returnObject.idBlock.error;
		return {
			offset: -1,
			result: returnObject
		};
	}
	inputOffset = resultOffset;
	inputLength -= returnObject.idBlock.blockLength;
	resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
	if (returnObject.lenBlock.warnings.length) returnObject.warnings.concat(returnObject.lenBlock.warnings);
	if (resultOffset === -1) {
		returnObject.error = returnObject.lenBlock.error;
		return {
			offset: -1,
			result: returnObject
		};
	}
	inputOffset = resultOffset;
	inputLength -= returnObject.lenBlock.blockLength;
	const valueLength = returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length;
	const contentLengthError = checkContentLengthLimit(valueLength, context);
	if (contentLengthError) {
		returnObject.error = contentLengthError;
		return {
			offset: -1,
			result: returnObject
		};
	}
	if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
		returnObject.error = "Indefinite length form used for primitive encoding form";
		return {
			offset: -1,
			result: returnObject
		};
	}
	let newASN1Type = BaseBlock;
	switch (returnObject.idBlock.tagClass) {
		case 1:
			if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
				returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
				return {
					offset: -1,
					result: returnObject
				};
			}
			switch (returnObject.idBlock.tagNumber) {
				case 0:
					if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
						returnObject.error = "Type [UNIVERSAL 0] is reserved";
						return {
							offset: -1,
							result: returnObject
						};
					}
					newASN1Type = typeStore.EndOfContent;
					break;
				case 1:
					newASN1Type = typeStore.Boolean;
					break;
				case 2:
					newASN1Type = typeStore.Integer;
					break;
				case 3:
					newASN1Type = typeStore.BitString;
					break;
				case 4:
					newASN1Type = typeStore.OctetString;
					break;
				case 5:
					newASN1Type = typeStore.Null;
					break;
				case 6:
					newASN1Type = typeStore.ObjectIdentifier;
					break;
				case 10:
					newASN1Type = typeStore.Enumerated;
					break;
				case 12:
					newASN1Type = typeStore.Utf8String;
					break;
				case 13:
					newASN1Type = typeStore.RelativeObjectIdentifier;
					break;
				case 14:
					newASN1Type = typeStore.TIME;
					break;
				case 15:
					returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
					return {
						offset: -1,
						result: returnObject
					};
				case 16:
					newASN1Type = typeStore.Sequence;
					break;
				case 17:
					newASN1Type = typeStore.Set;
					break;
				case 18:
					newASN1Type = typeStore.NumericString;
					break;
				case 19:
					newASN1Type = typeStore.PrintableString;
					break;
				case 20:
					newASN1Type = typeStore.TeletexString;
					break;
				case 21:
					newASN1Type = typeStore.VideotexString;
					break;
				case 22:
					newASN1Type = typeStore.IA5String;
					break;
				case 23:
					newASN1Type = typeStore.UTCTime;
					break;
				case 24:
					newASN1Type = typeStore.GeneralizedTime;
					break;
				case 25:
					newASN1Type = typeStore.GraphicString;
					break;
				case 26:
					newASN1Type = typeStore.VisibleString;
					break;
				case 27:
					newASN1Type = typeStore.GeneralString;
					break;
				case 28:
					newASN1Type = typeStore.UniversalString;
					break;
				case 29:
					newASN1Type = typeStore.CharacterString;
					break;
				case 30:
					newASN1Type = typeStore.BmpString;
					break;
				case 31:
					newASN1Type = typeStore.DATE;
					break;
				case 32:
					newASN1Type = typeStore.TimeOfDay;
					break;
				case 33:
					newASN1Type = typeStore.DateTime;
					break;
				case 34:
					newASN1Type = typeStore.Duration;
					break;
				default: {
					const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
					newObject.idBlock = returnObject.idBlock;
					newObject.lenBlock = returnObject.lenBlock;
					newObject.warnings = returnObject.warnings;
					returnObject = newObject;
				}
			}
			break;
		default: newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
	}
	returnObject = localChangeType(returnObject, newASN1Type);
	resultOffset = returnObject.fromBER(inputBuffer, inputOffset, valueLength, context);
	returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
	return {
		offset: resultOffset,
		result: returnObject
	};
}
function fromBER(inputBuffer, options = {}) {
	if (!inputBuffer.byteLength) {
		const result = new BaseBlock({}, ValueBlock);
		result.error = "Input buffer has zero length";
		return {
			offset: -1,
			result
		};
	}
	return localFromBER(BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength, createFromBerContext(options));
}
function checkLen(indefiniteLength, length) {
	if (indefiniteLength) return 1;
	return length;
}
var LocalConstructedValueBlock = class extends ValueBlock {
	constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
		super(parameters);
		this.value = value;
		this.isIndefiniteForm = isIndefiniteForm;
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		const view = BufferSourceConverter.toUint8Array(inputBuffer);
		const parseContext = context !== null && context !== void 0 ? context : createFromBerContext();
		if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
		this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
		if (this.valueBeforeDecodeView.length === 0) {
			this.warnings.push("Zero buffer length");
			return inputOffset;
		}
		let currentOffset = inputOffset;
		while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
			const returnObject = localFromBERWithChildContext(view, currentOffset, inputLength, parseContext);
			if (returnObject.offset === -1) {
				this.error = returnObject.result.error;
				this.warnings.concat(returnObject.result.warnings);
				return -1;
			}
			currentOffset = returnObject.offset;
			this.blockLength += returnObject.result.blockLength;
			inputLength -= returnObject.result.blockLength;
			this.value.push(returnObject.result);
			if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) break;
		}
		if (this.isIndefiniteForm) if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) this.value.pop();
		else this.warnings.push("No EndOfContent block encoded");
		return currentOffset;
	}
	toBER(sizeOnly, writer) {
		const _writer = writer || new ViewWriter();
		for (let i = 0; i < this.value.length; i++) this.value[i].toBER(sizeOnly, _writer);
		if (!writer) return _writer.final();
		return EMPTY_BUFFER;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			isIndefiniteForm: this.isIndefiniteForm,
			value: []
		};
		for (const value of this.value) object.value.push(value.toJSON());
		return object;
	}
};
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
var _a$v;
var Constructed = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalConstructedValueBlock);
		this.idBlock.isConstructed = true;
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
		const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length, context);
		if (resultOffset === -1) {
			this.error = this.valueBlock.error;
			return resultOffset;
		}
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
		return resultOffset;
	}
	onAsciiEncoding() {
		const values = [];
		for (const value of this.valueBlock.value) values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
		const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
		return values.length ? `${blockName} :\n${values.join("\n")}` : `${blockName} :`;
	}
};
_a$v = Constructed;
(() => {
	typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";
var LocalEndOfContentValueBlock = class extends ValueBlock {
	fromBER(inputBuffer, inputOffset, _inputLength) {
		return inputOffset;
	}
	toBER(_sizeOnly) {
		return EMPTY_BUFFER;
	}
};
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
var _a$u;
var EndOfContent = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalEndOfContentValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 0;
	}
};
_a$u = EndOfContent;
(() => {
	typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;
var _a$t;
var Null = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, ValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 5;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (this.lenBlock.length > 0) this.warnings.push("Non-zero length of value block for Null type");
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		this.blockLength += inputLength;
		if (inputOffset + inputLength > inputBuffer.byteLength) {
			this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
			return -1;
		}
		return inputOffset + inputLength;
	}
	toBER(sizeOnly, writer) {
		const retBuf = /* @__PURE__ */ new ArrayBuffer(2);
		if (!sizeOnly) {
			const retView = new Uint8Array(retBuf);
			retView[0] = 5;
			retView[1] = 0;
		}
		if (writer) writer.write(retBuf);
		return retBuf;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME}`;
	}
};
_a$t = Null;
(() => {
	typeStore.Null = _a$t;
})();
Null.NAME = "NULL";
var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
	get value() {
		for (const octet of this.valueHexView) if (octet > 0) return true;
		return false;
	}
	set value(value) {
		this.valueHexView[0] = value ? 255 : 0;
	}
	constructor({ value, ...parameters } = {}) {
		super(parameters);
		if (parameters.valueHex) this.valueHexView = BufferSourceConverter.toUint8Array(parameters.valueHex);
		else this.valueHexView = /* @__PURE__ */ new Uint8Array(1);
		if (value) this.value = value;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
		if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
		this.isHexOnly = true;
		utilDecodeTC.call(this);
		this.blockLength = inputLength;
		return inputOffset + inputLength;
	}
	toBER() {
		return this.valueHexView.slice();
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.value
		};
	}
};
LocalBooleanValueBlock.NAME = "BooleanValueBlock";
var _a$s;
var Boolean$1 = class extends BaseBlock {
	getValue() {
		return this.valueBlock.value;
	}
	setValue(value) {
		this.valueBlock.value = value;
	}
	constructor(parameters = {}) {
		super(parameters, LocalBooleanValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 1;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.getValue}`;
	}
};
_a$s = Boolean$1;
(() => {
	typeStore.Boolean = _a$s;
})();
Boolean$1.NAME = "BOOLEAN";
var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
	constructor({ isConstructed = false, ...parameters } = {}) {
		super(parameters);
		this.isConstructed = isConstructed;
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		let resultOffset = 0;
		if (this.isConstructed) {
			this.isHexOnly = false;
			resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength, context);
			if (resultOffset === -1) return resultOffset;
			for (let i = 0; i < this.value.length; i++) {
				const currentBlockName = this.value[i].constructor.NAME;
				if (currentBlockName === END_OF_CONTENT_NAME) if (this.isIndefiniteForm) break;
				else {
					this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
					return -1;
				}
				if (currentBlockName !== OCTET_STRING_NAME) {
					this.error = "OCTET STRING may consists of OCTET STRINGs only";
					return -1;
				}
			}
		} else {
			this.isHexOnly = true;
			resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
			this.blockLength = inputLength;
		}
		return resultOffset;
	}
	toBER(sizeOnly, writer) {
		if (this.isConstructed) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
		return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
	}
	toJSON() {
		return {
			...super.toJSON(),
			isConstructed: this.isConstructed
		};
	}
};
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
var _a$r;
var OctetString$1 = class extends BaseBlock {
	constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
		var _b, _c;
		(_b = parameters.isConstructed) !== null && _b !== void 0 || (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
		super({
			idBlock: {
				isConstructed: parameters.isConstructed,
				...idBlock
			},
			lenBlock: {
				...lenBlock,
				isIndefiniteForm: !!parameters.isIndefiniteForm
			},
			...parameters
		}, LocalOctetStringValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 4;
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		this.valueBlock.isConstructed = this.idBlock.isConstructed;
		this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
		if (inputLength === 0) {
			if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
			if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
			return inputOffset;
		}
		if (!this.valueBlock.isConstructed) {
			const buf = (inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer).subarray(inputOffset, inputOffset + inputLength);
			try {
				if (buf.byteLength) {
					const parseContext = context !== null && context !== void 0 ? context : createFromBerContext();
					const asn = localFromBERWithChildContext(buf, 0, buf.byteLength, parseContext);
					if (asn.offset !== -1 && asn.offset === inputLength) this.valueBlock.value = [asn.result];
				}
			} catch {}
		}
		return super.fromBER(inputBuffer, inputOffset, inputLength, context);
	}
	onAsciiEncoding() {
		if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) return Constructed.prototype.onAsciiEncoding.call(this);
		return `${this.constructor.NAME} : ${Convert.ToHex(this.valueBlock.valueHexView)}`;
	}
	getValue() {
		if (!this.idBlock.isConstructed) return this.valueBlock.valueHexView.slice().buffer;
		const array = [];
		for (const content of this.valueBlock.value) if (content instanceof _a$r) array.push(content.valueBlock.valueHexView);
		return BufferSourceConverter.concat(array);
	}
};
_a$r = OctetString$1;
(() => {
	typeStore.OctetString = _a$r;
})();
OctetString$1.NAME = OCTET_STRING_NAME;
var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
	constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
		super(parameters);
		this.unusedBits = unusedBits;
		this.isConstructed = isConstructed;
		this.blockLength = this.valueHexView.byteLength;
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		if (!inputLength) return inputOffset;
		let resultOffset = -1;
		if (this.isConstructed) {
			resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength, context);
			if (resultOffset === -1) return resultOffset;
			for (const value of this.value) {
				const currentBlockName = value.constructor.NAME;
				if (currentBlockName === END_OF_CONTENT_NAME) if (this.isIndefiniteForm) break;
				else {
					this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
					return -1;
				}
				if (currentBlockName !== BIT_STRING_NAME) {
					this.error = "BIT STRING may consists of BIT STRINGs only";
					return -1;
				}
				const valueBlock = value.valueBlock;
				if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
					this.error = "Using of \"unused bits\" inside constructive BIT STRING allowed for least one only";
					return -1;
				}
				this.unusedBits = valueBlock.unusedBits;
			}
			return resultOffset;
		}
		const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		this.unusedBits = intBuffer[0];
		if (this.unusedBits > 7) {
			this.error = "Unused bits for BitString must be in range 0-7";
			return -1;
		}
		if (!this.unusedBits) {
			const buf = intBuffer.subarray(1);
			try {
				if (buf.byteLength) {
					const parseContext = context !== null && context !== void 0 ? context : createFromBerContext();
					const asn = localFromBERWithChildContext(buf, 0, buf.byteLength, parseContext);
					if (asn.offset !== -1 && asn.offset === inputLength - 1) this.value = [asn.result];
				}
			} catch {}
		}
		this.valueHexView = intBuffer.subarray(1);
		this.blockLength = intBuffer.length;
		return inputOffset + inputLength;
	}
	toBER(sizeOnly, writer) {
		if (this.isConstructed) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
		if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength + 1);
		if (!this.valueHexView.byteLength) {
			const empty = /* @__PURE__ */ new Uint8Array(1);
			empty[0] = 0;
			return empty.buffer;
		}
		const retView = new Uint8Array(this.valueHexView.length + 1);
		retView[0] = this.unusedBits;
		retView.set(this.valueHexView, 1);
		return retView.buffer;
	}
	toJSON() {
		return {
			...super.toJSON(),
			unusedBits: this.unusedBits,
			isConstructed: this.isConstructed
		};
	}
};
LocalBitStringValueBlock.NAME = "BitStringValueBlock";
var _a$q;
var BitString$1 = class extends BaseBlock {
	constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
		var _b, _c;
		(_b = parameters.isConstructed) !== null && _b !== void 0 || (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
		super({
			idBlock: {
				isConstructed: parameters.isConstructed,
				...idBlock
			},
			lenBlock: {
				...lenBlock,
				isIndefiniteForm: !!parameters.isIndefiniteForm
			},
			...parameters
		}, LocalBitStringValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 3;
	}
	fromBER(inputBuffer, inputOffset, inputLength, context) {
		this.valueBlock.isConstructed = this.idBlock.isConstructed;
		this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
		return super.fromBER(inputBuffer, inputOffset, inputLength, context);
	}
	onAsciiEncoding() {
		if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) return Constructed.prototype.onAsciiEncoding.call(this);
		else {
			const bits = [];
			const valueHex = this.valueBlock.valueHexView;
			for (const byte of valueHex) bits.push(byte.toString(2).padStart(8, "0"));
			const bitsStr = bits.join("");
			return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
		}
	}
};
_a$q = BitString$1;
(() => {
	typeStore.BitString = _a$q;
})();
BitString$1.NAME = BIT_STRING_NAME;
var _a$p;
function viewAdd(first, second) {
	const c = new Uint8Array([0]);
	const firstView = new Uint8Array(first);
	const secondView = new Uint8Array(second);
	let firstViewCopy = firstView.slice(0);
	const firstViewCopyLength = firstViewCopy.length - 1;
	const secondViewCopy = secondView.slice(0);
	const secondViewCopyLength = secondViewCopy.length - 1;
	let value = 0;
	const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
	let counter = 0;
	for (let i = max; i >= 0; i--, counter++) {
		switch (true) {
			case counter < secondViewCopy.length:
				value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
				break;
			default: value = firstViewCopy[firstViewCopyLength - counter] + c[0];
		}
		c[0] = value / 10;
		switch (true) {
			case counter >= firstViewCopy.length:
				firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
				break;
			default: firstViewCopy[firstViewCopyLength - counter] = value % 10;
		}
	}
	if (c[0] > 0) firstViewCopy = utilConcatView(c, firstViewCopy);
	return firstViewCopy;
}
function power2(n) {
	if (n >= powers2.length) for (let p = powers2.length; p <= n; p++) {
		const c = new Uint8Array([0]);
		let digits = powers2[p - 1].slice(0);
		for (let i = digits.length - 1; i >= 0; i--) {
			const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
			c[0] = newValue[0] / 10;
			digits[i] = newValue[0] % 10;
		}
		if (c[0] > 0) digits = utilConcatView(c, digits);
		powers2.push(digits);
	}
	return powers2[n];
}
function viewSub(first, second) {
	let b = 0;
	const firstView = new Uint8Array(first);
	const secondView = new Uint8Array(second);
	const firstViewCopy = firstView.slice(0);
	const firstViewCopyLength = firstViewCopy.length - 1;
	const secondViewCopy = secondView.slice(0);
	const secondViewCopyLength = secondViewCopy.length - 1;
	let value;
	let counter = 0;
	for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
		value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
		switch (true) {
			case value < 0:
				b = 1;
				firstViewCopy[firstViewCopyLength - counter] = value + 10;
				break;
			default:
				b = 0;
				firstViewCopy[firstViewCopyLength - counter] = value;
		}
	}
	if (b > 0) for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
		value = firstViewCopy[firstViewCopyLength - counter] - b;
		if (value < 0) {
			b = 1;
			firstViewCopy[firstViewCopyLength - counter] = value + 10;
		} else {
			b = 0;
			firstViewCopy[firstViewCopyLength - counter] = value;
			break;
		}
	}
	return firstViewCopy.slice();
}
var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
	setValueHex() {
		if (this.valueHexView.length >= 4) {
			this.warnings.push("Too big Integer for decoding, hex only");
			this.isHexOnly = true;
			this._valueDec = 0;
		} else {
			this.isHexOnly = false;
			if (this.valueHexView.length > 0) this._valueDec = utilDecodeTC.call(this);
		}
	}
	constructor({ value, ...parameters } = {}) {
		super(parameters);
		this._valueDec = 0;
		if (parameters.valueHex) this.setValueHex();
		if (value !== void 0) this.valueDec = value;
	}
	set valueDec(v) {
		this._valueDec = v;
		this.isHexOnly = false;
		this.valueHexView = new Uint8Array(utilEncodeTC(v));
	}
	get valueDec() {
		return this._valueDec;
	}
	fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
		const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
		if (offset === -1) return offset;
		const view = this.valueHexView;
		if (view[0] === 0 && (view[1] & 128) !== 0) this.valueHexView = view.subarray(1);
		else if (expectedLength !== 0) {
			if (view.length < expectedLength) {
				if (expectedLength - view.length > 1) expectedLength = view.length + 1;
				this.valueHexView = view.subarray(expectedLength - view.length);
			}
		}
		return offset;
	}
	toDER(sizeOnly = false) {
		const view = this.valueHexView;
		switch (true) {
			case (view[0] & 128) !== 0:
				{
					const updatedView = new Uint8Array(this.valueHexView.length + 1);
					updatedView[0] = 0;
					updatedView.set(view, 1);
					this.valueHexView = updatedView;
				}
				break;
			case view[0] === 0 && (view[1] & 128) === 0: this.valueHexView = this.valueHexView.subarray(1);
		}
		return this.toBER(sizeOnly);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
		if (resultOffset === -1) return resultOffset;
		this.setValueHex();
		return resultOffset;
	}
	toBER(sizeOnly) {
		return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
	}
	toJSON() {
		return {
			...super.toJSON(),
			valueDec: this.valueDec
		};
	}
	toString() {
		const firstBit = this.valueHexView.length * 8 - 1;
		let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
		let bitNumber = 0;
		let currentByte;
		const asn1View = this.valueHexView;
		let result = "";
		let flag = false;
		for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
			currentByte = asn1View[byteNumber];
			for (let i = 0; i < 8; i++) {
				if ((currentByte & 1) === 1) switch (bitNumber) {
					case firstBit:
						digits = viewSub(power2(bitNumber), digits);
						result = "-";
						break;
					default: digits = viewAdd(digits, power2(bitNumber));
				}
				bitNumber++;
				currentByte >>= 1;
			}
		}
		for (let i = 0; i < digits.length; i++) {
			if (digits[i]) flag = true;
			if (flag) result += digitsString.charAt(digits[i]);
		}
		if (flag === false) result += digitsString.charAt(0);
		return result;
	}
};
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
	Object.defineProperty(_a$p.prototype, "valueHex", {
		set: function(v) {
			this.valueHexView = new Uint8Array(v);
			this.setValueHex();
		},
		get: function() {
			return this.valueHexView.slice().buffer;
		}
	});
})();
var _a$o;
var Integer = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalIntegerValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 2;
	}
	toBigInt() {
		assertBigInt();
		return BigInt(this.valueBlock.toString());
	}
	static fromBigInt(value) {
		assertBigInt();
		const bigIntValue = BigInt(value);
		const writer = new ViewWriter();
		const hex = bigIntValue.toString(16).replace(/^-/, "");
		const view = new Uint8Array(Convert.FromHex(hex));
		if (bigIntValue < 0) {
			const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
			first[0] |= 128;
			const secondInt = BigInt(`0x${Convert.ToHex(first)}`) + bigIntValue;
			const second = BufferSourceConverter.toUint8Array(Convert.FromHex(secondInt.toString(16)));
			second[0] |= 128;
			writer.write(second);
		} else {
			if (view[0] & 128) writer.write(new Uint8Array([0]));
			writer.write(view);
		}
		return new _a$o({ valueHex: writer.final() });
	}
	convertToDER() {
		const integer = new _a$o({ valueHex: this.valueBlock.valueHexView });
		integer.valueBlock.toDER();
		return integer;
	}
	convertFromDER() {
		return new _a$o({ valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView });
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
	}
};
_a$o = Integer;
(() => {
	typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";
var _a$n;
var Enumerated = class extends Integer {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 10;
	}
};
_a$n = Enumerated;
(() => {
	typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";
var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
		super(parameters);
		this.valueDec = valueDec;
		this.isFirstSid = isFirstSid;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (!inputLength) return inputOffset;
		const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		this.valueHexView = new Uint8Array(inputLength);
		for (let i = 0; i < inputLength; i++) {
			this.valueHexView[i] = intBuffer[i] & 127;
			this.blockLength++;
			if ((intBuffer[i] & 128) === 0) break;
		}
		const tempView = new Uint8Array(this.blockLength);
		for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
		this.valueHexView = tempView;
		if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
			this.error = "End of input reached before message was fully decoded";
			return -1;
		}
		if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
		if (this.blockLength <= 8) this.valueDec = utilFromBase(this.valueHexView, 7);
		else {
			this.isHexOnly = true;
			this.warnings.push("Too big SID for decoding, hex only");
		}
		return inputOffset + this.blockLength;
	}
	set valueBigInt(value) {
		assertBigInt();
		let bits = BigInt(value).toString(2);
		while (bits.length % 7) bits = "0" + bits;
		const bytes = new Uint8Array(bits.length / 7);
		for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 128 : 0);
		this.fromBER(bytes.buffer, 0, bytes.length);
	}
	toBER(sizeOnly) {
		if (this.isHexOnly) {
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
			const curView = this.valueHexView;
			const retView = new Uint8Array(this.blockLength);
			for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 128;
			retView[this.blockLength - 1] = curView[this.blockLength - 1];
			return retView.buffer;
		}
		const encodedBuf = utilToBase(this.valueDec, 7);
		if (encodedBuf.byteLength === 0) {
			this.error = "Error during encoding SID value";
			return EMPTY_BUFFER;
		}
		const retView = new Uint8Array(encodedBuf.byteLength);
		if (!sizeOnly) {
			const encodedView = new Uint8Array(encodedBuf);
			const len = encodedBuf.byteLength - 1;
			for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
			retView[len] = encodedView[len];
		}
		return retView;
	}
	toString() {
		let result = "";
		if (this.isHexOnly) result = Convert.ToHex(this.valueHexView);
		else if (this.isFirstSid) {
			let sidValue = this.valueDec;
			if (this.valueDec <= 39) result = "0.";
			else if (this.valueDec <= 79) {
				result = "1.";
				sidValue -= 40;
			} else {
				result = "2.";
				sidValue -= 80;
			}
			result += sidValue.toString();
		} else result = this.valueDec.toString();
		return result;
	}
	toJSON() {
		return {
			...super.toJSON(),
			valueDec: this.valueDec,
			isFirstSid: this.isFirstSid
		};
	}
};
LocalSidValueBlock.NAME = "sidBlock";
var LocalObjectIdentifierValueBlock = class extends ValueBlock {
	constructor({ value = EMPTY_STRING, ...parameters } = {}) {
		super(parameters);
		this.value = [];
		if (value) this.fromString(value);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		let resultOffset = inputOffset;
		while (inputLength > 0) {
			const sidBlock = new LocalSidValueBlock();
			resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
			if (resultOffset === -1) {
				this.blockLength = 0;
				this.error = sidBlock.error;
				return resultOffset;
			}
			if (this.value.length === 0) sidBlock.isFirstSid = true;
			this.blockLength += sidBlock.blockLength;
			inputLength -= sidBlock.blockLength;
			this.value.push(sidBlock);
		}
		return resultOffset;
	}
	toBER(sizeOnly) {
		const retBuffers = [];
		for (let i = 0; i < this.value.length; i++) {
			const valueBuf = this.value[i].toBER(sizeOnly);
			if (valueBuf.byteLength === 0) {
				this.error = this.value[i].error;
				return EMPTY_BUFFER;
			}
			retBuffers.push(valueBuf);
		}
		return concat(retBuffers);
	}
	fromString(string) {
		this.value = [];
		let pos1 = 0;
		let pos2 = 0;
		let sid = "";
		let flag = false;
		do {
			pos2 = string.indexOf(".", pos1);
			if (pos2 === -1) sid = string.substring(pos1);
			else sid = string.substring(pos1, pos2);
			pos1 = pos2 + 1;
			if (flag) {
				const sidBlock = this.value[0];
				let plus = 0;
				switch (sidBlock.valueDec) {
					case 0: break;
					case 1:
						plus = 40;
						break;
					case 2:
						plus = 80;
						break;
					default:
						this.value = [];
						return;
				}
				const parsedSID = parseInt(sid, 10);
				if (isNaN(parsedSID)) return;
				sidBlock.valueDec = parsedSID + plus;
				flag = false;
			} else {
				const sidBlock = new LocalSidValueBlock();
				if (sid > Number.MAX_SAFE_INTEGER) {
					assertBigInt();
					sidBlock.valueBigInt = BigInt(sid);
				} else {
					sidBlock.valueDec = parseInt(sid, 10);
					if (isNaN(sidBlock.valueDec)) return;
				}
				if (!this.value.length) {
					sidBlock.isFirstSid = true;
					flag = true;
				}
				this.value.push(sidBlock);
			}
		} while (pos2 !== -1);
	}
	toString() {
		let result = "";
		let isHexOnly = false;
		for (let i = 0; i < this.value.length; i++) {
			isHexOnly = this.value[i].isHexOnly;
			let sidStr = this.value[i].toString();
			if (i !== 0) result = `${result}.`;
			if (isHexOnly) {
				sidStr = `{${sidStr}}`;
				if (this.value[i].isFirstSid) result = `2.{${sidStr} - 80}`;
				else result += sidStr;
			} else result += sidStr;
		}
		return result;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			value: this.toString(),
			sidArray: []
		};
		for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
		return object;
	}
};
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
var _a$m;
var ObjectIdentifier = class extends BaseBlock {
	getValue() {
		return this.valueBlock.toString();
	}
	setValue(value) {
		this.valueBlock.fromString(value);
	}
	constructor(parameters = {}) {
		super(parameters, LocalObjectIdentifierValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 6;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.getValue()
		};
	}
};
_a$m = ObjectIdentifier;
(() => {
	typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
	constructor({ valueDec = 0, ...parameters } = {}) {
		super(parameters);
		this.valueDec = valueDec;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (inputLength === 0) return inputOffset;
		const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		this.valueHexView = new Uint8Array(inputLength);
		for (let i = 0; i < inputLength; i++) {
			this.valueHexView[i] = intBuffer[i] & 127;
			this.blockLength++;
			if ((intBuffer[i] & 128) === 0) break;
		}
		const tempView = new Uint8Array(this.blockLength);
		for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
		this.valueHexView = tempView;
		if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
			this.error = "End of input reached before message was fully decoded";
			return -1;
		}
		if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
		if (this.blockLength <= 8) this.valueDec = utilFromBase(this.valueHexView, 7);
		else {
			this.isHexOnly = true;
			this.warnings.push("Too big SID for decoding, hex only");
		}
		return inputOffset + this.blockLength;
	}
	toBER(sizeOnly) {
		if (this.isHexOnly) {
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
			const curView = this.valueHexView;
			const retView = new Uint8Array(this.blockLength);
			for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 128;
			retView[this.blockLength - 1] = curView[this.blockLength - 1];
			return retView.buffer;
		}
		const encodedBuf = utilToBase(this.valueDec, 7);
		if (encodedBuf.byteLength === 0) {
			this.error = "Error during encoding SID value";
			return EMPTY_BUFFER;
		}
		const retView = new Uint8Array(encodedBuf.byteLength);
		if (!sizeOnly) {
			const encodedView = new Uint8Array(encodedBuf);
			const len = encodedBuf.byteLength - 1;
			for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
			retView[len] = encodedView[len];
		}
		return retView.buffer;
	}
	toString() {
		let result = "";
		if (this.isHexOnly) result = Convert.ToHex(this.valueHexView);
		else result = this.valueDec.toString();
		return result;
	}
	toJSON() {
		return {
			...super.toJSON(),
			valueDec: this.valueDec
		};
	}
};
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
	constructor({ value = EMPTY_STRING, ...parameters } = {}) {
		super(parameters);
		this.value = [];
		if (value) this.fromString(value);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		let resultOffset = inputOffset;
		while (inputLength > 0) {
			const sidBlock = new LocalRelativeSidValueBlock();
			resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
			if (resultOffset === -1) {
				this.blockLength = 0;
				this.error = sidBlock.error;
				return resultOffset;
			}
			this.blockLength += sidBlock.blockLength;
			inputLength -= sidBlock.blockLength;
			this.value.push(sidBlock);
		}
		return resultOffset;
	}
	toBER(sizeOnly, _writer) {
		const retBuffers = [];
		for (let i = 0; i < this.value.length; i++) {
			const valueBuf = this.value[i].toBER(sizeOnly);
			if (valueBuf.byteLength === 0) {
				this.error = this.value[i].error;
				return EMPTY_BUFFER;
			}
			retBuffers.push(valueBuf);
		}
		return concat(retBuffers);
	}
	fromString(string) {
		this.value = [];
		let pos1 = 0;
		let pos2 = 0;
		let sid = "";
		do {
			pos2 = string.indexOf(".", pos1);
			if (pos2 === -1) sid = string.substring(pos1);
			else sid = string.substring(pos1, pos2);
			pos1 = pos2 + 1;
			const sidBlock = new LocalRelativeSidValueBlock();
			sidBlock.valueDec = parseInt(sid, 10);
			if (isNaN(sidBlock.valueDec)) return true;
			this.value.push(sidBlock);
		} while (pos2 !== -1);
		return true;
	}
	toString() {
		let result = "";
		let isHexOnly = false;
		for (let i = 0; i < this.value.length; i++) {
			isHexOnly = this.value[i].isHexOnly;
			let sidStr = this.value[i].toString();
			if (i !== 0) result = `${result}.`;
			if (isHexOnly) {
				sidStr = `{${sidStr}}`;
				result += sidStr;
			} else result += sidStr;
		}
		return result;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			value: this.toString(),
			sidArray: []
		};
		for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
		return object;
	}
};
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
var _a$l;
var RelativeObjectIdentifier = class extends BaseBlock {
	getValue() {
		return this.valueBlock.toString();
	}
	setValue(value) {
		this.valueBlock.fromString(value);
	}
	constructor(parameters = {}) {
		super(parameters, LocalRelativeObjectIdentifierValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 13;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.getValue()
		};
	}
};
_a$l = RelativeObjectIdentifier;
(() => {
	typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
var _a$k;
var Sequence = class extends Constructed {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 16;
	}
};
_a$k = Sequence;
(() => {
	typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";
var _a$j;
var Set$1 = class extends Constructed {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 17;
	}
};
_a$j = Set$1;
(() => {
	typeStore.Set = _a$j;
})();
Set$1.NAME = "SET";
var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ ...parameters } = {}) {
		super(parameters);
		this.isHexOnly = true;
		this.value = EMPTY_STRING;
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.value
		};
	}
};
LocalStringValueBlock.NAME = "StringValueBlock";
var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {};
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
var LocalSimpleStringBlock = class extends BaseStringBlock {
	constructor({ ...parameters } = {}) {
		super(parameters, LocalSimpleStringValueBlock);
	}
	fromBuffer(inputBuffer) {
		this.valueBlock.value = String.fromCharCode.apply(null, BufferSourceConverter.toUint8Array(inputBuffer));
	}
	fromString(inputString) {
		const strLen = inputString.length;
		const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
		for (let i = 0; i < strLen; i++) view[i] = inputString.charCodeAt(i);
		this.valueBlock.value = inputString;
	}
};
LocalSimpleStringBlock.NAME = "SIMPLE STRING";
var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
	fromBuffer(inputBuffer) {
		this.valueBlock.valueHexView = BufferSourceConverter.toUint8Array(inputBuffer);
		try {
			this.valueBlock.value = Convert.ToUtf8String(inputBuffer);
		} catch (ex) {
			this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
			this.valueBlock.value = Convert.ToBinary(inputBuffer);
		}
	}
	fromString(inputString) {
		this.valueBlock.valueHexView = new Uint8Array(Convert.FromUtf8String(inputString));
		this.valueBlock.value = inputString;
	}
};
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
var _a$i;
var Utf8String = class extends LocalUtf8StringValueBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 12;
	}
};
_a$i = Utf8String;
(() => {
	typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";
var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
	fromBuffer(inputBuffer) {
		this.valueBlock.value = Convert.ToUtf16String(inputBuffer);
		this.valueBlock.valueHexView = BufferSourceConverter.toUint8Array(inputBuffer);
	}
	fromString(inputString) {
		this.valueBlock.value = inputString;
		this.valueBlock.valueHexView = new Uint8Array(Convert.FromUtf16String(inputString));
	}
};
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
var _a$h;
var BmpString = class extends LocalBmpStringValueBlock {
	constructor({ ...parameters } = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 30;
	}
};
_a$h = BmpString;
(() => {
	typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";
var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
	fromBuffer(inputBuffer) {
		const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
		const valueView = new Uint8Array(copyBuffer);
		for (let i = 0; i < valueView.length; i += 4) {
			valueView[i] = valueView[i + 3];
			valueView[i + 1] = valueView[i + 2];
			valueView[i + 2] = 0;
			valueView[i + 3] = 0;
		}
		this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
	}
	fromString(inputString) {
		const strLength = inputString.length;
		const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
		for (let i = 0; i < strLength; i++) {
			const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
			const codeView = new Uint8Array(codeBuf);
			if (codeView.length > 4) continue;
			const dif = 4 - codeView.length;
			for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 4 + j + dif] = codeView[j];
		}
		this.valueBlock.value = inputString;
	}
};
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
var _a$g;
var UniversalString = class extends LocalUniversalStringValueBlock {
	constructor({ ...parameters } = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 28;
	}
};
_a$g = UniversalString;
(() => {
	typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";
var _a$f;
var NumericString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 18;
	}
};
_a$f = NumericString;
(() => {
	typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";
var _a$e;
var PrintableString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 19;
	}
};
_a$e = PrintableString;
(() => {
	typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";
var _a$d;
var TeletexString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 20;
	}
};
_a$d = TeletexString;
(() => {
	typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";
var _a$c;
var VideotexString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 21;
	}
};
_a$c = VideotexString;
(() => {
	typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";
var _a$b;
var IA5String = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 22;
	}
};
_a$b = IA5String;
(() => {
	typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";
var _a$a;
var GraphicString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 25;
	}
};
_a$a = GraphicString;
(() => {
	typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";
var _a$9;
var VisibleString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 26;
	}
};
_a$9 = VisibleString;
(() => {
	typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";
var _a$8;
var GeneralString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 27;
	}
};
_a$8 = GeneralString;
(() => {
	typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";
var _a$7;
var CharacterString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 29;
	}
};
_a$7 = CharacterString;
(() => {
	typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";
var _a$6;
var UTCTime = class extends VisibleString {
	constructor({ value, valueDate, ...parameters } = {}) {
		super(parameters);
		this.year = 0;
		this.month = 0;
		this.day = 0;
		this.hour = 0;
		this.minute = 0;
		this.second = 0;
		if (value) {
			this.fromString(value);
			this.valueBlock.valueHexView = new Uint8Array(value.length);
			for (let i = 0; i < value.length; i++) this.valueBlock.valueHexView[i] = value.charCodeAt(i);
		}
		if (valueDate) {
			this.fromDate(valueDate);
			this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
		}
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 23;
	}
	fromBuffer(inputBuffer) {
		this.fromString(String.fromCharCode.apply(null, BufferSourceConverter.toUint8Array(inputBuffer)));
	}
	toBuffer() {
		const str = this.toString();
		const buffer = new ArrayBuffer(str.length);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
		return buffer;
	}
	fromDate(inputDate) {
		this.year = inputDate.getUTCFullYear();
		this.month = inputDate.getUTCMonth() + 1;
		this.day = inputDate.getUTCDate();
		this.hour = inputDate.getUTCHours();
		this.minute = inputDate.getUTCMinutes();
		this.second = inputDate.getUTCSeconds();
	}
	toDate() {
		return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
	}
	fromString(inputString) {
		const parserArray = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/gi.exec(inputString);
		if (parserArray === null) {
			this.error = "Wrong input string for conversion";
			return;
		}
		const year = parseInt(parserArray[1], 10);
		if (year >= 50) this.year = 1900 + year;
		else this.year = 2e3 + year;
		this.month = parseInt(parserArray[2], 10);
		this.day = parseInt(parserArray[3], 10);
		this.hour = parseInt(parserArray[4], 10);
		this.minute = parseInt(parserArray[5], 10);
		this.second = parseInt(parserArray[6], 10);
	}
	toString(encoding = "iso") {
		if (encoding === "iso") {
			const outputArray = new Array(7);
			outputArray[0] = padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
			outputArray[1] = padNumber(this.month, 2);
			outputArray[2] = padNumber(this.day, 2);
			outputArray[3] = padNumber(this.hour, 2);
			outputArray[4] = padNumber(this.minute, 2);
			outputArray[5] = padNumber(this.second, 2);
			outputArray[6] = "Z";
			return outputArray.join("");
		}
		return super.toString(encoding);
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
	}
	toJSON() {
		return {
			...super.toJSON(),
			year: this.year,
			month: this.month,
			day: this.day,
			hour: this.hour,
			minute: this.minute,
			second: this.second
		};
	}
};
_a$6 = UTCTime;
(() => {
	typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";
var _a$5;
var GeneralizedTime = class extends UTCTime {
	constructor(parameters = {}) {
		var _b;
		super(parameters);
		(_b = this.millisecond) !== null && _b !== void 0 || (this.millisecond = 0);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 24;
	}
	fromDate(inputDate) {
		super.fromDate(inputDate);
		this.millisecond = inputDate.getUTCMilliseconds();
	}
	toDate() {
		const utcDate = Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond);
		return new Date(utcDate);
	}
	fromString(inputString) {
		let isUTC = false;
		let timeString = "";
		let dateTimeString = "";
		let fractionPart = 0;
		let parser;
		let hourDifference = 0;
		let minuteDifference = 0;
		if (inputString[inputString.length - 1] === "Z") {
			timeString = inputString.substring(0, inputString.length - 1);
			isUTC = true;
		} else {
			const number = new Number(inputString[inputString.length - 1]);
			if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
			timeString = inputString;
		}
		if (isUTC) {
			if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for conversion");
			if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for conversion");
		} else {
			let multiplier = 1;
			let differencePosition = timeString.indexOf("+");
			let differenceString = "";
			if (differencePosition === -1) {
				differencePosition = timeString.indexOf("-");
				multiplier = -1;
			}
			if (differencePosition !== -1) {
				differenceString = timeString.substring(differencePosition + 1);
				timeString = timeString.substring(0, differencePosition);
				if (differenceString.length !== 2 && differenceString.length !== 4) throw new Error("Wrong input string for conversion");
				let number = parseInt(differenceString.substring(0, 2), 10);
				if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
				hourDifference = multiplier * number;
				if (differenceString.length === 4) {
					number = parseInt(differenceString.substring(2, 4), 10);
					if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
					minuteDifference = multiplier * number;
				}
			}
		}
		let fractionPointPosition = timeString.indexOf(".");
		if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(",");
		if (fractionPointPosition !== -1) {
			const fractionPartCheck = /* @__PURE__ */ new Number(`0${timeString.substring(fractionPointPosition)}`);
			if (isNaN(fractionPartCheck.valueOf())) throw new Error("Wrong input string for conversion");
			fractionPart = fractionPartCheck.valueOf();
			dateTimeString = timeString.substring(0, fractionPointPosition);
		} else dateTimeString = timeString;
		switch (true) {
			case dateTimeString.length === 8:
				parser = /(\d{4})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) throw new Error("Wrong input string for conversion");
				break;
			case dateTimeString.length === 10:
				parser = /(\d{4})(\d{2})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) {
					let fractionResult = 60 * fractionPart;
					this.minute = Math.floor(fractionResult);
					fractionResult = 60 * (fractionResult - this.minute);
					this.second = Math.floor(fractionResult);
					fractionResult = 1e3 * (fractionResult - this.second);
					this.millisecond = Math.floor(fractionResult);
				}
				break;
			case dateTimeString.length === 12:
				parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) {
					let fractionResult = 60 * fractionPart;
					this.second = Math.floor(fractionResult);
					fractionResult = 1e3 * (fractionResult - this.second);
					this.millisecond = Math.floor(fractionResult);
				}
				break;
			case dateTimeString.length === 14:
				parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) {
					const fractionResult = 1e3 * fractionPart;
					this.millisecond = Math.floor(fractionResult);
				}
				break;
			default: throw new Error("Wrong input string for conversion");
		}
		const parserArray = parser.exec(dateTimeString);
		if (parserArray === null) throw new Error("Wrong input string for conversion");
		for (let j = 1; j < parserArray.length; j++) switch (j) {
			case 1:
				this.year = parseInt(parserArray[j], 10);
				break;
			case 2:
				this.month = parseInt(parserArray[j], 10);
				break;
			case 3:
				this.day = parseInt(parserArray[j], 10);
				break;
			case 4:
				this.hour = parseInt(parserArray[j], 10) + hourDifference;
				break;
			case 5:
				this.minute = parseInt(parserArray[j], 10) + minuteDifference;
				break;
			case 6:
				this.second = parseInt(parserArray[j], 10);
				break;
			default: throw new Error("Wrong input string for conversion");
		}
		if (isUTC === false) {
			const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
			this.year = tempDate.getUTCFullYear();
			this.month = tempDate.getUTCMonth();
			this.day = tempDate.getUTCDay();
			this.hour = tempDate.getUTCHours();
			this.minute = tempDate.getUTCMinutes();
			this.second = tempDate.getUTCSeconds();
			this.millisecond = tempDate.getUTCMilliseconds();
		}
	}
	toString(encoding = "iso") {
		if (encoding === "iso") {
			const outputArray = [];
			outputArray.push(padNumber(this.year, 4));
			outputArray.push(padNumber(this.month, 2));
			outputArray.push(padNumber(this.day, 2));
			outputArray.push(padNumber(this.hour, 2));
			outputArray.push(padNumber(this.minute, 2));
			outputArray.push(padNumber(this.second, 2));
			if (this.millisecond !== 0) {
				outputArray.push(".");
				outputArray.push(padNumber(this.millisecond, 3));
			}
			outputArray.push("Z");
			return outputArray.join("");
		}
		return super.toString(encoding);
	}
	toJSON() {
		return {
			...super.toJSON(),
			millisecond: this.millisecond
		};
	}
};
_a$5 = GeneralizedTime;
(() => {
	typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";
var _a$4;
var DATE = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 31;
	}
};
_a$4 = DATE;
(() => {
	typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";
var _a$3;
var TimeOfDay = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 32;
	}
};
_a$3 = TimeOfDay;
(() => {
	typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";
var _a$2;
var DateTime = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 33;
	}
};
_a$2 = DateTime;
(() => {
	typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";
var _a$1;
var Duration = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 34;
	}
};
_a$1 = Duration;
(() => {
	typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";
var _a;
var TIME = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 14;
	}
};
_a = TIME;
(() => {
	typeStore.TIME = _a;
})();
TIME.NAME = "TIME";
var Any = class {
	constructor({ name = EMPTY_STRING, optional = false } = {}) {
		this.name = name;
		this.optional = optional;
	}
};
var Choice = class extends Any {
	constructor({ value = [], ...parameters } = {}) {
		super(parameters);
		this.value = value;
	}
};
var Repeated = class extends Any {
	constructor({ value = new Any(), local = false, ...parameters } = {}) {
		super(parameters);
		this.value = value;
		this.local = local;
	}
};
var RawData = class {
	get data() {
		return this.dataView.slice().buffer;
	}
	set data(value) {
		this.dataView = BufferSourceConverter.toUint8Array(value);
	}
	constructor({ data = EMPTY_VIEW } = {}) {
		this.dataView = BufferSourceConverter.toUint8Array(data);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const endLength = inputOffset + inputLength;
		this.dataView = BufferSourceConverter.toUint8Array(inputBuffer).subarray(inputOffset, endLength);
		return endLength;
	}
	toBER(_sizeOnly) {
		return this.dataView.slice().buffer;
	}
};
function compareSchema(root, inputData, inputSchema) {
	if (inputSchema instanceof Choice) {
		for (const element of inputSchema.value) if (compareSchema(root, inputData, element).verified) return {
			verified: true,
			result: root
		};
		{
			const _result = {
				verified: false,
				result: { error: "Wrong values for Choice type" }
			};
			if (inputSchema.hasOwnProperty(NAME)) _result.name = inputSchema.name;
			return _result;
		}
	}
	if (inputSchema instanceof Any) {
		if (inputSchema.hasOwnProperty(NAME)) root[inputSchema.name] = inputData;
		return {
			verified: true,
			result: root
		};
	}
	if (root instanceof Object === false) return {
		verified: false,
		result: { error: "Wrong root object" }
	};
	if (inputData instanceof Object === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 data" }
	};
	if (inputSchema instanceof Object === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (ID_BLOCK in inputSchema === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (FROM_BER in inputSchema.idBlock === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (TO_BER in inputSchema.idBlock === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	const encodedId = inputSchema.idBlock.toBER(false);
	if (encodedId.byteLength === 0) return {
		verified: false,
		result: { error: "Error encoding idBlock for ASN.1 schema" }
	};
	if (inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength) === -1) return {
		verified: false,
		result: { error: "Error decoding idBlock for ASN.1 schema" }
	};
	if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) return {
		verified: false,
		result: root
	};
	if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) return {
		verified: false,
		result: root
	};
	if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) return {
		verified: false,
		result: root
	};
	if (!(IS_HEX_ONLY in inputSchema.idBlock)) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema" }
	};
	if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) return {
		verified: false,
		result: root
	};
	if (inputSchema.idBlock.isHexOnly) {
		if (VALUE_HEX_VIEW in inputSchema.idBlock === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		const schemaView = inputSchema.idBlock.valueHexView;
		const asn1View = inputData.idBlock.valueHexView;
		if (schemaView.length !== asn1View.length) return {
			verified: false,
			result: root
		};
		for (let i = 0; i < schemaView.length; i++) if (schemaView[i] !== asn1View[1]) return {
			verified: false,
			result: root
		};
	}
	if (inputSchema.name) {
		inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
		if (inputSchema.name) root[inputSchema.name] = inputData;
	}
	if (inputSchema instanceof typeStore.Constructed) {
		let admission = 0;
		let result = {
			verified: false,
			result: { error: "Unknown error" }
		};
		let maxLength = inputSchema.valueBlock.value.length;
		if (maxLength > 0) {
			if (inputSchema.valueBlock.value[0] instanceof Repeated) maxLength = inputData.valueBlock.value.length;
		}
		if (maxLength === 0) return {
			verified: true,
			result: root
		};
		if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
			let _optional = true;
			for (let i = 0; i < inputSchema.valueBlock.value.length; i++) _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
			if (_optional) return {
				verified: true,
				result: root
			};
			if (inputSchema.name) {
				inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
				if (inputSchema.name) delete root[inputSchema.name];
			}
			root.error = "Inconsistent object length";
			return {
				verified: false,
				result: root
			};
		}
		for (let i = 0; i < maxLength; i++) if (i - admission >= inputData.valueBlock.value.length) {
			if (inputSchema.valueBlock.value[i].optional === false) {
				const _result = {
					verified: false,
					result: root
				};
				root.error = "Inconsistent length between ASN.1 data and schema";
				if (inputSchema.name) {
					inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
					if (inputSchema.name) {
						delete root[inputSchema.name];
						_result.name = inputSchema.name;
					}
				}
				return _result;
			}
		} else if (inputSchema.valueBlock.value[0] instanceof Repeated) {
			result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);
			if (result.verified === false) if (inputSchema.valueBlock.value[0].optional) admission++;
			else {
				if (inputSchema.name) {
					inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
					if (inputSchema.name) delete root[inputSchema.name];
				}
				return result;
			}
			if (NAME in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
				let arrayRoot = {};
				if (LOCAL in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local) arrayRoot = inputData;
				else arrayRoot = root;
				if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined") arrayRoot[inputSchema.valueBlock.value[0].name] = [];
				arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
			}
		} else {
			result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);
			if (result.verified === false) if (inputSchema.valueBlock.value[i].optional) admission++;
			else {
				if (inputSchema.name) {
					inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
					if (inputSchema.name) delete root[inputSchema.name];
				}
				return result;
			}
		}
		if (result.verified === false) {
			const _result = {
				verified: false,
				result: root
			};
			if (inputSchema.name) {
				inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
				if (inputSchema.name) {
					delete root[inputSchema.name];
					_result.name = inputSchema.name;
				}
			}
			return _result;
		}
		return {
			verified: true,
			result: root
		};
	}
	if (inputSchema.primitiveSchema && VALUE_HEX_VIEW in inputData.valueBlock) {
		const asn1 = localFromBER(inputData.valueBlock.valueHexView);
		if (asn1.offset === -1) {
			const _result = {
				verified: false,
				result: asn1.result
			};
			if (inputSchema.name) {
				inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
				if (inputSchema.name) {
					delete root[inputSchema.name];
					_result.name = inputSchema.name;
				}
			}
			return _result;
		}
		return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
	}
	return {
		verified: true,
		result: root
	};
}
function verifySchema(inputBuffer, inputSchema) {
	if (inputSchema instanceof Object === false) return {
		verified: false,
		result: { error: "Wrong ASN.1 schema type" }
	};
	const asn1 = localFromBER(BufferSourceConverter.toUint8Array(inputBuffer));
	if (asn1.offset === -1) return {
		verified: false,
		result: asn1.result
	};
	return compareSchema(asn1.result, asn1.result, inputSchema);
}
//#endregion
//#region node_modules/@peculiar/utils/build/esm/bytes/buffer-source.js
var ARRAY_BUFFER_TAG = "[object ArrayBuffer]";
var SHARED_ARRAY_BUFFER_TAG = "[object SharedArrayBuffer]";
function tagOf(value) {
	return Object.prototype.toString.call(value);
}
function isArrayBufferViewLike(value) {
	if (ArrayBuffer.isView(value)) return true;
	if (!value || typeof value !== "object") return false;
	const view = value;
	return typeof view.byteOffset === "number" && typeof view.byteLength === "number" && isArrayBufferLike(view.buffer);
}
function isArrayBuffer(value) {
	return tagOf(value) === ARRAY_BUFFER_TAG;
}
function isSharedArrayBuffer(value) {
	return typeof SharedArrayBuffer !== "undefined" && tagOf(value) === SHARED_ARRAY_BUFFER_TAG;
}
function isArrayBufferLike(value) {
	return isArrayBuffer(value) || isSharedArrayBuffer(value);
}
function isArrayBufferView(value) {
	return isArrayBufferViewLike(value);
}
function isBufferSource(value) {
	return isArrayBufferLike(value) || isArrayBufferView(value);
}
function assertBufferSource(value) {
	if (!isBufferSource(value)) throw new TypeError("Expected ArrayBuffer, SharedArrayBuffer, or ArrayBufferView");
}
function toUint8Array(data) {
	assertBufferSource(data);
	if (isArrayBufferLike(data)) return new Uint8Array(data);
	return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}
function toArrayBuffer(data) {
	assertBufferSource(data);
	if (isArrayBuffer(data)) return data;
	const buffer = new ArrayBuffer(data.byteLength);
	new Uint8Array(buffer).set(toUint8Array(data));
	return buffer;
}
//#endregion
//#region node_modules/@peculiar/utils/build/esm/encoding/binary.js
function encode$7(data) {
	const bytes = toUint8Array(data);
	let result = "";
	for (const byte of bytes) result += String.fromCharCode(byte);
	return result;
}
function decode$7(text) {
	const result = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) result[i] = text.charCodeAt(i) & 255;
	return result;
}
function is$3(text) {
	return typeof text === "string";
}
//#endregion
//#region node_modules/@peculiar/utils/build/esm/encoding/hex.js
var HEX_CHARACTER_REGEX = /^[0-9a-f]$/i;
var COMMON_SEPARATORS = [
	" ",
	"	",
	"\n",
	"\r",
	":",
	"-",
	"."
];
function resolveSeparators(options) {
	if (options.separators === "none") return [];
	if (!options.separators || options.separators === "common") return COMMON_SEPARATORS;
	return options.separators;
}
function validateSeparator(separator) {
	if (!separator) throw new TypeError("Hex separators must be non-empty strings");
}
function matchSeparator(text, index, separators) {
	for (const separator of separators) if (text.startsWith(separator, index)) return separator;
}
function detectCase(text) {
	const hasUpper = /[A-F]/.test(text);
	const hasLower = /[a-f]/.test(text);
	return hasUpper && !hasLower ? "upper" : "lower";
}
function detectLineSeparator(text) {
	const match = /\r\n|\n/.exec(text);
	if (!match) return;
	return match[0] === "\r\n" ? "\r\n" : "\n";
}
function compactForDetection(text) {
	return text.replace(/[^0-9a-f]/gi, "");
}
function detectGroup(text) {
	const segments = text.match(/[0-9A-Fa-f]+|[^0-9A-Fa-f]+/g) ?? [];
	if (segments.length < 3) return;
	const hexSegments = segments.filter((_, index) => index % 2 === 0);
	const separators = segments.filter((_, index) => index % 2 === 1);
	const separator = separators[0];
	if (!separator || separators.some((item) => item !== separator)) return;
	if (hexSegments.some((segment) => segment.length === 0 || segment.length % 2 !== 0)) return;
	const firstLength = hexSegments[0]?.length ?? 0;
	if (!firstLength) return;
	if (hexSegments.slice(0, -1).some((segment) => segment.length !== firstLength)) return;
	if ((hexSegments[hexSegments.length - 1]?.length ?? 0) > firstLength) return;
	return {
		size: firstLength / 2,
		separator
	};
}
function detectFormat(text) {
	const trimmed = text.trim();
	const prefix = /^0x/i.test(trimmed) ? "0x" : "";
	const body = prefix ? trimmed.slice(2) : trimmed;
	const lineSeparator = detectLineSeparator(body);
	const lines = body.split(/\r\n|\n/).filter((line) => line.length > 0);
	const group = detectGroup(lines[0]?.trim() ?? "");
	const format = {
		case: detectCase(trimmed),
		prefix
	};
	if (group) format.group = group;
	if (lineSeparator && lines.length > 1) {
		const firstLineBytes = compactForDetection(lines[0] ?? "").length / 2;
		if (firstLineBytes > 0 && lines.slice(0, -1).every((line) => compactForDetection(line).length / 2 === firstLineBytes)) format.line = {
			bytesPerLine: firstLineBytes,
			separator: lineSeparator
		};
	}
	return format;
}
function normalizeText(text, options) {
	const allowPrefix = options.allowPrefix ?? true;
	const separators = [...resolveSeparators(options)].sort((left, right) => right.length - left.length);
	for (const separator of separators) validateSeparator(separator);
	let working = text.trim();
	if (/^0x/i.test(working)) {
		if (!allowPrefix) throw new TypeError("Hexadecimal text must not include a 0x prefix");
		working = working.slice(2);
	}
	let normalized = "";
	let lastTokenWasSeparator = false;
	for (let index = 0; index < working.length;) {
		const character = working[index] ?? "";
		if (HEX_CHARACTER_REGEX.test(character)) {
			normalized += character;
			lastTokenWasSeparator = false;
			index += 1;
			continue;
		}
		const separator = matchSeparator(working, index, separators);
		if (!separator) throw new TypeError("Input is not valid hexadecimal text");
		if (options.strict && (lastTokenWasSeparator || normalized.length === 0)) throw new TypeError("Hexadecimal text contains misplaced separators");
		lastTokenWasSeparator = true;
		index += separator.length;
	}
	if (options.strict && lastTokenWasSeparator && normalized.length > 0) throw new TypeError("Hexadecimal text must not end with a separator");
	if (normalized.length % 2 !== 0) {
		if (!options.allowOddLength) throw new TypeError("Hexadecimal text must contain an even number of characters");
		normalized = `0${normalized}`;
	}
	return normalized.toLowerCase();
}
function groupPairs(pairs, group) {
	if (!group) return pairs.join("");
	if (!Number.isInteger(group.size) || group.size < 1) throw new RangeError("Hex group size must be a positive integer");
	const chunks = [];
	for (let index = 0; index < pairs.length; index += group.size) chunks.push(pairs.slice(index, index + group.size).join(""));
	return chunks.join(group.separator);
}
function normalize$3(text, options = {}) {
	return normalizeText(text, options);
}
function is$2(text, options = {}) {
	if (typeof text !== "string") return false;
	try {
		normalize$3(text, options);
		return true;
	} catch {
		return false;
	}
}
function encode$6(data, options = {}) {
	const bytes = toUint8Array(data);
	const casing = options.case ?? "lower";
	const pairs = Array.from(bytes, (byte) => {
		const text = byte.toString(16).padStart(2, "0");
		return casing === "upper" ? text.toUpperCase() : text;
	});
	let body = "";
	if (options.line) {
		const bytesPerLine = options.line.bytesPerLine;
		if (!Number.isInteger(bytesPerLine) || bytesPerLine < 1) throw new RangeError("Hex bytesPerLine must be a positive integer");
		const separator = options.line.separator ?? "\n";
		const lines = [];
		for (let index = 0; index < pairs.length; index += bytesPerLine) lines.push(groupPairs(pairs.slice(index, index + bytesPerLine), options.group));
		body = lines.join(separator);
	} else body = groupPairs(pairs, options.group);
	return `${options.prefix ?? ""}${body}`;
}
function decode$6(text, options = {}) {
	const normalized = normalize$3(text, options);
	const result = new Uint8Array(normalized.length / 2);
	for (let i = 0; i < normalized.length; i += 2) result[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
	return result;
}
function parse$2(text, options = {}) {
	const normalized = normalize$3(text, options);
	return {
		bytes: decode$6(normalized),
		format: detectFormat(text),
		normalized
	};
}
function format$2(data, value) {
	return encode$6(data, value);
}
Object.freeze({}), Object.freeze({ case: "upper" }), Object.freeze({ group: {
	size: 1,
	separator: ":"
} }), Object.freeze({
	case: "upper",
	group: {
		size: 1,
		separator: ":"
	}
}), Object.freeze({ group: {
	size: 4,
	separator: " "
} }), Object.freeze({ prefix: "0x" });
//#endregion
//#region node_modules/@peculiar/utils/build/esm/encoding/utf8.js
function encode$5(text) {
	return new TextEncoder().encode(text);
}
function decode$5(data) {
	return new TextDecoder("utf-8", { fatal: false }).decode(toUint8Array(data));
}
//#endregion
//#region node_modules/@peculiar/utils/build/esm/encoding/utf16.js
function encode$4(text, options = {}) {
	const result = /* @__PURE__ */ new ArrayBuffer(text.length * 2);
	const view = new DataView(result);
	for (let i = 0; i < text.length; i++) view.setUint16(i * 2, text.charCodeAt(i), options.littleEndian ?? false);
	return new Uint8Array(result);
}
function decode$4(data, options = {}) {
	const buffer = toArrayBuffer(data);
	const view = new DataView(buffer);
	let result = "";
	for (let i = 0; i < buffer.byteLength; i += 2) result += String.fromCharCode(view.getUint16(i, options.littleEndian ?? false));
	return result;
}
//#endregion
//#region node_modules/@peculiar/utils/build/esm/encoding/base64.js
var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
function nodeBuffer() {
	return globalThis.Buffer;
}
function normalize$2(text) {
	return text.replace(/[\n\r\t ]/g, "");
}
function pad(text) {
	const remainder = text.length % 4;
	return remainder ? text + "=".repeat(4 - remainder) : text;
}
function is$1(text) {
	if (typeof text !== "string") return false;
	const normalized = normalize$2(text);
	return normalized === "" || BASE64_REGEX.test(normalized);
}
function encode$3(data, _options) {
	const bytes = toUint8Array(data);
	const buffer = nodeBuffer();
	if (buffer) return buffer.from(bytes).toString("base64");
	return btoa(encode$7(bytes));
}
function decode$3(text, _options) {
	const normalized = normalize$2(text);
	if (!is$1(normalized)) throw new TypeError("Input is not valid Base64 text");
	const buffer = nodeBuffer();
	if (buffer) return new Uint8Array(buffer.from(normalized, "base64"));
	return decode$7(atob(normalized));
}
var base64 = {
	encode: encode$3,
	decode: decode$3,
	is: is$1,
	normalize: normalize$2,
	pad
};
//#endregion
//#region node_modules/@peculiar/utils/build/esm/encoding/base64url.js
var BASE64URL_REGEX = /^[A-Za-z0-9_-]*$/;
function normalize$1(text) {
	return text.replace(/[\n\r\t ]/g, "");
}
function is(text) {
	return typeof text === "string" && BASE64URL_REGEX.test(normalize$1(text));
}
function encode$2(data, _options) {
	return base64.encode(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function decode$2(text, _options) {
	const normalized = normalize$1(text);
	if (!is(normalized)) throw new TypeError("Input is not valid Base64Url text");
	return base64.decode(base64.pad(normalized.replace(/-/g, "+").replace(/_/g, "/")));
}
//#endregion
//#region node_modules/@peculiar/utils/build/esm/pem/pem.js
var LABEL_REGEX = /^[A-Z0-9][A-Z0-9 ._-]*[A-Z0-9]$/i;
var PEM_BLOCK_REGEX = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g;
function assertLabel(label) {
	if (!LABEL_REGEX.test(label)) throw new TypeError(`Invalid PEM label '${label}'`);
}
function wrap(text, lineLength) {
	const result = [];
	for (let i = 0; i < text.length; i += lineLength) result.push(text.slice(i, i + lineLength));
	return result;
}
function parseBody(body) {
	const lines = body.trim().replace(/\r\n/g, "\n").split("\n").map((line) => line.trim()).filter(Boolean);
	const headers = {};
	let index = 0;
	for (; index < lines.length; index++) {
		const line = lines[index];
		const separator = line.indexOf(":");
		if (separator <= 0) break;
		headers[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
	}
	return {
		headers: Object.keys(headers).length ? headers : void 0,
		base64Lines: lines.slice(index),
		base64Text: lines.slice(index).join("")
	};
}
function detectNewline(text) {
	return /\r\n/.test(text) ? "\r\n" : "\n";
}
function collectBlocks(text, options = {}) {
	const blocks = [];
	const requestedLabel = options.label;
	let match;
	PEM_BLOCK_REGEX.lastIndex = 0;
	while (match = PEM_BLOCK_REGEX.exec(text)) {
		const label = match[1].trim();
		if (requestedLabel && label !== requestedLabel) continue;
		assertLabel(label);
		const parsed = parseBody(match[2]);
		blocks.push({
			label,
			data: base64.decode(parsed.base64Text),
			headers: parsed.headers,
			lineLength: parsed.base64Lines[0]?.length ?? 64,
			newline: detectNewline(match[0])
		});
	}
	if (options.strict && blocks.length === 0) throw new TypeError(requestedLabel ? `No PEM block with label '${requestedLabel}' was found` : "No PEM blocks were found");
	return blocks;
}
function encode$1(label, data, options = {}) {
	assertLabel(label);
	const lineLength = options.lineLength ?? 64;
	if (!Number.isInteger(lineLength) || lineLength < 1) throw new RangeError("PEM lineLength must be a positive integer");
	const newline = options.newline ?? "\n";
	const lines = [`-----BEGIN ${label}-----`];
	if (options.headers) {
		for (const [name, value] of Object.entries(options.headers)) lines.push(`${name}: ${value}`);
		lines.push("");
	}
	lines.push(...wrap(base64.encode(data), lineLength));
	lines.push(`-----END ${label}-----`);
	return `${lines.join(newline)}${newline}`;
}
function decode$1(text, options = {}) {
	return collectBlocks(text, options).map(({ lineLength: _lineLength, newline: _newline, ...block }) => block);
}
function decodeFirst(text, label) {
	const [block] = decode$1(text, {
		label,
		strict: true
	});
	return block.data;
}
function parse$1(text, options = {}) {
	const [block] = collectBlocks(text, {
		...options,
		strict: true
	});
	const format = {
		label: block.label,
		headers: block.headers,
		lineLength: block.lineLength,
		newline: block.newline
	};
	return {
		bytes: block.data,
		format,
		normalized: encode$1(block.label, block.data, format)
	};
}
function format$1(data, value) {
	return encode$1(value.label, data, value);
}
var pemConverter = {
	name: "pem",
	encode: (data, options) => {
		if (!options?.label) throw new TypeError("PEM label is required");
		return encode$1(options.label, data, options);
	},
	decode: (text, options) => decodeFirst(text, options?.label),
	format: format$1,
	is: (text) => typeof text === "string" && /-----BEGIN [^-]+-----/.test(text),
	parse: parse$1
};
//#endregion
//#region node_modules/@peculiar/utils/build/esm/converters/registry.js
function keyOf(name) {
	return name.trim().toLowerCase();
}
function toError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function removeConverter(converters, primaryNames, converter) {
	for (const alias of [converter.name, ...converter.aliases ?? []]) converters.delete(keyOf(alias));
	primaryNames.delete(keyOf(converter.name));
}
function requireCapability(converter, name, capability) {
	const method = converter[capability];
	if (typeof method !== "function") throw new Error(`Converter '${name}' does not support ${capability}()`);
	return method;
}
function detectConfidence(name, text, converter) {
	const normalizedName = keyOf(converter.name || name);
	const trimmed = text.trim();
	if (!trimmed) return 0;
	let accepted = false;
	if (converter.is) accepted = converter.is(text);
	let decodable = false;
	try {
		converter.decode(text);
		decodable = true;
	} catch {
		decodable = false;
	}
	if (!accepted && !decodable) return 0;
	switch (normalizedName) {
		case "pem": return /-----BEGIN [^-]+-----/.test(text) ? 1 : 0;
		case "hex": {
			const compact = trimmed.replace(/^0x/i, "").replace(/[\s:.-]/g, "");
			if (!compact || /[^0-9a-f]/i.test(compact) || compact.length % 2 !== 0) return 0;
			if (/^0x/i.test(trimmed) || /[:\s.-]/.test(trimmed)) return .95;
			if (/[a-f]/.test(trimmed) || /[A-F]/.test(trimmed)) return .8;
			return .45;
		}
		case "base64url":
			if (/[-_]/.test(trimmed)) return .95;
			if (/=/.test(trimmed)) return .1;
			return .6;
		case "base64":
			if (/[+/=]/.test(trimmed)) return .9;
			return .55;
		case "binary":
		case "utf8":
		case "utf16be":
		case "utf16le": return 0;
		default: return accepted && decodable ? .75 : .5;
	}
}
function createConverterRegistry(initialConverters = []) {
	const converters = /* @__PURE__ */ new Map();
	const primaryNames = /* @__PURE__ */ new Set();
	const api = {
		register(converter, options = {}) {
			if (!converter.name || !keyOf(converter.name)) throw new TypeError("Converter name is required");
			const names = [...new Set([converter.name, ...converter.aliases ?? []].map(keyOf))];
			const conflicts = /* @__PURE__ */ new Set();
			for (const name of names) {
				const existing = converters.get(name);
				if (!existing) continue;
				if (!options.override) throw new Error(`Converter '${name}' is already registered`);
				conflicts.add(existing);
			}
			for (const conflicting of conflicts) removeConverter(converters, primaryNames, conflicting);
			for (const name of names) converters.set(name, converter);
			primaryNames.add(keyOf(converter.name));
			return this;
		},
		unregister(name) {
			const converter = converters.get(keyOf(name));
			if (!converter) return false;
			removeConverter(converters, primaryNames, converter);
			return true;
		},
		has(name) {
			return converters.has(keyOf(name));
		},
		get(name) {
			const converter = converters.get(keyOf(name));
			if (!converter) throw new Error(`Converter '${name}' is not registered`);
			return converter;
		},
		list() {
			return [...primaryNames].map((name) => this.get(name));
		},
		encode(name, data, options) {
			return this.get(name).encode(data, options);
		},
		decode(name, text, options) {
			return this.get(name).decode(text, options);
		},
		tryDecode(name, text, options) {
			try {
				return {
					ok: true,
					bytes: this.decode(name, text, options)
				};
			} catch (error) {
				return {
					ok: false,
					error: toError(error)
				};
			}
		},
		normalize(name, text, options) {
			const converter = this.get(name);
			return requireCapability(converter, name, "normalize").call(converter, text, options);
		},
		parse(name, text, options) {
			const converter = this.get(name);
			return requireCapability(converter, name, "parse").call(converter, text, options);
		},
		format(name, data, format) {
			const converter = this.get(name);
			return requireCapability(converter, name, "format").call(converter, data, format);
		},
		transcode(text, options) {
			const bytes = this.decode(options.from, text, options.fromOptions);
			return this.encode(options.to, bytes, options.toOptions);
		},
		detect(text, options = {}) {
			const formatNames = options.formats?.length ? options.formats.map((name) => String(name)) : this.list().map((converter) => converter.name).filter((name) => ![
				"binary",
				"utf8",
				"utf16be",
				"utf16le"
			].includes(keyOf(name)));
			const detections = /* @__PURE__ */ new Map();
			for (const requestedName of formatNames) {
				const converter = this.get(requestedName);
				const confidence = detectConfidence(requestedName, text, converter);
				if (confidence <= 0) continue;
				const format = converter.name;
				const current = detections.get(format);
				if (!current || confidence > current.confidence) detections.set(format, {
					format,
					confidence
				});
			}
			return [...detections.values()].sort((left, right) => right.confidence - left.confidence);
		}
	};
	for (const converter of initialConverters) api.register(converter);
	return api;
}
createConverterRegistry([
	{
		name: "binary",
		aliases: ["latin1"],
		encode: encode$7,
		decode: decode$7,
		is: is$3
	},
	{
		name: "hex",
		encode: encode$6,
		decode: decode$6,
		format: format$2,
		is: is$2,
		normalize: normalize$3,
		parse: parse$2
	},
	{
		name: "base64",
		aliases: ["b64"],
		encode: encode$3,
		decode: decode$3,
		is: is$1,
		normalize: normalize$2
	},
	{
		name: "base64url",
		aliases: ["base64-url", "b64url"],
		encode: encode$2,
		decode: decode$2,
		is,
		normalize: normalize$1
	},
	{
		name: "utf8",
		aliases: ["utf-8"],
		encode: (data) => decode$5(data),
		decode: (text) => encode$5(text),
		is: (text) => typeof text === "string"
	},
	{
		name: "utf16be",
		aliases: [
			"utf16",
			"utf-16",
			"utf-16be"
		],
		encode: (data) => decode$4(data),
		decode: (text) => encode$4(text),
		is: (text) => typeof text === "string"
	},
	{
		name: "utf16le",
		aliases: [
			"utf-16le",
			"ucs2",
			"usc2"
		],
		encode: (data) => decode$4(data, { littleEndian: true }),
		decode: (text) => encode$4(text, { littleEndian: true }),
		is: (text) => typeof text === "string"
	},
	pemConverter
]);
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/enums.js
var AsnTypeTypes;
(function(AsnTypeTypes) {
	AsnTypeTypes[AsnTypeTypes["Sequence"] = 0] = "Sequence";
	AsnTypeTypes[AsnTypeTypes["Set"] = 1] = "Set";
	AsnTypeTypes[AsnTypeTypes["Choice"] = 2] = "Choice";
})(AsnTypeTypes || (AsnTypeTypes = {}));
var AsnPropTypes;
(function(AsnPropTypes) {
	AsnPropTypes[AsnPropTypes["Any"] = 1] = "Any";
	AsnPropTypes[AsnPropTypes["Boolean"] = 2] = "Boolean";
	AsnPropTypes[AsnPropTypes["OctetString"] = 3] = "OctetString";
	AsnPropTypes[AsnPropTypes["BitString"] = 4] = "BitString";
	AsnPropTypes[AsnPropTypes["Integer"] = 5] = "Integer";
	AsnPropTypes[AsnPropTypes["Enumerated"] = 6] = "Enumerated";
	AsnPropTypes[AsnPropTypes["ObjectIdentifier"] = 7] = "ObjectIdentifier";
	AsnPropTypes[AsnPropTypes["Utf8String"] = 8] = "Utf8String";
	AsnPropTypes[AsnPropTypes["BmpString"] = 9] = "BmpString";
	AsnPropTypes[AsnPropTypes["UniversalString"] = 10] = "UniversalString";
	AsnPropTypes[AsnPropTypes["NumericString"] = 11] = "NumericString";
	AsnPropTypes[AsnPropTypes["PrintableString"] = 12] = "PrintableString";
	AsnPropTypes[AsnPropTypes["TeletexString"] = 13] = "TeletexString";
	AsnPropTypes[AsnPropTypes["VideotexString"] = 14] = "VideotexString";
	AsnPropTypes[AsnPropTypes["IA5String"] = 15] = "IA5String";
	AsnPropTypes[AsnPropTypes["GraphicString"] = 16] = "GraphicString";
	AsnPropTypes[AsnPropTypes["VisibleString"] = 17] = "VisibleString";
	AsnPropTypes[AsnPropTypes["GeneralString"] = 18] = "GeneralString";
	AsnPropTypes[AsnPropTypes["CharacterString"] = 19] = "CharacterString";
	AsnPropTypes[AsnPropTypes["UTCTime"] = 20] = "UTCTime";
	AsnPropTypes[AsnPropTypes["GeneralizedTime"] = 21] = "GeneralizedTime";
	AsnPropTypes[AsnPropTypes["DATE"] = 22] = "DATE";
	AsnPropTypes[AsnPropTypes["TimeOfDay"] = 23] = "TimeOfDay";
	AsnPropTypes[AsnPropTypes["DateTime"] = 24] = "DateTime";
	AsnPropTypes[AsnPropTypes["Duration"] = 25] = "Duration";
	AsnPropTypes[AsnPropTypes["TIME"] = 26] = "TIME";
	AsnPropTypes[AsnPropTypes["Null"] = 27] = "Null";
	AsnPropTypes[AsnPropTypes["RelativeObjectIdentifier"] = 28] = "RelativeObjectIdentifier";
})(AsnPropTypes || (AsnPropTypes = {}));
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/types/bit_string.js
var BitString = class {
	unusedBits = 0;
	value = /* @__PURE__ */ new ArrayBuffer(0);
	constructor(params, unusedBits = 0) {
		if (params) if (typeof params === "number") this.fromNumber(params);
		else if (isBufferSource(params)) {
			this.unusedBits = unusedBits;
			this.value = toArrayBuffer(params);
		} else throw TypeError("Unsupported type of 'params' argument for BitString");
	}
	fromASN(asn) {
		if (!(asn instanceof BitString$1)) throw new TypeError("Argument 'asn' is not instance of ASN.1 BitString");
		this.unusedBits = asn.valueBlock.unusedBits;
		this.value = toArrayBuffer(asn.valueBlock.valueHex);
		return this;
	}
	toASN() {
		return new BitString$1({
			unusedBits: this.unusedBits,
			valueHex: this.value
		});
	}
	toSchema(name) {
		return new BitString$1({ name });
	}
	toNumber() {
		let res = "";
		const uintArray = new Uint8Array(this.value);
		for (const octet of uintArray) res += octet.toString(2).padStart(8, "0");
		res = res.split("").reverse().join("");
		if (this.unusedBits) res = res.slice(this.unusedBits).padStart(this.unusedBits, "0");
		return parseInt(res, 2);
	}
	fromNumber(value) {
		let bits = value.toString(2);
		const octetSize = bits.length + 7 >> 3;
		this.unusedBits = (octetSize << 3) - bits.length;
		const octets = new Uint8Array(octetSize);
		bits = bits.padStart(octetSize << 3, "0").split("").reverse().join("");
		let index = 0;
		while (index < octetSize) {
			octets[index] = parseInt(bits.slice(index << 3, (index << 3) + 8), 2);
			index++;
		}
		this.value = octets.buffer;
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/types/octet_string.js
var OctetString = class {
	buffer;
	get byteLength() {
		return this.buffer.byteLength;
	}
	get byteOffset() {
		return 0;
	}
	constructor(param) {
		if (typeof param === "number") this.buffer = new ArrayBuffer(param);
		else if (isBufferSource(param)) this.buffer = toArrayBuffer(param);
		else if (Array.isArray(param)) this.buffer = new Uint8Array(param).buffer;
		else this.buffer = /* @__PURE__ */ new ArrayBuffer(0);
	}
	fromASN(asn) {
		if (!(asn instanceof OctetString$1)) throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
		this.buffer = toArrayBuffer(asn.valueBlock.valueHex);
		return this;
	}
	toASN() {
		return new OctetString$1({ valueHex: this.buffer });
	}
	toSchema(name) {
		return new OctetString$1({ name });
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/converters.js
var AsnAnyConverter = {
	fromASN: (value) => value instanceof Null ? null : toArrayBuffer(value.valueBeforeDecodeView),
	toASN: (value) => {
		if (value === null) return new Null();
		const schema = fromBER(value);
		if (schema.result.error) throw new Error(schema.result.error);
		return schema.result;
	}
};
var AsnIntegerConverter = {
	fromASN: (value) => value.valueBlock.valueHexView.byteLength >= 4 ? value.valueBlock.toString() : value.valueBlock.valueDec,
	toASN: (value) => new Integer({ value: +value })
};
var AsnEnumeratedConverter = {
	fromASN: (value) => value.valueBlock.valueDec,
	toASN: (value) => new Enumerated({ value })
};
var AsnIntegerArrayBufferConverter = {
	fromASN: (value) => toArrayBuffer(value.valueBlock.valueHexView),
	toASN: (value) => new Integer({ valueHex: value })
};
var AsnBitStringConverter = {
	fromASN: (value) => toArrayBuffer(value.valueBlock.valueHexView),
	toASN: (value) => new BitString$1({ valueHex: value })
};
var AsnObjectIdentifierConverter = {
	fromASN: (value) => value.valueBlock.toString(),
	toASN: (value) => new ObjectIdentifier({ value })
};
var AsnRelativeObjectIdentifierConverter = {
	fromASN: (value) => value.valueBlock.toString(),
	toASN: (value) => new RelativeObjectIdentifier({ value })
};
var AsnBooleanConverter = {
	fromASN: (value) => value.valueBlock.value,
	toASN: (value) => new Boolean$1({ value })
};
var AsnOctetStringConverter = {
	fromASN: (value) => toArrayBuffer(value.valueBlock.valueHexView),
	toASN: (value) => new OctetString$1({ valueHex: value })
};
var AsnConstructedOctetStringConverter = {
	fromASN: (value) => new OctetString(value.getValue()),
	toASN: (value) => value.toASN()
};
function createStringConverter(Asn1Type) {
	return {
		fromASN: (value) => value.valueBlock.value,
		toASN: (value) => new Asn1Type({ value })
	};
}
var AsnUtf8StringConverter = createStringConverter(Utf8String);
var AsnBmpStringConverter = createStringConverter(BmpString);
var AsnUniversalStringConverter = createStringConverter(UniversalString);
var AsnNumericStringConverter = createStringConverter(NumericString);
var AsnPrintableStringConverter = createStringConverter(PrintableString);
var AsnTeletexStringConverter = createStringConverter(TeletexString);
var AsnVideotexStringConverter = createStringConverter(VideotexString);
var AsnIA5StringConverter = createStringConverter(IA5String);
var AsnGraphicStringConverter = createStringConverter(GraphicString);
var AsnVisibleStringConverter = createStringConverter(VisibleString);
var AsnGeneralStringConverter = createStringConverter(GeneralString);
var AsnCharacterStringConverter = createStringConverter(CharacterString);
var AsnUTCTimeConverter = {
	fromASN: (value) => value.toDate(),
	toASN: (value) => new UTCTime({ valueDate: value })
};
var AsnGeneralizedTimeConverter = {
	fromASN: (value) => value.toDate(),
	toASN: (value) => new GeneralizedTime({ valueDate: value })
};
var AsnNullConverter = {
	fromASN: () => null,
	toASN: () => {
		return new Null();
	}
};
function defaultConverter(type) {
	switch (type) {
		case AsnPropTypes.Any: return AsnAnyConverter;
		case AsnPropTypes.BitString: return AsnBitStringConverter;
		case AsnPropTypes.BmpString: return AsnBmpStringConverter;
		case AsnPropTypes.Boolean: return AsnBooleanConverter;
		case AsnPropTypes.CharacterString: return AsnCharacterStringConverter;
		case AsnPropTypes.Enumerated: return AsnEnumeratedConverter;
		case AsnPropTypes.GeneralString: return AsnGeneralStringConverter;
		case AsnPropTypes.GeneralizedTime: return AsnGeneralizedTimeConverter;
		case AsnPropTypes.GraphicString: return AsnGraphicStringConverter;
		case AsnPropTypes.IA5String: return AsnIA5StringConverter;
		case AsnPropTypes.Integer: return AsnIntegerConverter;
		case AsnPropTypes.Null: return AsnNullConverter;
		case AsnPropTypes.NumericString: return AsnNumericStringConverter;
		case AsnPropTypes.ObjectIdentifier: return AsnObjectIdentifierConverter;
		case AsnPropTypes.RelativeObjectIdentifier: return AsnRelativeObjectIdentifierConverter;
		case AsnPropTypes.OctetString: return AsnOctetStringConverter;
		case AsnPropTypes.PrintableString: return AsnPrintableStringConverter;
		case AsnPropTypes.TeletexString: return AsnTeletexStringConverter;
		case AsnPropTypes.UTCTime: return AsnUTCTimeConverter;
		case AsnPropTypes.UniversalString: return AsnUniversalStringConverter;
		case AsnPropTypes.Utf8String: return AsnUtf8StringConverter;
		case AsnPropTypes.VideotexString: return AsnVideotexStringConverter;
		case AsnPropTypes.VisibleString: return AsnVisibleStringConverter;
		default: return null;
	}
}
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/helper.js
function isConvertible(target) {
	if (typeof target === "function" && target.prototype) if (target.prototype.toASN && target.prototype.fromASN) return true;
	else return isConvertible(target.prototype);
	else return !!(target && typeof target === "object" && "toASN" in target && "fromASN" in target);
}
function isTypeOfArray(target) {
	if (target) {
		const proto = Object.getPrototypeOf(target);
		if (proto?.prototype?.constructor === Array) return true;
		return isTypeOfArray(proto);
	}
	return false;
}
function isArrayEqual(bytes1, bytes2) {
	if (!(bytes1 && bytes2)) return false;
	if (bytes1.byteLength !== bytes2.byteLength) return false;
	const b1 = new Uint8Array(bytes1);
	const b2 = new Uint8Array(bytes2);
	for (let i = 0; i < bytes1.byteLength; i++) if (b1[i] !== b2[i]) return false;
	return true;
}
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/schema.js
var AsnSchemaStorage = class {
	items = /* @__PURE__ */ new WeakMap();
	has(target) {
		return this.items.has(target);
	}
	get(target, checkSchema = false) {
		const schema = this.items.get(target);
		if (!schema) throw new Error(`Cannot get schema for '${target.prototype.constructor.name}' target`);
		if (checkSchema && !schema.schema) throw new Error(`Schema '${target.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`);
		return schema;
	}
	cache(target) {
		const schema = this.get(target);
		if (!schema.schema) schema.schema = this.create(target, true);
	}
	createDefault(target) {
		const schema = {
			type: AsnTypeTypes.Sequence,
			items: {}
		};
		const parentSchema = this.findParentSchema(target);
		if (parentSchema) {
			Object.assign(schema, parentSchema);
			schema.items = Object.assign({}, schema.items, parentSchema.items);
		}
		return schema;
	}
	create(target, useNames) {
		const schema = this.items.get(target) || this.createDefault(target);
		const asn1Value = [];
		for (const key in schema.items) {
			const item = schema.items[key];
			const name = useNames ? key : "";
			let asn1Item;
			if (typeof item.type === "number") {
				const Asn1TypeName = AsnPropTypes[item.type];
				const Asn1Type = index_es_exports[Asn1TypeName];
				if (!Asn1Type) throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
				asn1Item = new Asn1Type({ name });
			} else if (isConvertible(item.type)) asn1Item = new item.type().toSchema(name);
			else if (item.optional) if (this.get(item.type).type === AsnTypeTypes.Choice) asn1Item = new Any({ name });
			else {
				asn1Item = this.create(item.type, false);
				asn1Item.name = name;
			}
			else asn1Item = new Any({ name });
			const optional = !!item.optional || item.defaultValue !== void 0;
			if (item.repeated) {
				asn1Item.name = "";
				asn1Item = new (item.repeated === "set" ? Set$1 : Sequence)({
					name: "",
					value: [new Repeated({
						name,
						value: asn1Item
					})]
				});
			}
			if (item.context !== null && item.context !== void 0) if (item.implicit) if (typeof item.type === "number" || isConvertible(item.type)) {
				const Container = item.repeated ? Constructed : Primitive;
				asn1Value.push(new Container({
					name,
					optional,
					idBlock: {
						tagClass: 3,
						tagNumber: item.context
					}
				}));
			} else {
				this.cache(item.type);
				const isRepeated = !!item.repeated;
				let value = !isRepeated ? this.get(item.type, true).schema : asn1Item;
				value = "valueBlock" in value ? value.valueBlock.value : value.value;
				asn1Value.push(new Constructed({
					name: !isRepeated ? name : "",
					optional,
					idBlock: {
						tagClass: 3,
						tagNumber: item.context
					},
					value
				}));
			}
			else asn1Value.push(new Constructed({
				optional,
				idBlock: {
					tagClass: 3,
					tagNumber: item.context
				},
				value: [asn1Item]
			}));
			else {
				asn1Item.optional = optional;
				asn1Value.push(asn1Item);
			}
		}
		switch (schema.type) {
			case AsnTypeTypes.Sequence: return new Sequence({
				value: asn1Value,
				name: ""
			});
			case AsnTypeTypes.Set: return new Set$1({
				value: asn1Value,
				name: ""
			});
			case AsnTypeTypes.Choice: return new Choice({
				value: asn1Value,
				name: ""
			});
			default: throw new Error("Unsupported ASN1 type in use");
		}
	}
	set(target, schema) {
		this.items.set(target, schema);
		return this;
	}
	findParentSchema(target) {
		const parent = Object.getPrototypeOf(target);
		if (parent) return this.items.get(parent) || this.findParentSchema(parent);
		return null;
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/storage.js
var schemaStorage = new AsnSchemaStorage();
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/decorators.js
var AsnType = (options) => (target) => {
	let schema;
	if (!schemaStorage.has(target)) {
		schema = schemaStorage.createDefault(target);
		schemaStorage.set(target, schema);
	} else schema = schemaStorage.get(target);
	Object.assign(schema, options);
};
var AsnProp = (options) => (target, propertyKey) => {
	let schema;
	if (!schemaStorage.has(target.constructor)) {
		schema = schemaStorage.createDefault(target.constructor);
		schemaStorage.set(target.constructor, schema);
	} else schema = schemaStorage.get(target.constructor);
	const copyOptions = Object.assign({}, options);
	if (typeof copyOptions.type === "number" && !copyOptions.converter) {
		const defaultConverter$1 = defaultConverter(options.type);
		if (!defaultConverter$1) throw new Error(`Cannot get default converter for property '${propertyKey}' of ${target.constructor.name}`);
		copyOptions.converter = defaultConverter$1;
	}
	copyOptions.raw = options.raw;
	schema.items[propertyKey] = copyOptions;
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/errors/schema_validation.js
var AsnSchemaValidationError = class extends Error {
	schemas = [];
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/parser.js
var AsnParser = class {
	static parse(data, target, options) {
		const asn1Parsed = fromBER(toArrayBuffer(data), options?.berOptions);
		if (asn1Parsed.result.error) throw new Error(asn1Parsed.result.error);
		return this.fromASN(asn1Parsed.result, target, options);
	}
	static fromASN(asn1Schema, target, options) {
		try {
			if (isConvertible(target)) return new target().fromASN(asn1Schema);
			const schema = schemaStorage.get(target);
			schemaStorage.cache(target);
			let targetSchema = schema.schema;
			const choiceResult = this.handleChoiceTypes(asn1Schema, schema, target, targetSchema, options);
			if (choiceResult?.result) return choiceResult.result;
			if (choiceResult?.targetSchema) targetSchema = choiceResult.targetSchema;
			const sequenceResult = this.handleSequenceTypes(asn1Schema, schema, target, targetSchema);
			const res = new target();
			if (isTypeOfArray(target)) return this.handleArrayTypes(asn1Schema, schema, target, options);
			this.processSchemaItems(schema, sequenceResult, res, options);
			return res;
		} catch (error) {
			if (error instanceof AsnSchemaValidationError) error.schemas.push(target.name);
			throw error;
		}
	}
	static handleChoiceTypes(asn1Schema, schema, target, targetSchema, options) {
		if (asn1Schema.constructor === Constructed && schema.type === AsnTypeTypes.Choice && asn1Schema.idBlock.tagClass === 3) for (const key in schema.items) {
			const schemaItem = schema.items[key];
			if (schemaItem.context === asn1Schema.idBlock.tagNumber && schemaItem.implicit) {
				if (typeof schemaItem.type === "function" && schemaStorage.has(schemaItem.type)) {
					const fieldSchema = schemaStorage.get(schemaItem.type);
					if (fieldSchema && fieldSchema.type === AsnTypeTypes.Sequence) {
						const newSeq = new Sequence();
						if ("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value) && "value" in newSeq.valueBlock) {
							newSeq.valueBlock.value = asn1Schema.valueBlock.value;
							const fieldValue = this.fromASN(newSeq, schemaItem.type, options);
							const res = new target();
							res[key] = fieldValue;
							return { result: res };
						}
					}
				}
			}
		}
		else if (asn1Schema.constructor === Constructed && schema.type !== AsnTypeTypes.Choice) {
			const newTargetSchema = new Constructed({
				idBlock: {
					tagClass: 3,
					tagNumber: asn1Schema.idBlock.tagNumber
				},
				value: schema.schema.valueBlock.value
			});
			for (const key in schema.items) delete asn1Schema[key];
			return { targetSchema: newTargetSchema };
		}
		return null;
	}
	static handleSequenceTypes(asn1Schema, schema, target, targetSchema) {
		if (schema.type === AsnTypeTypes.Sequence) {
			const asn1ComparedSchema = compareSchema({}, asn1Schema, targetSchema);
			if (!asn1ComparedSchema.verified) throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema.${asn1ComparedSchema.result.error ? ` ${asn1ComparedSchema.result.error}` : ""}`);
			return asn1ComparedSchema;
		} else {
			const asn1ComparedSchema = compareSchema({}, asn1Schema, targetSchema);
			if (!asn1ComparedSchema.verified) throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema.${asn1ComparedSchema.result.error ? ` ${asn1ComparedSchema.result.error}` : ""}`);
			return asn1ComparedSchema;
		}
	}
	static processRepeatedField(asn1Elements, asn1Index, schemaItem) {
		let elementsToProcess = asn1Elements.slice(asn1Index);
		if (elementsToProcess.length === 1 && elementsToProcess[0].constructor.name === "Sequence") {
			const seq = elementsToProcess[0];
			if (seq.valueBlock && seq.valueBlock.value && Array.isArray(seq.valueBlock.value)) elementsToProcess = seq.valueBlock.value;
		}
		if (typeof schemaItem.type === "number") {
			const converter = defaultConverter(schemaItem.type);
			if (!converter) throw new Error(`No converter for ASN.1 type ${schemaItem.type}`);
			return elementsToProcess.filter((el) => el && el.valueBlock).map((el) => {
				try {
					return converter.fromASN(el);
				} catch {
					return;
				}
			}).filter((v) => v !== void 0);
		} else return elementsToProcess.filter((el) => el && el.valueBlock).map((el) => {
			try {
				return this.fromASN(el, schemaItem.type);
			} catch {
				return;
			}
		}).filter((v) => v !== void 0);
	}
	static processPrimitiveField(asn1Element, schemaItem) {
		const converter = defaultConverter(schemaItem.type);
		if (!converter) throw new Error(`No converter for ASN.1 type ${schemaItem.type}`);
		return converter.fromASN(asn1Element);
	}
	static isOptionalChoiceField(schemaItem) {
		return schemaItem.optional && typeof schemaItem.type === "function" && schemaStorage.has(schemaItem.type) && schemaStorage.get(schemaItem.type).type === AsnTypeTypes.Choice;
	}
	static processOptionalChoiceField(asn1Element, schemaItem) {
		try {
			return {
				processed: true,
				value: this.fromASN(asn1Element, schemaItem.type)
			};
		} catch (err) {
			if (err instanceof AsnSchemaValidationError && /Wrong values for Choice type/.test(err.message)) return { processed: false };
			throw err;
		}
	}
	static handleArrayTypes(asn1Schema, schema, target, options) {
		if (!("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value))) throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
		const itemType = schema.itemType;
		if (typeof itemType === "number") {
			const converter = defaultConverter(itemType);
			if (!converter) throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
			return target.from(asn1Schema.valueBlock.value, (element) => converter.fromASN(element));
		} else return target.from(asn1Schema.valueBlock.value, (element) => this.fromASN(element, itemType, options));
	}
	static processSchemaItems(schema, asn1ComparedSchema, res, options) {
		for (const key in schema.items) {
			const asn1SchemaValue = asn1ComparedSchema.result[key];
			if (!asn1SchemaValue) continue;
			const schemaItem = schema.items[key];
			const schemaItemType = schemaItem.type;
			let parsedValue;
			if (typeof schemaItemType === "number" || isConvertible(schemaItemType)) parsedValue = this.processPrimitiveSchemaItem(asn1SchemaValue, schemaItem, schemaItemType, options);
			else parsedValue = this.processComplexSchemaItem(asn1SchemaValue, schemaItem, schemaItemType, options);
			if (parsedValue && typeof parsedValue === "object" && "value" in parsedValue && "raw" in parsedValue) {
				res[key] = parsedValue.value;
				res[`${key}Raw`] = parsedValue.raw;
			} else res[key] = parsedValue;
		}
	}
	static processPrimitiveSchemaItem(asn1SchemaValue, schemaItem, schemaItemType, options) {
		const converter = schemaItem.converter ?? (isConvertible(schemaItemType) ? new schemaItemType() : null);
		if (!converter) throw new Error("Converter is empty");
		if (schemaItem.repeated) return this.processRepeatedPrimitiveItem(asn1SchemaValue, schemaItem, converter, options);
		else return this.processSinglePrimitiveItem(asn1SchemaValue, schemaItem, schemaItemType, converter, options);
	}
	static processRepeatedPrimitiveItem(asn1SchemaValue, schemaItem, converter, options) {
		if (schemaItem.implicit) {
			const newItem = new (schemaItem.repeated === "sequence" ? Sequence : Set$1)();
			newItem.valueBlock = asn1SchemaValue.valueBlock;
			const newItemAsn = fromBER(newItem.toBER(false), options?.berOptions);
			if (newItemAsn.offset === -1) throw new Error(`Cannot parse the child item. ${newItemAsn.result.error}`);
			if (!("value" in newItemAsn.result.valueBlock && Array.isArray(newItemAsn.result.valueBlock.value))) throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
			const value = newItemAsn.result.valueBlock.value;
			return Array.from(value, (element) => converter.fromASN(element));
		} else return Array.from(asn1SchemaValue, (element) => converter.fromASN(element));
	}
	static processSinglePrimitiveItem(asn1SchemaValue, schemaItem, schemaItemType, converter, options) {
		let value = asn1SchemaValue;
		if (schemaItem.implicit) {
			let newItem;
			if (isConvertible(schemaItemType)) newItem = new schemaItemType().toSchema("");
			else {
				const Asn1TypeName = AsnPropTypes[schemaItemType];
				const Asn1Type = index_es_exports[Asn1TypeName];
				if (!Asn1Type) throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
				newItem = new Asn1Type();
			}
			newItem.valueBlock = value.valueBlock;
			value = fromBER(newItem.toBER(false), options?.berOptions).result;
		}
		return converter.fromASN(value);
	}
	static processComplexSchemaItem(asn1SchemaValue, schemaItem, schemaItemType, options) {
		if (schemaItem.repeated) {
			if (!Array.isArray(asn1SchemaValue)) throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
			return Array.from(asn1SchemaValue, (element) => this.fromASN(element, schemaItemType, options));
		} else {
			const valueToProcess = this.handleImplicitTagging(asn1SchemaValue, schemaItem, schemaItemType);
			if (this.isOptionalChoiceField(schemaItem)) try {
				return this.fromASN(valueToProcess, schemaItemType, options);
			} catch (err) {
				if (err instanceof AsnSchemaValidationError && /Wrong values for Choice type/.test(err.message)) return;
				throw err;
			}
			else {
				const parsedValue = this.fromASN(valueToProcess, schemaItemType, options);
				if (schemaItem.raw) return {
					value: parsedValue,
					raw: asn1SchemaValue.valueBeforeDecodeView
				};
				return parsedValue;
			}
		}
	}
	static handleImplicitTagging(asn1SchemaValue, schemaItem, schemaItemType) {
		if (schemaItem.implicit && typeof schemaItem.context === "number") {
			const schema = schemaStorage.get(schemaItemType);
			if (schema.type === AsnTypeTypes.Sequence) {
				const newSeq = new Sequence();
				if ("value" in asn1SchemaValue.valueBlock && Array.isArray(asn1SchemaValue.valueBlock.value) && "value" in newSeq.valueBlock) {
					newSeq.valueBlock.value = asn1SchemaValue.valueBlock.value;
					return newSeq;
				}
			} else if (schema.type === AsnTypeTypes.Set) {
				const newSet = new Set$1();
				if ("value" in asn1SchemaValue.valueBlock && Array.isArray(asn1SchemaValue.valueBlock.value) && "value" in newSet.valueBlock) {
					newSet.valueBlock.value = asn1SchemaValue.valueBlock.value;
					return newSet;
				}
			}
		}
		return asn1SchemaValue;
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/serializer.js
var AsnSerializer = class AsnSerializer {
	static serialize(obj) {
		if (obj instanceof BaseBlock) return obj.toBER(false);
		return this.toASN(obj).toBER(false);
	}
	static toASN(obj) {
		if (obj && typeof obj === "object" && isConvertible(obj)) return obj.toASN();
		if (!(obj && typeof obj === "object")) throw new TypeError("Parameter 1 should be type of Object.");
		const target = obj.constructor;
		const schema = schemaStorage.get(target);
		schemaStorage.cache(target);
		let asn1Value = [];
		if (schema.itemType) {
			if (!Array.isArray(obj)) throw new TypeError("Parameter 1 should be type of Array.");
			if (typeof schema.itemType === "number") {
				const converter = defaultConverter(schema.itemType);
				if (!converter) throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
				asn1Value = obj.map((o) => converter.toASN(o));
			} else asn1Value = obj.map((o) => this.toAsnItem({ type: schema.itemType }, "[]", target, o));
		} else for (const key in schema.items) {
			const schemaItem = schema.items[key];
			const objProp = obj[key];
			if (objProp === void 0 || schemaItem.defaultValue === objProp || typeof schemaItem.defaultValue === "object" && typeof objProp === "object" && isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp))) continue;
			const asn1Item = AsnSerializer.toAsnItem(schemaItem, key, target, objProp);
			if (typeof schemaItem.context === "number") if (schemaItem.implicit) if (!schemaItem.repeated && (typeof schemaItem.type === "number" || isConvertible(schemaItem.type))) {
				const value = {};
				value.valueHex = asn1Item instanceof Null ? toArrayBuffer(asn1Item.valueBeforeDecodeView) : asn1Item.valueBlock.toBER();
				asn1Value.push(new Primitive({
					optional: schemaItem.optional,
					idBlock: {
						tagClass: 3,
						tagNumber: schemaItem.context
					},
					...value
				}));
			} else asn1Value.push(new Constructed({
				optional: schemaItem.optional,
				idBlock: {
					tagClass: 3,
					tagNumber: schemaItem.context
				},
				value: asn1Item.valueBlock.value
			}));
			else asn1Value.push(new Constructed({
				optional: schemaItem.optional,
				idBlock: {
					tagClass: 3,
					tagNumber: schemaItem.context
				},
				value: [asn1Item]
			}));
			else if (schemaItem.repeated) asn1Value = asn1Value.concat(asn1Item);
			else asn1Value.push(asn1Item);
		}
		let asnSchema;
		switch (schema.type) {
			case AsnTypeTypes.Sequence:
				asnSchema = new Sequence({ value: asn1Value });
				break;
			case AsnTypeTypes.Set:
				asnSchema = new Set$1({ value: asn1Value });
				break;
			case AsnTypeTypes.Choice:
				if (!asn1Value[0]) throw new Error(`Schema '${target.name}' has wrong data. Choice cannot be empty.`);
				asnSchema = asn1Value[0];
		}
		return asnSchema;
	}
	static toAsnItem(schemaItem, key, target, objProp) {
		let asn1Item;
		if (typeof schemaItem.type === "number") {
			const converter = schemaItem.converter;
			if (!converter) throw new Error(`Property '${key}' doesn't have converter for type ${AsnPropTypes[schemaItem.type]} in schema '${target.name}'`);
			if (schemaItem.repeated) {
				if (!Array.isArray(objProp)) throw new TypeError("Parameter 'objProp' should be type of Array.");
				const items = Array.from(objProp, (element) => converter.toASN(element));
				asn1Item = new (schemaItem.repeated === "sequence" ? Sequence : Set$1)({ value: items });
			} else asn1Item = converter.toASN(objProp);
		} else if (schemaItem.repeated) {
			if (!Array.isArray(objProp)) throw new TypeError("Parameter 'objProp' should be type of Array.");
			const items = Array.from(objProp, (element) => this.toASN(element));
			asn1Item = new (schemaItem.repeated === "sequence" ? Sequence : Set$1)({ value: items });
		} else asn1Item = this.toASN(objProp);
		return asn1Item;
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/objects.js
var AsnArray = class extends Array {
	constructor(items = []) {
		if (typeof items === "number") super(items);
		else {
			super();
			for (const item of items) this.push(item);
		}
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-schema/build/es2015/convert.js
var AsnConvert = class AsnConvert {
	static serialize(obj) {
		return AsnSerializer.serialize(obj);
	}
	static parse(data, target, options) {
		return AsnParser.parse(data, target, options);
	}
	static toString(data, options) {
		const asn = fromBER(isBufferSource(data) ? toArrayBuffer(data) : AsnConvert.serialize(data), options?.berOptions);
		if (asn.offset === -1) throw new Error(`Cannot decode ASN.1 data. ${asn.result.error}`);
		return asn.result.toString();
	}
};
//#endregion
//#region node_modules/@peculiar/asn1-android/build/es2015/key_description.js
var IntegerSet_1;
var id_ce_keyDescription = "1.3.6.1.4.1.11129.2.1.17";
var VerifiedBootState;
(function(VerifiedBootState) {
	VerifiedBootState[VerifiedBootState["verified"] = 0] = "verified";
	VerifiedBootState[VerifiedBootState["selfSigned"] = 1] = "selfSigned";
	VerifiedBootState[VerifiedBootState["unverified"] = 2] = "unverified";
	VerifiedBootState[VerifiedBootState["failed"] = 3] = "failed";
})(VerifiedBootState || (VerifiedBootState = {}));
var RootOfTrust = class {
	verifiedBootKey = new OctetString();
	deviceLocked = false;
	verifiedBootState = VerifiedBootState.verified;
	verifiedBootHash;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: OctetString })], RootOfTrust.prototype, "verifiedBootKey", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Boolean })], RootOfTrust.prototype, "deviceLocked", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], RootOfTrust.prototype, "verifiedBootState", void 0);
__decorate([AsnProp({
	type: OctetString,
	optional: true
})], RootOfTrust.prototype, "verifiedBootHash", void 0);
var IntegerSet = IntegerSet_1 = class IntegerSet extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, IntegerSet_1.prototype);
	}
};
IntegerSet = IntegerSet_1 = __decorate([AsnType({
	type: AsnTypeTypes.Set,
	itemType: AsnPropTypes.Integer
})], IntegerSet);
var AuthorizationList = class {
	purpose;
	algorithm;
	keySize;
	digest;
	padding;
	ecCurve;
	rsaPublicExponent;
	mgfDigest;
	rollbackResistance;
	earlyBootOnly;
	activeDateTime;
	originationExpireDateTime;
	usageExpireDateTime;
	usageCountLimit;
	noAuthRequired;
	userAuthType;
	authTimeout;
	allowWhileOnBody;
	trustedUserPresenceRequired;
	trustedConfirmationRequired;
	unlockedDeviceRequired;
	allApplications;
	applicationId;
	creationDateTime;
	origin;
	rollbackResistant;
	rootOfTrust;
	osVersion;
	osPatchLevel;
	attestationApplicationId;
	attestationIdBrand;
	attestationIdDevice;
	attestationIdProduct;
	attestationIdSerial;
	attestationIdImei;
	attestationIdMeid;
	attestationIdManufacturer;
	attestationIdModel;
	vendorPatchLevel;
	bootPatchLevel;
	deviceUniqueAttestation;
	attestationIdSecondImei;
	moduleHash;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	context: 1,
	type: IntegerSet,
	optional: true
})], AuthorizationList.prototype, "purpose", void 0);
__decorate([AsnProp({
	context: 2,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "algorithm", void 0);
__decorate([AsnProp({
	context: 3,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "keySize", void 0);
__decorate([AsnProp({
	context: 5,
	type: IntegerSet,
	optional: true
})], AuthorizationList.prototype, "digest", void 0);
__decorate([AsnProp({
	context: 6,
	type: IntegerSet,
	optional: true
})], AuthorizationList.prototype, "padding", void 0);
__decorate([AsnProp({
	context: 10,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "ecCurve", void 0);
__decorate([AsnProp({
	context: 200,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "rsaPublicExponent", void 0);
__decorate([AsnProp({
	context: 203,
	type: IntegerSet,
	optional: true
})], AuthorizationList.prototype, "mgfDigest", void 0);
__decorate([AsnProp({
	context: 303,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "rollbackResistance", void 0);
__decorate([AsnProp({
	context: 305,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "earlyBootOnly", void 0);
__decorate([AsnProp({
	context: 400,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "activeDateTime", void 0);
__decorate([AsnProp({
	context: 401,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "originationExpireDateTime", void 0);
__decorate([AsnProp({
	context: 402,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "usageExpireDateTime", void 0);
__decorate([AsnProp({
	context: 405,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "usageCountLimit", void 0);
__decorate([AsnProp({
	context: 503,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "noAuthRequired", void 0);
__decorate([AsnProp({
	context: 504,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "userAuthType", void 0);
__decorate([AsnProp({
	context: 505,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "authTimeout", void 0);
__decorate([AsnProp({
	context: 506,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "allowWhileOnBody", void 0);
__decorate([AsnProp({
	context: 507,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "trustedUserPresenceRequired", void 0);
__decorate([AsnProp({
	context: 508,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "trustedConfirmationRequired", void 0);
__decorate([AsnProp({
	context: 509,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "unlockedDeviceRequired", void 0);
__decorate([AsnProp({
	context: 600,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "allApplications", void 0);
__decorate([AsnProp({
	context: 601,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "applicationId", void 0);
__decorate([AsnProp({
	context: 701,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "creationDateTime", void 0);
__decorate([AsnProp({
	context: 702,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "origin", void 0);
__decorate([AsnProp({
	context: 703,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "rollbackResistant", void 0);
__decorate([AsnProp({
	context: 704,
	type: RootOfTrust,
	optional: true
})], AuthorizationList.prototype, "rootOfTrust", void 0);
__decorate([AsnProp({
	context: 705,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "osVersion", void 0);
__decorate([AsnProp({
	context: 706,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "osPatchLevel", void 0);
__decorate([AsnProp({
	context: 709,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationApplicationId", void 0);
__decorate([AsnProp({
	context: 710,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdBrand", void 0);
__decorate([AsnProp({
	context: 711,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdDevice", void 0);
__decorate([AsnProp({
	context: 712,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdProduct", void 0);
__decorate([AsnProp({
	context: 713,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdSerial", void 0);
__decorate([AsnProp({
	context: 714,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdImei", void 0);
__decorate([AsnProp({
	context: 715,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdMeid", void 0);
__decorate([AsnProp({
	context: 716,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdManufacturer", void 0);
__decorate([AsnProp({
	context: 717,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdModel", void 0);
__decorate([AsnProp({
	context: 718,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "vendorPatchLevel", void 0);
__decorate([AsnProp({
	context: 719,
	type: AsnPropTypes.Integer,
	optional: true
})], AuthorizationList.prototype, "bootPatchLevel", void 0);
__decorate([AsnProp({
	context: 720,
	type: AsnPropTypes.Null,
	optional: true
})], AuthorizationList.prototype, "deviceUniqueAttestation", void 0);
__decorate([AsnProp({
	context: 723,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "attestationIdSecondImei", void 0);
__decorate([AsnProp({
	context: 724,
	type: OctetString,
	optional: true
})], AuthorizationList.prototype, "moduleHash", void 0);
var SecurityLevel;
(function(SecurityLevel) {
	SecurityLevel[SecurityLevel["software"] = 0] = "software";
	SecurityLevel[SecurityLevel["trustedEnvironment"] = 1] = "trustedEnvironment";
	SecurityLevel[SecurityLevel["strongBox"] = 2] = "strongBox";
})(SecurityLevel || (SecurityLevel = {}));
var Version;
(function(Version) {
	Version[Version["KM2"] = 1] = "KM2";
	Version[Version["KM3"] = 2] = "KM3";
	Version[Version["KM4"] = 3] = "KM4";
	Version[Version["KM4_1"] = 4] = "KM4_1";
	Version[Version["keyMint1"] = 100] = "keyMint1";
	Version[Version["keyMint2"] = 200] = "keyMint2";
	Version[Version["keyMint3"] = 300] = "keyMint3";
	Version[Version["keyMint4"] = 400] = "keyMint4";
})(Version || (Version = {}));
var KeyDescription = class {
	attestationVersion = Version.KM4;
	attestationSecurityLevel = SecurityLevel.software;
	keymasterVersion = 0;
	keymasterSecurityLevel = SecurityLevel.software;
	attestationChallenge = new OctetString();
	uniqueId = new OctetString();
	softwareEnforced = new AuthorizationList();
	teeEnforced = new AuthorizationList();
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KeyDescription.prototype, "attestationVersion", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], KeyDescription.prototype, "attestationSecurityLevel", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KeyDescription.prototype, "keymasterVersion", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], KeyDescription.prototype, "keymasterSecurityLevel", void 0);
__decorate([AsnProp({ type: OctetString })], KeyDescription.prototype, "attestationChallenge", void 0);
__decorate([AsnProp({ type: OctetString })], KeyDescription.prototype, "uniqueId", void 0);
__decorate([AsnProp({ type: AuthorizationList })], KeyDescription.prototype, "softwareEnforced", void 0);
__decorate([AsnProp({ type: AuthorizationList })], KeyDescription.prototype, "teeEnforced", void 0);
var KeyMintKeyDescription = class KeyMintKeyDescription {
	attestationVersion = Version.keyMint4;
	attestationSecurityLevel = SecurityLevel.software;
	keyMintVersion = 0;
	keyMintSecurityLevel = SecurityLevel.software;
	attestationChallenge = new OctetString();
	uniqueId = new OctetString();
	softwareEnforced = new AuthorizationList();
	hardwareEnforced = new AuthorizationList();
	constructor(params = {}) {
		Object.assign(this, params);
	}
	toLegacyKeyDescription() {
		return new KeyDescription({
			attestationVersion: this.attestationVersion,
			attestationSecurityLevel: this.attestationSecurityLevel,
			keymasterVersion: this.keyMintVersion,
			keymasterSecurityLevel: this.keyMintSecurityLevel,
			attestationChallenge: this.attestationChallenge,
			uniqueId: this.uniqueId,
			softwareEnforced: this.softwareEnforced,
			teeEnforced: this.hardwareEnforced
		});
	}
	static fromLegacyKeyDescription(keyDesc) {
		return new KeyMintKeyDescription({
			attestationVersion: keyDesc.attestationVersion,
			attestationSecurityLevel: keyDesc.attestationSecurityLevel,
			keyMintVersion: keyDesc.keymasterVersion,
			keyMintSecurityLevel: keyDesc.keymasterSecurityLevel,
			attestationChallenge: keyDesc.attestationChallenge,
			uniqueId: keyDesc.uniqueId,
			softwareEnforced: keyDesc.softwareEnforced,
			hardwareEnforced: keyDesc.teeEnforced
		});
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KeyMintKeyDescription.prototype, "attestationVersion", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], KeyMintKeyDescription.prototype, "attestationSecurityLevel", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], KeyMintKeyDescription.prototype, "keyMintVersion", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], KeyMintKeyDescription.prototype, "keyMintSecurityLevel", void 0);
__decorate([AsnProp({ type: OctetString })], KeyMintKeyDescription.prototype, "attestationChallenge", void 0);
__decorate([AsnProp({ type: OctetString })], KeyMintKeyDescription.prototype, "uniqueId", void 0);
__decorate([AsnProp({ type: AuthorizationList })], KeyMintKeyDescription.prototype, "softwareEnforced", void 0);
__decorate([AsnProp({ type: AuthorizationList })], KeyMintKeyDescription.prototype, "hardwareEnforced", void 0);
//#endregion
//#region node_modules/@peculiar/asn1-android/build/es2015/nonstandard.js
var NonStandardAuthorizationList_1;
var NonStandardAuthorization = class NonStandardAuthorization extends AuthorizationList {};
NonStandardAuthorization = __decorate([AsnType({ type: AsnTypeTypes.Choice })], NonStandardAuthorization);
var NonStandardAuthorizationList = NonStandardAuthorizationList_1 = class NonStandardAuthorizationList extends AsnArray {
	constructor(items) {
		super(items);
		Object.setPrototypeOf(this, NonStandardAuthorizationList_1.prototype);
	}
	findProperty(key) {
		const prop = this.find((o) => o[key] !== void 0);
		if (prop) return prop[key];
	}
};
NonStandardAuthorizationList = NonStandardAuthorizationList_1 = __decorate([AsnType({
	type: AsnTypeTypes.Sequence,
	itemType: NonStandardAuthorization
})], NonStandardAuthorizationList);
var NonStandardKeyDescription = class {
	attestationVersion = Version.KM4;
	attestationSecurityLevel = SecurityLevel.software;
	keymasterVersion = 0;
	keymasterSecurityLevel = SecurityLevel.software;
	attestationChallenge = new OctetString();
	uniqueId = new OctetString();
	softwareEnforced = new NonStandardAuthorizationList();
	teeEnforced = new NonStandardAuthorizationList();
	get keyMintVersion() {
		return this.keymasterVersion;
	}
	set keyMintVersion(value) {
		this.keymasterVersion = value;
	}
	get keyMintSecurityLevel() {
		return this.keymasterSecurityLevel;
	}
	set keyMintSecurityLevel(value) {
		this.keymasterSecurityLevel = value;
	}
	get hardwareEnforced() {
		return this.teeEnforced;
	}
	set hardwareEnforced(value) {
		this.teeEnforced = value;
	}
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.Integer })], NonStandardKeyDescription.prototype, "attestationVersion", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], NonStandardKeyDescription.prototype, "attestationSecurityLevel", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], NonStandardKeyDescription.prototype, "keymasterVersion", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Enumerated })], NonStandardKeyDescription.prototype, "keymasterSecurityLevel", void 0);
__decorate([AsnProp({ type: OctetString })], NonStandardKeyDescription.prototype, "attestationChallenge", void 0);
__decorate([AsnProp({ type: OctetString })], NonStandardKeyDescription.prototype, "uniqueId", void 0);
__decorate([AsnProp({ type: NonStandardAuthorizationList })], NonStandardKeyDescription.prototype, "softwareEnforced", void 0);
__decorate([AsnProp({ type: NonStandardAuthorizationList })], NonStandardKeyDescription.prototype, "teeEnforced", void 0);
var NonStandardKeyMintKeyDescription = class NonStandardKeyMintKeyDescription extends NonStandardKeyDescription {
	constructor(params = {}) {
		if ("keymasterVersion" in params && !("keyMintVersion" in params)) params.keyMintVersion = params.keymasterVersion;
		if ("keymasterSecurityLevel" in params && !("keyMintSecurityLevel" in params)) params.keyMintSecurityLevel = params.keymasterSecurityLevel;
		if ("teeEnforced" in params && !("hardwareEnforced" in params)) params.hardwareEnforced = params.teeEnforced;
		super(params);
	}
};
NonStandardKeyMintKeyDescription = __decorate([AsnType({ type: AsnTypeTypes.Sequence })], NonStandardKeyMintKeyDescription);
//#endregion
//#region node_modules/@peculiar/asn1-android/build/es2015/attestation.js
var AttestationPackageInfo = class {
	packageName;
	version;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({ type: AsnPropTypes.OctetString })], AttestationPackageInfo.prototype, "packageName", void 0);
__decorate([AsnProp({ type: AsnPropTypes.Integer })], AttestationPackageInfo.prototype, "version", void 0);
var AttestationApplicationId = class {
	packageInfos;
	signatureDigests;
	constructor(params = {}) {
		Object.assign(this, params);
	}
};
__decorate([AsnProp({
	type: AttestationPackageInfo,
	repeated: "set"
})], AttestationApplicationId.prototype, "packageInfos", void 0);
__decorate([AsnProp({
	type: AsnPropTypes.OctetString,
	repeated: "set"
})], AttestationApplicationId.prototype, "signatureDigests", void 0);
//#endregion
export { toUint8Array as _, AsnParser as a, combine as b, AsnConstructedOctetStringConverter as c, AsnUtf8StringConverter as d, OctetString as f, encode$6 as g, AsnTypeTypes as h, AsnArray as i, AsnIntegerArrayBufferConverter as l, AsnPropTypes as m, id_ce_keyDescription as n, AsnProp as o, BitString as p, AsnConvert as r, AsnType as s, KeyDescription as t, AsnOctetStringConverter as u, BufferSourceConverter as v, isEqual as x, Convert as y };
