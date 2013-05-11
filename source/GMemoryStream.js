/*
 * Gamalto.MemoryStream
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
	gamalto.require("ReadStream");

	/**
	 * @constructor
	 */
	G.MemoryStream = function(size, unit) {
		var method, data, tmp;

		// Do we have a source data?
		if (size instanceof Array) {
			data = size;
			size = data.length;
		}

		// Base constructor
		Object.base(this, size, unit);

		// Copy data if any...
		if (data) {
			method = "writeInt" + ((unit == 4) ? "32LE" : (unit == 2) ? "16LE" : "8");
			tmp = this.ptr();
			for (var i = 0; i < size; i++) {
				tmp[method](data[i]);
			}
		}
	}

	/* Inheritance and shortcut */
	var proto = G.MemoryStream.inherits(G.ReadStream);

	proto._writeByte = function(data, position) {
		data = (this._native) ? String.fromCharCode(data & 0xff) : data;
		this._data[this._startAt + position] = data;
	}

	proto.writeInt8 = function(data, at) {
		at = this._at(at);
		this._writeByte(data, at);
	}

	/* Big Endian */

	proto.writeInt16BE = function(data, at) {
		at = this._at(at);
		this._writeByte((data >> 8), at + 0);
		this._writeByte((data     ), at + 1);
	}

	proto.writeInt32BE = function(data, at) {
		at = this._at(at);
		this._writeByte((data >> 24), at + 0);
		this._writeByte((data >> 16), at + 1);
		this._writeByte((data >>  8), at + 2);
		this._writeByte((data      ), at + 3);
	}	

	/* Little Endian (JavaScript is little endian) */
	
	proto.writeInt16LE = function(data, at) {
		at = this._at(at);
		this._writeByte((data     ), at + 0);
		this._writeByte((data >> 8), at + 1);
	}
	
	proto.writeInt32LE = function(data, at) {
		at = this._at(at);
		this._writeByte((data      ), at + 0);
		this._writeByte((data >>  8), at + 1);
		this._writeByte((data >> 16), at + 2);
		this._writeByte((data >> 24), at + 3);
	}

	proto.writeString = function(str, stopChar) {
		var i, c;
		for (i = 0; i < str.length; i++) {
			if ((c = str.charCodeAt(i)) == (stopChar | 0)) { break; }
			this.writeInt8(c);
		}
	}

	proto.copy = function(src, length) {
		while(length-- > 0) {
			this.writeInt8(src.readUInt8());
		}
	}

	proto.fill = function(value, length) {
		while(length-- > 0) {
			this.writeInt8(value);
		}
	}

})();
