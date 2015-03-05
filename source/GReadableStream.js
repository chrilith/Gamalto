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

	/* Dependencies */
	gamalto.require_("SeekableStream");
	gamalto.using_	("Convert");

	/**
	 * Base object to create readable stream.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.ReadableStream
	 * @augments Gamalto.SeekableStream
	 */
	var _Object = G.ReadableStream = function(unit) {
		Object.base(this);
		/**
		 * The unit of the data. For instance 4 for UInt32.
		 * Will be converted into ceofficient.
		 * 
		 * @ignore
		 * @member {Number}
		 */
		this._unit = (+unit | 0 || 1) >> 1;
	},
	_converter = G.Convert,

	/* Inheritance and shortcut */

	/** @alias Gamalto.ReadableStream.prototype */
	proto = _Object.inherits(G.SeekableStream);

	/* Instance methods */

	/**
	 * Utility method to compute stream access position based on the stream unit.
	 * 
	 * @ignore
	 * @protected
	 * 
	 * @param  {Number} len
	 *     The number of bytes to be accessed.
	 * @param  {Number} [from]
	 *     The position from where to access the stream data in stream unit.
	 *     Defaults to the current stream position.
	 *     Setting this parameter will not increment stream position.
	 *
	 * @return {Number} The position from where to access stream data in bytes.
	 */
	proto._at = function(len, from) {
		var undef;

		if (from === undef) {
			// Read from the current position...
			from = this._position;
			// ...and increment pointer
			this._position += len;
		} else {
			// Position is based on the stream unit
			from <<= this._unit;
		}
		return from;
	}

	/**
	 * Main method to read data from teh sream.
	 *
	 * @ignore
	 * @protected
	 * @abstract
	 * 
	 * @param  {[type]} [position]
	 *     The position from where to read a byte.
	 */
	proto._readByte = function(position) {
		gamalto.error_("_readByte(position) is not implemented");
	}

	proto.readUInt8 = function(at) {
		return this._readByte(this._at(1, at));
	}

	proto.readSInt8 = function(at) {
		return _converter.toSInt8(this.readUInt8(at));
	}

	/* Big Endian */

	proto.readUInt16BE = function(at) {
		var p = this._at(2, at),
			b = this._readByte(p + 0),
			a = this._readByte(p + 1);
		return (b << 8) | a;
	}

	proto.readSInt16BE = function(at) {
		return _converter.toSInt16(this.readUInt16LE(at));
	}

	proto.readUInt32BE = function(at) {
		var p = this._at(4, at),
			d = this._readByte(p + 0),
			c = this._readByte(p + 1),
			b = this._readByte(p + 2),
			a = this._readByte(p + 3);
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32BE = function(at) {
		return _converter.toSInt32(this.readUInt32BE(at));
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function(at) {
		var p = this._at(2, at),
			a = this._readByte(p + 0),
			b = this._readByte(p + 1);
		return (b << 8) | a;
	}

	proto.readSInt16LE = function(at) {
		return _converter.toSInt16(this.readUInt16LE(at));
	}

	proto.readUInt32LE = function(at) {
		var p = this._at(4, at),
			a = this._readByte(p + 0),
			b = this._readByte(p + 1),
			c = this._readByte(p + 2),
			d = this._readByte(p + 3);
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32LE = function(at) {
		return _converter.toSInt32(this.readUInt32LE(at));
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
		return this._position + (+offset | 0);
	}

	proto.rew = function(by) {
		this.seek(-(+by | 0 || 1) << this._unit, G.Stream.SEEK_CUR);
	}

	proto.fwd = function(by) {
		this.seek(+(+by | 0 || 1) << this._unit, G.Stream.SEEK_CUR);
	}

})();
