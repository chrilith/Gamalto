/*
 * Gamalto.ArrayReader
 * -------------------
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

(function() {

	var _Object = G.ArrayReader = function(buffer) {
		this.buffer = buffer;
		this.byteLength = buffer.length;
	},
	proto = _Object.inherits(G.Object);

	proto.readByte_ = function(byteOffset) {
		return this.buffer[byteOffset] & 0xff;
	};

	proto.getUint8 = function(byteOffset) {
		return this.readByte_(byteOffset);
	};

	proto.getUint16 = function(byteOffset, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 2;
			inc = -1;
		}
		var a = this.readByte_(byteOffset += inc),
			b = this.readByte_(byteOffset += inc);
		return (b << 8) | a;
	};

	proto.getUint32 = function(byteOffset, littleEndian) {
		return this.getInt32(byteOffset, littleEndian) >>> 0;
	};

	proto.getInt8 = function(byteOffset) {
		return this.getUint8(byteOffset) << 24 >> 24;
	};

	proto.getInt16 = function(byteOffset, littleEndian) {
		return this.getUint16(byteOffset, littleEndian) << 16 >> 16;
	};

	proto.getInt32 = function(byteOffset, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 4;
			inc = -1;
		}
		var a = this.readByte_(byteOffset += inc),
			b = this.readByte_(byteOffset += inc),
			c = this.readByte_(byteOffset += inc),
			d = this.readByte_(byteOffset += inc);
		return (d << 24) | (c << 16) | (b << 8) | a;
	};

})();
