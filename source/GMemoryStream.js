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
	G.MemoryStream = function(size, len) {
		Object.base(this, size * (len || 1));
	}

	/* Inheritance and shortcut */
	var proto = G.MemoryStream.inherits(G.ReadStream);
	
	proto.writeByte = function(data, at) {
		if (isNaN(at)) { at = this._position++; }
		this._data[this._startAt + at] = String.fromCharCode(data & 0xff);
	}

	/* Big Endian */

	proto.writeInt16BE = function(data, at) {
		this.writeByte((data >> 8) & 0xff, at + 0);
		this.writeByte((data     ) & 0xff, at + 1);
	}

	proto.writeInt32BE = function(data, at) {
		this.writeByte((data >> 24) & 0xff, at + 0);
		this.writeByte((data >> 16) & 0xff, at + 1);
		this.writeByte((data >>  8) & 0xff, at + 2);
		this.writeByte((data      ) & 0xff, at + 3);
	}	

	/* Little Endian (JavaScript is little endian) */
	
	proto.writeInt16LE = function(data, at) {
		this.writeByte((data     ) & 0xff, at + 0);
		this.writeByte((data >> 8) & 0xff, at + 1);
	}
	
	proto.writeInt32LE = function(data, at) {
		this.writeByte((data      ) & 0xff, at + 2);
		this.writeByte((data >>  8) & 0xff, at + 3);
		this.writeByte((data >> 16) & 0xff, at + 4);
		this.writeByte((data >> 24) & 0xff, at + 5);
	}

	proto.writeString = function(str, stopChar) {
		var i, c;
		for (i = 0; i < str.length; i++) {
			if ((c = str.charCodeAt(i)) == (stopChar | 0)) { break; }
			this.writeByte(c);
		}
	}

	proto.copy = function(dest, length) {
		while(length-- > 0) {
			dest.writeByte(this.readByte());
		}
	}

	proto.fill = function(value, length) {
		while(length-- > 0) {
			this.writeByte(value);
		}
	}

})();
