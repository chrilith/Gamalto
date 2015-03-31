/*
 * Gamalto.ArrayWriter
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

	var _Object = G.ArrayWriter = function(buffer) {
		this.buffer = buffer;
		this.byteLength = buffer.length;
	},
	proto = _Object.inherits(G.Object);

	proto.writeByte_ = function(byteOffset, value) {
		this.buffer[byteOffset] = value & 0xff;
	};

	proto.setInt8 = proto.setUint8 = function(byteOffset, value) {
		this.writeByte_(byteOffset, value);
	};

	proto.setInt16 = proto.setUint16 = function(byteOffset, value, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 2;
			inc = -1;
		}
		this.writeByte_(byteOffset += inc, (value     ));
		this.writeByte_(byteOffset += inc, (value >> 8));
	};

	proto.setInt32 = proto.setUint32 = function(byteOffset, value, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 4;
			inc = -1;
		}
		this.writeByte_(byteOffset += inc, (value      ));
		this.writeByte_(byteOffset += inc, (value >>  8));
		this.writeByte_(byteOffset += inc, (value >> 16));
		this.writeByte_(byteOffset += inc, (value >> 24));
	};

})();
