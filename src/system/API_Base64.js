/*
 * API HTML5 Base64 utility methods
 * --------------------------------
 * Implementation: btoa()
 * Implementation: atob()
 *
 * See: http://www.w3.org/TR/html5/webappapis.html#windowbase64
 * --------------------------------
 * 
 * This file is part of the GAMALTO JavaScript Development Framework.
 * http://www.gamalto.com/
 *

Copyright (C)2012-20XX Chris Apers and The GAMALTO Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

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

			// Check for invalid character
			if (dec1 == -1 || dec2 == -1 || dec3 == -1 || dec4 == -1 ||
				// Need at least 2 characters excluding =
				dec2 == 64) {
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
