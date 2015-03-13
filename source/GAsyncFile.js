/*
 * Gamalto.AsyncFile
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
	gamalto.require_("File");
	gamalto.using_("Async");
	gamalto.using_("Promise");

	/**
	 * @constructor
	 */
	var _Object = G.AsyncFile = function() {
		Object.base(this);
	}

	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.File);

	proto.getReader_ = function() {
		return this.reader_;
	}

	proto.isAsync = function() {
		return true;
	}

	proto.info_ = function() {
		var that = this,
			promise = new G.Promise();

		this.send_(this.open_(function(r) {
			var state = that.onInfoReceived_(r);
			if (state == r.DONE) {
				// TODO: handle error with "status"
				promise.resolve(that);
			}
		}, "HEAD"));

		return promise;
	}

	proto.range_ = function() {
		var that = this,
			promise = new G.Promise();

		this.send_(this.openRange_(function(r) {
			var state = that.onRangeReceived_(r);
			if (state == r.DONE) {
				// TODO: handle error with "status"
				promise.resolve(that);
			}
		}));

		return promise;
	}

	proto.ensureCapacity_ = function(size) {
		// Read new buffer...
		return (this.shouldRead_(size))
			? this.range_(size) 
			: G.Async.immediate();
	}

	proto.readAny_ = function(size, method) {
		var that = this;
		return this.ensureCapacity_(size).then(function() {
			return _Object.base[method].call(that);
		});
	}

	proto.readByte_ = function() {
		return _Object.base.readUInt8.call(this);
	}

	proto.readUInt8 = function() {
		return this.readAny_(1, "readUInt8");
	}

	proto.readSInt8 = function() {
		return this.readAny_(1, "readSInt8");
	}

	/* Big Endian */

	proto.readUInt16BE = function() {
		return this.readAny_(2, "readUInt16BE");
	};

	proto.readSInt16BE = function() {
		return this.readAny_(2, "readSInt16BE");
	};

	proto.readSInt32BE = function() {
		return this.readAny_(4, "readSInt32BE");
	}

	proto.readUInt32BE = function() {
		return this.readAny_(4, "readUInt32BE");
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function() {
		return this.readAny_(2, "readUInt16LE");
	}

	proto.readSInt16LE = function() {
		return this.readAny_(2, "readSInt16LE");
	}

	proto.readSInt32LE = function(at) {
		return this.readAny_(4, "readSInt32LE");
	}

	proto.readUInt32LE = function(at) {
		return this.readAny_(4, "readUInt32LE");
	}

	proto.readString = function(length, stopChar) {
		var c,
			i = 0,
			s = "",
			that = this;

		return this.ensureCapacity_(length).then(function() {
			for (i = 0; i < length & 0xffff; i++) {
				if ((c = that.readByte_()) == (stopChar | 0)) { break; }
				s += String.fromCharCode(c);
			}
			return s;
		});
	}

	proto.read = function(buffer, size) {
		var that = this;

		return this.ensureCapacity_(size).then(function() {
			while (size--) {
				buffer.writeInt8(that.readByte_());
			}
		});
	}
	
})();
