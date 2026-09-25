//#region node_modules/@hexagon/base64/src/base64.js
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var charsUrl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var genLookup = (target) => {
	const lookupTemp = typeof Uint8Array === "undefined" ? [] : /* @__PURE__ */ new Uint8Array(256);
	const len = 64;
	for (let i = 0; i < len; i++) lookupTemp[target.charCodeAt(i)] = i;
	return lookupTemp;
};
var lookup = genLookup(chars);
var lookupUrl = genLookup(charsUrl);
/**
* Pre-calculated regexes for validating base64 and base64url
*/
var base64UrlPattern = /^[-A-Za-z0-9\-_]*$/;
var base64Pattern = /^[-A-Za-z0-9+/]*={0,3}$/;
/**
* @namespace base64
*/
var base64 = {};
/**
* Convenience function for converting a base64 encoded string to an ArrayBuffer instance
* @public
* 
* @param {string} data - Base64 representation of data
* @param {boolean} [urlMode] - If set to true, URL mode string will be expected
* @returns {ArrayBuffer} - Decoded data
*/
base64.toArrayBuffer = (data, urlMode) => {
	const len = data.length;
	let bufferLength = data.length * .75, i, p = 0, encoded1, encoded2, encoded3, encoded4;
	if (data[data.length - 1] === "=") {
		bufferLength--;
		if (data[data.length - 2] === "=") bufferLength--;
	}
	const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer), target = urlMode ? lookupUrl : lookup;
	for (i = 0; i < len; i += 4) {
		encoded1 = target[data.charCodeAt(i)];
		encoded2 = target[data.charCodeAt(i + 1)];
		encoded3 = target[data.charCodeAt(i + 2)];
		encoded4 = target[data.charCodeAt(i + 3)];
		bytes[p++] = encoded1 << 2 | encoded2 >> 4;
		bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
		bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	}
	return arraybuffer;
};
/**
* Convenience function for creating a base64 encoded string from an ArrayBuffer instance
* @public
* 
* @param {ArrayBuffer} arrBuf - ArrayBuffer to be encoded
* @param {boolean} [urlMode] - If set to true, URL mode string will be returned
* @returns {string} - Base64 representation of data
*/
base64.fromArrayBuffer = (arrBuf, urlMode) => {
	const bytes = new Uint8Array(arrBuf);
	let i, result = "";
	const len = bytes.length, target = urlMode ? charsUrl : chars;
	for (i = 0; i < len; i += 3) {
		result += target[bytes[i] >> 2];
		result += target[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
		result += target[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
		result += target[bytes[i + 2] & 63];
	}
	const remainder = len % 3;
	if (remainder === 2) result = result.substring(0, result.length - 1) + (urlMode ? "" : "=");
	else if (remainder === 1) result = result.substring(0, result.length - 2) + (urlMode ? "" : "==");
	return result;
};
/**
* Convenience function for converting base64 to string
* @public
* 
* @param {string} str - Base64 encoded string to be decoded
* @param {boolean} [urlMode] - If set to true, URL mode string will be expected
* @returns {string} - Decoded string
*/
base64.toString = (str, urlMode) => {
	return new TextDecoder().decode(base64.toArrayBuffer(str, urlMode));
};
/**
* Convenience function for converting a javascript string to base64
* @public
* 
* @param {string} str - String to be converted to base64
* @param {boolean} [urlMode] - If set to true, URL mode string will be returned
* @returns {string} - Base64 encoded string
*/
base64.fromString = (str, urlMode) => {
	return base64.fromArrayBuffer(new TextEncoder().encode(str), urlMode);
};
/**
* Function to validate base64
* @public
* @param {string} encoded - Base64 or Base64url encoded data
* @param {boolean} [urlMode] - If set to true, base64url will be expected
* @returns {boolean} - Valid base64/base64url?
*/
base64.validate = (encoded, urlMode) => {
	if (!(typeof encoded === "string" || encoded instanceof String)) return false;
	try {
		return urlMode ? base64UrlPattern.test(encoded) : base64Pattern.test(encoded);
	} catch (_e) {
		return false;
	}
};
base64.base64 = base64;
//#endregion
export { base64 as t };
