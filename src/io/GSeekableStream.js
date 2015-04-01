/*
 * Gamalto.SeekableStream
 * ----------------------
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

	gamalto.devel.require("Stream");

	/**
	 * Base object to create seekable streams. It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.SeekableStream
	 * @augments Gamalto.Stream
	 */
	var _Object = G.SeekableStream = function() {
		Object.base(this);
	},

	/** @alias Gamalto.SeekableStream.prototype */
	proto = _Object.inherits(G.Stream);

	/**
	 * Changes the position of the stream pointer.
	 *
	 * @param  {number}  offset
	 *     Offset to be applied to the stream pointer.
	 * @param  {number} [origin]
	 *         Origin of the position change. Defaults to [SEEK_CUR]{@link Gamalto.SeekableStream#SEEK_CUR}.	
	 * 
	 * @see [SEEK_SET]{@link Gamalto.SeekableStream#SEEK_SET}
	 * @see [SEEK_CUR]{@link Gamalto.SeekableStream#SEEK_CUR}
	 * @see [SEEK_END]{@link Gamalto.SeekableStream#SEEK_END}
	 */
	proto.seek = function(offset, origin) {
		var C = this,
			undef;

		if (origin === undef) {
			origin = C.SEEK_CUR;
		}

		switch (origin) {
			case C.SEEK_SET:
				this.position_ = offset;
				break;

			case C.SEEK_CUR:
				this.position_ += offset;
				break;

			case C.SEEK_END:
				this.position_ = this.length + offset;
				break;
		}
	};

	/**
	 * Sets the stream pointer to the beginning of the stream.
	 */
	proto.rewind = function() {
		this.seek(0, this.SEEK_SET);
	};

	/**
	 * Position is from the start of the stream.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.SEEK_SET = 0;
	/**
	 * Position is from the current stream position.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.SEEK_CUR = 1;
	/**
	 * Position is from the end of the stream.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.SEEK_END = 2;

})();
