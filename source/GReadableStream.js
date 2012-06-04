/*
 * Gamalto.ReadableStream
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

For production software, the copyright notice only is required. You must also
display a splash screen showing the Gamalto logo in your game of other software
made using this middleware.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 *
 */

(function() {

	/**
	 * @constructor
	 */
	G.ReadableStream = function(size) {
		this._alloc(size);
		this._position = 0;
	}
	
	/* Inheritance and shortcut */
	var proto = G.ReadableStream.inherits(G.Object);

	proto._alloc = function(size) {
		this._data = Array(size + 1).join(String.fromCharCode(0)).split("");
	}

	proto.readByte = function() {
		return this._getByteAt(this._position++);
	}

	/* Big Endian */

	proto.readUInt16BE = function() {
		var b = this.readByte(),
			a = this.readByte();
		return (b << 8) | a;
	}

	proto.readSInt16BE = function() {
		return G.Convert.toSInt16(this.readUInt16LE());
	}
	
	proto.readUInt32BE = function() {
		var d = this.readByte(),
			c = this.readByte(),
			b = this.readByte(),
			a = this.readByte();
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32BE = function() {
		return G.Convert.toSInt32(this.readUInt32BE());
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function() {
		var a = this.readByte(),
			b = this.readByte();
		return (b << 8) | a;
	}

	proto.readSInt16LE = function() {
		return G.Convert.toSInt16(this.readUInt16LE());
	}

	proto.readUInt32LE = function() {
		var a = this.readByte(),
			b = this.readByte(),
			c = this.readByte(),
			d = this.readByte();
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32LE = function() {
		return G.Convert.toSInt32(this.readUInt32LE());
	}

	proto.readString = function(length, stopChar) {
		var c, s = "";
		for (var i = 0; i < length & 0xffff; i++) {
			if ((c = this.readByte()) == (stopChar | 0)) { break; }
			s += String.fromCharCode(c);
		}
		return s;
	}

	proto.rewind = function() {
		this._position = 0;
	}

	proto._getByteAt = function(position) {
		return this._data[position].charCodeAt(0) & 0xff;
	}

})();
