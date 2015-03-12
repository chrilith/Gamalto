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

	proto._getReader = function() {
		return this._reader;
	}

	proto.isAsync = function() {
		return true;
	}

	proto._info = function() {
		var that = this,
			promise = new G.Promise();

		this._send(this._open(function(r) {
			var state = that._infoHandler(r);
			if (state == r.DONE) {
				// TODO: handle error with "status"
				promise.resolve(that);
			}
		}, "HEAD"));

		return promise;
	}

	proto._part = function() {
		var that = this,
			promise = new G.Promise();

		this._send(this._openPart(function(r) {
			var state = that._partHandler(r);
			if (state == r.DONE) {
				// TODO: handle error with "status"
				promise.resolve(that);
			}
		}));

		return promise;
	}

	proto._ensureCapacity = function(size) {
		// Read new buffer...
		return (this._shouldRead(size))
			? this._part(size) 
			: G.Async.immediate();
	}

	proto._readAny = function(size, method) {
		var that = this;
		return this._ensureCapacity(size).then(function() {
			return _Object.base[method].call(that);
		});
	}

	proto._readByte = function() {
		return _Object.base.readUInt8.call(this);
	}

	proto.readUInt8 = function() {
		return this._readAny(1, "readUInt8");
	}

	proto.readSInt8 = function() {
		return this._readAny(1, "readSInt8");
	}

	/* Big Endian */

	proto.readUInt16BE = function() {
		return this._readAny(2, "readUInt16BE");
	};

	proto.readSInt16BE = function() {
		return this._readAny(2, "readSInt16BE");
	};

	proto.readSInt32BE = function() {
		return this._readAny(4, "readSInt32BE");
	}

	proto.readUInt32BE = function() {
		return this._readAny(4, "readUInt32BE");
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function() {
		return this._readAny(2, "readUInt16LE");
	}

	proto.readSInt16LE = function() {
		return this._readAny(2, "readSInt16LE");
	}

	proto.readSInt32LE = function(at) {
		return this._readAny(4, "readSInt32LE");
	}

	proto.readUInt32LE = function(at) {
		return this._readAny(4, "readUInt32LE");
	}

	proto.readString = function(length, stopChar) {
		var c,
			i = 0,
			s = "",
			that = this;

		return this._ensureCapacity(length).then(function() {
			for (i = 0; i < length & 0xffff; i++) {
				if ((c = that._readByte()) == (stopChar | 0)) { break; }
				s += String.fromCharCode(c);
			}
			return s;
		});
	}

	proto.read = function(buffer, size) {
		var that = this;

		return this._ensureCapacity(size).then(function() {
			while (size--) {
				buffer.writeInt8(that._readByte());
			}
		});
	}
	
})();
