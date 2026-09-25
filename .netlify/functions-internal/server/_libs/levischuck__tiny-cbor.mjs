//#region node_modules/@levischuck/tiny-cbor/esm/cbor/cbor_internal.js
function decodeLength(data, argument, index) {
	if (argument < 24) return [argument, 1];
	const remainingDataLength = data.byteLength - index - 1;
	const view = new DataView(data.buffer, index + 1);
	let output;
	let bytes = 0;
	switch (argument) {
		case 24:
			if (remainingDataLength > 0) {
				output = view.getUint8(0);
				bytes = 2;
			}
			break;
		case 25:
			if (remainingDataLength > 1) {
				output = view.getUint16(0, false);
				bytes = 3;
			}
			break;
		case 26:
			if (remainingDataLength > 3) {
				output = view.getUint32(0, false);
				bytes = 5;
			}
			break;
		case 27: if (remainingDataLength > 7) {
			const bigOutput = view.getBigUint64(0, false);
			if (bigOutput >= 24n && bigOutput <= Number.MAX_SAFE_INTEGER) return [Number(bigOutput), 9];
		}
	}
	if (output && output >= 24) return [output, bytes];
	throw new Error("Length not supported or not well formed");
}
function encodeLength(major, argument) {
	const majorEncoded = major << 5;
	if (argument < 0) throw new Error("CBOR Data Item argument must not be negative");
	let bigintArgument;
	if (typeof argument == "number") {
		if (!Number.isInteger(argument)) throw new Error("CBOR Data Item argument must be an integer");
		bigintArgument = BigInt(argument);
	} else bigintArgument = argument;
	if (major == 1) {
		if (bigintArgument == 0n) throw new Error("CBOR Data Item argument cannot be zero when negative");
		bigintArgument = bigintArgument - 1n;
	}
	if (bigintArgument > 18446744073709551615n) throw new Error("CBOR number out of range");
	const buffer = /* @__PURE__ */ new Uint8Array(8);
	new DataView(buffer.buffer).setBigUint64(0, bigintArgument, false);
	if (bigintArgument <= 23) return [majorEncoded | buffer[7]];
	else if (bigintArgument <= 255) return [majorEncoded | 24, buffer[7]];
	else if (bigintArgument <= 65535) return [majorEncoded | 25, ...buffer.slice(6)];
	else if (bigintArgument <= 4294967295) return [majorEncoded | 26, ...buffer.slice(4)];
	else return [majorEncoded | 27, ...buffer];
}
//#endregion
//#region node_modules/@levischuck/tiny-cbor/esm/cbor/cbor.js
/**
* A value which is wrapped with a CBOR Tag.
* Several tags are registered with defined meanings like 0 for a date string.
* These meanings are **not interpreted** when decoded or encoded.
*
* This class is an immutable record.
* If the tag number or value needs to change, then construct a new tag
*/
var CBORTag = class {
	/**
	* Wrap a value with a tag number.
	* When encoded, this tag will be attached to the value.
	*
	* @param tag Tag number
	* @param value Wrapped value
	*/
	constructor(tag, value) {
		Object.defineProperty(this, "tagId", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "tagValue", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.tagId = tag;
		this.tagValue = value;
	}
	/**
	* Read the tag number
	*/
	get tag() {
		return this.tagId;
	}
	/**
	* Read the value
	*/
	get value() {
		return this.tagValue;
	}
};
function decodeUnsignedInteger(data, argument, index) {
	return decodeLength(data, argument, index);
}
function decodeNegativeInteger(data, argument, index) {
	const [value, length] = decodeUnsignedInteger(data, argument, index);
	return [-value - 1, length];
}
function decodeByteString(data, argument, index) {
	const [lengthValue, lengthConsumed] = decodeLength(data, argument, index);
	const dataStartIndex = index + lengthConsumed;
	return [new Uint8Array(data.buffer.slice(dataStartIndex, dataStartIndex + lengthValue)), lengthConsumed + lengthValue];
}
var TEXT_DECODER = new TextDecoder();
function decodeString(data, argument, index) {
	const [value, length] = decodeByteString(data, argument, index);
	return [TEXT_DECODER.decode(value), length];
}
function decodeArray(data, argument, index) {
	if (argument === 0) return [[], 1];
	const [length, lengthConsumed] = decodeLength(data, argument, index);
	let consumedLength = lengthConsumed;
	const value = [];
	for (let i = 0; i < length; i++) {
		if (data.byteLength - index - consumedLength <= 0) throw new Error("array is not supported or well formed");
		const [decodedValue, consumed] = decodeNext(data, index + consumedLength);
		value.push(decodedValue);
		consumedLength += consumed;
	}
	return [value, consumedLength];
}
var MAP_ERROR = "Map is not supported or well formed";
function decodeMap(data, argument, index) {
	if (argument === 0) return [/* @__PURE__ */ new Map(), 1];
	const [length, lengthConsumed] = decodeLength(data, argument, index);
	let consumedLength = lengthConsumed;
	const result = /* @__PURE__ */ new Map();
	for (let i = 0; i < length; i++) {
		let remainingDataLength = data.byteLength - index - consumedLength;
		if (remainingDataLength <= 0) throw new Error(MAP_ERROR);
		const [key, keyConsumed] = decodeNext(data, index + consumedLength);
		consumedLength += keyConsumed;
		remainingDataLength -= keyConsumed;
		if (remainingDataLength <= 0) throw new Error(MAP_ERROR);
		if (typeof key !== "string" && typeof key !== "number") throw new Error(MAP_ERROR);
		if (result.has(key)) throw new Error(MAP_ERROR);
		const [value, valueConsumed] = decodeNext(data, index + consumedLength);
		consumedLength += valueConsumed;
		result.set(key, value);
	}
	return [result, consumedLength];
}
function decodeFloat16(data, index) {
	if (index + 3 > data.byteLength) throw new Error("CBOR stream ended before end of Float 16");
	const result = data.getUint16(index + 1, false);
	if (result == 31744) return [Infinity, 3];
	else if (result == 32256) return [NaN, 3];
	else if (result == 64512) return [-Infinity, 3];
	throw new Error("Float16 data is unsupported");
}
function decodeFloat32(data, index) {
	if (index + 5 > data.byteLength) throw new Error("CBOR stream ended before end of Float 32");
	return [data.getFloat32(index + 1, false), 5];
}
function decodeFloat64(data, index) {
	if (index + 9 > data.byteLength) throw new Error("CBOR stream ended before end of Float 64");
	return [data.getFloat64(index + 1, false), 9];
}
function decodeTag(data, argument, index) {
	const [tag, tagBytes] = decodeLength(data, argument, index);
	const [value, valueBytes] = decodeNext(data, index + tagBytes);
	return [new CBORTag(tag, value), tagBytes + valueBytes];
}
function decodeNext(data, index) {
	if (index >= data.byteLength) throw new Error("CBOR stream ended before tag value");
	const byte = data.getUint8(index);
	const majorType = byte >> 5;
	const argument = byte & 31;
	switch (majorType) {
		case 0: return decodeUnsignedInteger(data, argument, index);
		case 1: return decodeNegativeInteger(data, argument, index);
		case 2: return decodeByteString(data, argument, index);
		case 3: return decodeString(data, argument, index);
		case 4: return decodeArray(data, argument, index);
		case 5: return decodeMap(data, argument, index);
		case 6: return decodeTag(data, argument, index);
		case 7: switch (argument) {
			case 20: return [false, 1];
			case 21: return [true, 1];
			case 22: return [null, 1];
			case 23: return [void 0, 1];
			case 25: return decodeFloat16(data, index);
			case 26: return decodeFloat32(data, index);
			case 27: return decodeFloat64(data, index);
		}
	}
	throw new Error(`Unsupported or not well formed at ${index}`);
}
function encodeSimple(data) {
	if (data === true) return 245;
	else if (data === false) return 244;
	else if (data === null) return 246;
	return 247;
}
function encodeFloat(data) {
	if (Math.fround(data) == data || !Number.isFinite(data) || Number.isNaN(data)) {
		const output = /* @__PURE__ */ new Uint8Array(5);
		output[0] = 250;
		new DataView(output.buffer).setFloat32(1, data, false);
		return output;
	} else {
		const output = /* @__PURE__ */ new Uint8Array(9);
		output[0] = 251;
		new DataView(output.buffer).setFloat64(1, data, false);
		return output;
	}
}
function encodeNumber(data) {
	if (typeof data == "number") {
		if (Number.isSafeInteger(data)) if (data < 0) return encodeLength(1, Math.abs(data));
		else return encodeLength(0, data);
		return [encodeFloat(data)];
	} else if (data < 0n) return encodeLength(1, data * -1n);
	else return encodeLength(0, data);
}
var ENCODER = new TextEncoder();
function encodeString(data, output) {
	output.push(...encodeLength(3, data.length));
	output.push(ENCODER.encode(data));
}
function encodeBytes(data, output) {
	output.push(...encodeLength(2, data.length));
	output.push(data);
}
function encodeArray(data, output) {
	output.push(...encodeLength(4, data.length));
	for (const element of data) encodePartialCBOR(element, output);
}
function encodeMap(data, output) {
	output.push(new Uint8Array(encodeLength(5, data.size)));
	for (const [key, value] of data.entries()) {
		encodePartialCBOR(key, output);
		encodePartialCBOR(value, output);
	}
}
function encodeTag(tag, output) {
	output.push(...encodeLength(6, tag.tag));
	encodePartialCBOR(tag.value, output);
}
function encodePartialCBOR(data, output) {
	if (typeof data == "boolean" || data === null || data == void 0) {
		output.push(encodeSimple(data));
		return;
	}
	if (typeof data == "number" || typeof data == "bigint") {
		output.push(...encodeNumber(data));
		return;
	}
	if (typeof data == "string") {
		encodeString(data, output);
		return;
	}
	if (data instanceof Uint8Array) {
		encodeBytes(data, output);
		return;
	}
	if (Array.isArray(data)) {
		encodeArray(data, output);
		return;
	}
	if (data instanceof Map) {
		encodeMap(data, output);
		return;
	}
	if (data instanceof CBORTag) {
		encodeTag(data, output);
		return;
	}
	throw new Error("Not implemented");
}
/**
* Like {decodeCBOR}, but the length of the data is unknown and there is likely
* more -- possibly unrelated non-CBOR -- data afterwards.
*
* Examples:
*
* ```ts
* import {decodePartialCBOR} from './cbor.ts'
* decodePartialCBOR(new Uint8Array([1, 2, 245, 3, 4]), 2)
* // returns [true, 1]
* // It did not decode the leading [1, 2] or trailing [3, 4]
* ```
*
* @param data a data stream to read data from
* @param index where to start reading in the data stream
* @returns a tuple of the value followed by bytes read.
* @throws {Error}
*   When the data stream ends early or the CBOR data is not well formed
*/
function decodePartialCBOR(data, index) {
	if (data.byteLength === 0 || data.byteLength <= index || index < 0) throw new Error("No data");
	if (data instanceof Uint8Array) return decodeNext(new DataView(data.buffer), index);
	else if (data instanceof ArrayBuffer) return decodeNext(new DataView(data), index);
	return decodeNext(data, index);
}
/**
* Encode a supported structure to a CBOR byte string.
*
* Example:
*
* ```ts
* import {encodeCBOR, CBORType, CBORTag} from './cbor.ts'
* encodeCBOR(new Map<string | number, CBORType>([
*   ["key", "value"],
*   [1, "another value"]
* ]));
* // returns new Uint8Array([162, 99, 107, 101, 121, 101, 118, 97, 108, 117, 101, 1, 109, 97, 110, 111, 116, 104, 101, 114, 32 118, 97, 108, 117, 101])
*
* encodeCBOR(new CBORTag(1234, "hello"))
* // returns new UInt8Array([217, 4, 210, 101, 104, 101, 108, 108, 111])
* ```
*
* @param data Data to encode
* @returns A byte string as a Uint8Array
* @throws Error
*   if unsupported data is found during encoding
*/
function encodeCBOR(data) {
	const results = [];
	encodePartialCBOR(data, results);
	let length = 0;
	for (const result of results) if (typeof result == "number") length += 1;
	else length += result.length;
	const output = new Uint8Array(length);
	let index = 0;
	for (const result of results) if (typeof result == "number") {
		output[index] = result;
		index += 1;
	} else {
		output.set(result, index);
		index += result.length;
	}
	return output;
}
//#endregion
export { encodeCBOR as n, decodePartialCBOR as t };
