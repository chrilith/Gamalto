/*
 * Gamalto.ReadableStream
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012-2013 Chris Apers and The Gamalto Project, all rights reserved.

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
	gamalto.require_("ReadableStream");

	/**
	 * @constructor
	 */
	var _Object = G.StreamReader = function(data, unit) {
		Object.base(this);
		data = data || "";

		this.setUnit(unit);
		// Default value, may be changed making a view stream using ptr()
		this.startAt_ = 0;

		var reader, type = (typeof data);
		// Initializing with a string?
		if (type == 'string') {
			reader = new G.TextReader(data);

		// or an object?
		} else if (type == 'object') {
			// Typed array or classic array?
			reader = new ((data.byteLength) ? DataView : G.ArrayReader)(data);
		}

		this.reader_ = reader;
		// compute the stream length
		this.length = data.length || data.byteLength | 0;
		// Direct access to the buffer
		this.buffer = data;
	},

	/* Inheritance and shortcut */
	proto = _Object.inherits(G.ReadableStream);

	proto.at_ = function(len, from) {
		return _Object.base.at_.call(this, len, from) + this.startAt_;
	};

	/**
	 * Gets the position of the stream pointer at the given offset.
	 * If no offset is specified, this method will act as the #tell() method.
	 * 
	 * @param  {Number} [offset]
	 *     The offset to be applied.
	 * 
	 * @return {Number} The position at the given offset.
	 */
	proto.addr = function(offset) {
		return this.tell() + (+offset | 0);
	};

	/**
	 * Sets the data pointer unit. The read/write position will be based on this value.
	 * 
	 * @param  {Number} unit
	 *     The new data pointer unit.
	 * 
	 * @return {[type]} The previous data pointer unit.
	 */
	proto.setUnit = function(unit) {
		var old = this.unit_;
		this.unit_ = (+unit | 0 || 1) >> 1;
		return 1 << old;
	};

	proto.getUnit = function() {
		return 1 << this.unit_;
	};

	proto.ptr = function(offset, relative) {
		// Create a new stream
		var	clone = new this.constructor(this.buffer, this.getUnit());

		// No parameter get a pointer to the current position
		if (isNaN(offset)) {
			offset = this.tell();
		} else if (relative) {
			offset += this.tell();
		}

		// new pointer position
		clone.startAt_ = (offset << this.unit_) + this.startAt_;
		clone.length = this.length - clone.startAt_ + this.startAt_;

		return clone;
	};

})();
