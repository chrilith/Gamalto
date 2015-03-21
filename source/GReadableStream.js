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

	/**
	 * Base object to create readable stream. It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.ReadableStream
	 * @augments Gamalto.SeekableStream
	 */
	var _Object = G.ReadableStream = function() {
		Object.base(this);

		/**
		 * The DataView or ArrayReader instance used to access stream data.
		 * 
		 * @ignore
		 * @protected
		 * 
		 * @member {Object}
		 */
		this.reader_ = null;

		/**
		 * The data pointer unit. For instance 4 for Uint32.
		 * Internally changed into a power of 2. Defaults to 0.
		 * 
		 * @ignore
		 * @protected
		 * 
		 * @member {Number}
		 */
		this.unit_ = 0;
	},

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
	proto.at_ = function(len, from) {
		var undef;

		if (from === undef) {
			// Read from the current position...
			from = this.position_;
			// ...and increment pointer
			this.position_ += len;
		} else {
			// Position is based on the stream unit
			from <<= this.unit_;
		}
		return from;
	}

	proto.littleEndian = function(isOn) {
		this.le_ = isOn;
	}

	proto.readUint8 = function(at) {
		return this.reader_.getUint8(this.at_(1, at));
	}

	proto.readInt8 = function(at) {
		return this.reader_.getInt8(this.at_(1, at));
	}

	proto.readUint16 = function(at) {
		return this.reader_.getUint16(this.at_(2, at), this.le_);
	}

	proto.readInt16 = function(at) {
		return this.reader_.getInt16(this.at_(2, at), this.le_);
	}

	proto.readUint32 = function(at) {
		return this.reader_.getUint32(this.at_(4, at), this.le_);
	}

	proto.readInt32 = function(at) {
		return this.reader_.getInt32(this.at_(4, at), this.le_);
	}

	proto.readString = function(length, stopChar) {
		var i, c, s = "", shouldStop;

		for (i = 0; i < length & 0xffff; i++) {
			shouldStop = ((c = this.readUint8()) == (stopChar | 0));
			s += String.fromCharCode(c);
			if (shouldStop) { break; }
		}

		return s;
	}

})();
