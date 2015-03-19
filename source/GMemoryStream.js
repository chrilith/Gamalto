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

(function(global) {

	/* Dependencies */
	gamalto.require_("StreamReader");
	gamalto.using_	("ArrayWriter");

	/**
	 * @constructor
	 */
	G.MemoryStream = function(size, unit) {
		// Do we have a source data?
		var data = typeof size == 'object' ? size : this.alloc_(+size);

		// Base constructor
		Object.base(this, data, unit);
		this.writer_ = (data.byteLength) ? this.reader_ : new G.ArrayWriter(data);
	}

	/* Inheritance and shortcut */
	var proto = G.MemoryStream.inherits(G.StreamReader);

	proto.alloc_ = function(size) {
		return new (global.ArrayBuffer || Array)(size);
	}

	proto.writeInt8 = function(data, at) {
		this.writer_.setInt8(this.at_(1, at), data);
	}

	proto.writeInt16 = function(data, at) {
		this.writer_.setInt16(this.at_(2, at), data, this.le_);
	}

	proto.writeInt32 = function(data, at) {
		this.writer_.setInt32(this.at_(4, at), data, this.le_);
	}

	proto.writeString = function(str, stopChar) {
		var i, c;
		for (i = 0; i < str.length; i++) {
			if ((c = str.charCodeAt(i)) == (stopChar | 0)) { break; }
			this.writeInt8(c);
		}
	}

	proto.copy = function(src, length) {
		if (this.buffer.set && src.buffer.subarray) {
			var pos = src.addr(),
				src = src.buffer.subarray(pos, pos + length);
			this.buffer.set(src, this.addr());
		} else {
			while(length-- > 0) {
				this.writeInt8(src.readUint8());
			}
		}
	}

	proto.fill = function(value, length) {
		while(length-- > 0) {
			this.writeInt8(value);
		}
	}

})(this);
