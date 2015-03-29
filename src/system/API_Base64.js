/*
 * API HTML5 Base64 utility methods
 * --------------------------------
 * 
 * Implementation: btoa()
 * Implementation: atob()
 *
 * See: http://www.w3.org/TR/html5/webappapis.html#windowbase64
 * 
 * --------------------------------
 * 

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 *
 */

(function(global) {

	/* Enable standard version of the methods */
	Object.defineMethod(global, "btoa", implBtoA);
	Object.defineMethod(global, "atob", implAtoB);

	// API IMPLETENTATION //

	var enc64 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
				 "abcdefghijklmnopqrstuvwxyz" +
				 "0123456789+/=").split("");

	// EXTENSION FUNCTIONS //

	function implBtoA(binary) {
		var chr1, chr2, chr3, bits,
			enc1, enc2, enc3, enc4,
			output = "", i = 0;

		while (i < binary.length) {
			chr1 = binary.charCodeAt(i++);
			chr2 = binary.charCodeAt(i++);
			chr3 = binary.charCodeAt(i++);

			if (chr1 > 0xff || (chr2 | 0) > 0xff || (chr3 | 0) > 0xff) {
				throw new Error("InvalidCharacterError");
			}

			bits =	chr1 << 16 |
					chr2 <<  8 |
					chr3 <<  0;

			enc1 = bits >> 3 * 6 & 0x3f;
			enc2 = bits >> 2 * 6 & 0x3f;
			enc3 = bits >> 1 * 6 & 0x3f;
			enc4 = bits >> 0 * 6 & 0x3f;

			if (isNaN(chr2)) { enc3 = 64; }
			if (isNaN(chr3)) { enc4 = 64; }

			output += enc64[enc1] + enc64[enc2] + enc64[enc3] + enc64[enc4];
		}

		return output;
	}

	function implAtoB(data) {
		var chr1, chr2, chr3, bits, len,
			dec1, dec2, dec3, dec4,
			output = "", i = 0;

		while (i < data.length) {
			dec1 = enc64.indexOf(data.charAt(i++));
			dec2 = enc64.indexOf(data.charAt(i++) || "=");
			dec3 = enc64.indexOf(data.charAt(i++) || "=");
			dec4 = enc64.indexOf(data.charAt(i++) || "=");

			// Need at least 2 characters excluding =
			if (dec2 == 64) {
				throw new Error("InvalidCharacterError");
			}

			bits =	dec1 << 3 * 6 |
					dec2 << 2 * 6 |
					dec3 << 1 * 6 |
					dec4 << 0 * 6;

			chr1 = bits >> 16 & 0xff;
			chr2 = bits >>  8 & 0xff;
			chr3 = bits >>  0 & 0xff;

			output += String.fromCharCode(chr1);
			if (dec3 != 64) { output += String.fromCharCode(chr2); }
			if (dec4 != 64) { output += String.fromCharCode(chr3); }
		}

		return output;
	}

})(this);
