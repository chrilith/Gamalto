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
		this._unit = 0;
	}

	/* Inheritance and shortcut */
	var proto = G.ReadableStream.inherits(G.Object);

	proto._alloc = function(size) {
		if (size > 0) {
			this.length = size;
			this._data = Array(size + 1).join(String.fromCharCode(0)).split("");
		}
	}

	proto._readByte = function(position) {
		return this._data[position].charCodeAt(0) & 0xff;
	}

	proto._at = function(at) {
		if (isNaN(at)) {
			at  = this._position++;	// Read at the current position and increment
		} else {
			at <<= this._unit;
		}
		return at;
	}

	proto.readUInt8 = function(at) {
		return this._readByte(this._at(at));
	}

	proto.readSInt8 = function(at) {
		return G.Convert.toSInt8(this.readUInt8(at));
	}

	/* Big Endian */

	proto.readUInt16BE = function(at) {
		var p = this._at(at),
			b = this._readByte(p + 0),
			a = this._readByte(p + 1);
		return (b << 8) | a;
	}

	proto.readSInt16BE = function(at) {
		return G.Convert.toSInt16(this.readUInt16LE(at));
	}

	proto.readUInt32BE = function(at) {
		var p = this._at(at),
			d = this._readByte(p + 0),
			c = this._readByte(p + 1),
			b = this._readByte(p + 2),
			a = this._readByte(p + 3);
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32BE = function(at) {
		return G.Convert.toSInt32(this.readUInt32BE(at));
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function(at) {
		var p = this._at(at),
			a = this._readByte(p + 0),
			b = this._readByte(p + 1);
		return (b << 8) | a;
	}

	proto.readSInt16LE = function(at) {
		return G.Convert.toSInt16(this.readUInt16LE(at));
	}

	proto.readUInt32LE = function(at) {
		var p = this._at(at),
			a = this._readByte(p + 0),
			b = this._readByte(p + 1),
			c = this._readByte(p + 2),
			d = this._readByte(p + 3);
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32LE = function(at) {
		return G.Convert.toSInt32(this.readUInt32LE(at));
	}

	proto.readString = function(length, stopChar) {
		var c, s = "";
		for (var i = 0; i < length & 0xffff; i++) {
			if ((c = this.readUInt8()) == (stopChar | 0)) { break; }
			s += String.fromCharCode(c);
		}
		return s;
	}

	proto.pos = function(offset) {
		return this._position + (offset | 0);
	}

	proto.eos = function() {
		return this.pos() >= this.length;
	}

	proto.seek = function(offset, origin) {
		var C = G.Stream,
			undef;

		if (origin === undef) {
			origin = C.SEEK_SET;
		}

		switch (origin) {
			case C.SEEK_SET:
				this._position = offset;
				break;

			case C.SEEK_CUR:
				this._position += offset;
				break;

			case C.SEEK_END:
				this._position = this.length - offset;
				break;
		}
	}

	proto.rew = function(by) {
		this.seek(-(by || 1) << this._unit, G.Stream.SEEK_CUR);
	}

	proto.fwd = function(by) {
		this.seek(+(by || 1) << this._unit, G.Stream.SEEK_CUR);
	}

})();
