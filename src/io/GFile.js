/*
 * Gamalto.File
 * ------------
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

	/* Dependencies */
	gamalto.devel.require("ReadableStream");
	gamalto.devel.using("TextReader");

	/**
	 * @constructor
	 */
	var _Object = G.File = function() {
		Object.base(this, 0);
		this.cacheSize = 4096;	// Initial cache size
	};

	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.ReadableStream);

	proto.open = function(url) {
		this.bufPos_ = 0;
		this.position_ = 0;
		this.url_ = url;
		this.error = 0;
		return this.info_();
	};

	proto.close = function() {
		this.buffer = null;
		this.bufSize_ = 0;
		this.url_ = null;
	};

	// No position
	proto.at_ = function(len, from) {
		// "from" is ignored in G.File
		from = -(this.bufPos_ - this.position_);
		this.position_ += len;
		return from;
	};

	proto.read = function(buffer, size) {
		while (size--) {
			buffer.writeInt8(this.readUint8());
		}
	};

	proto.seek = function(offset, origin) {
		_Object.base.seek.apply(this, arguments);

		// Invalidate current cached data if needed
		if (!(	this.position_ >= this.bufPos_ &&
				this.position_ < (this.bufPos_ + this.bufSize_))) {

			this.buffer = null;
			this.bufSize_ = 0;
		}
	};

	proto.tell = function() {
		return (this.bufPos_ + this.position_);
	};

	proto.info_ = function() {
		return this.send_(this.open_(
			this.onInfoReceived_,
			this.onError_, "HEAD"));
	};

	proto.onInfoReceived_ = function(r) {
		var status = r.status;
		var isOK = (status == 200 || status == 206);
		var state = r.readyState;

		if (state == r.DONE) {
			this.mimeType = r.getResponseHeader("Content-Type") ||
								"application/octet-stream";
			this.rangeSupported_ = Boolean(r.getResponseHeader("Accept-Ranges"));

			// Length should be -1 only using "file" URL scheme...
			if (-1 == (this.length =
							(status === 0) ? -1 /* Local */ :
							!isOK ? 0 :
								(r.getResponseHeader("Content-Length") | 0))) {

				// With "file" URL scheme, the whole data is already loaded
				this.onRangeReceived_(r);
				this.length = this.bufSize_;
			}
			this.setError_(isOK, status);
		}

		return state;
	};

	proto.setError_ = function(isOK, status) {
		this.error = isOK ? 0 : status;

		// For file scheme which return always status == 0
		if (status === 0 && this.length <= 0) {
			this.error = 400;
		}
	};

	proto.onError_ = function(r) {
		// Will be raised on network or CORS errors
		return new Error("An unexpected error occured." +
			"Check the console for more info");
	};

	proto.isAsync = function() {
		return false;
	};

	proto.open_ = function(loadHandler, errorHandler, mode) {
		var r = new XMLHttpRequest();

		// FIXME: cached files may not return Content-Length header!
		var random = (this.url_.indexOf("?") != -1 ? "&" : "?") + Math.random();

		// Set the handler...
		r.onreadystatechange = loadHandler.bind(this, r);
		r.onerror = errorHandler.bind(this, r);

		// Synchronous XMLHttpRequest on the main thread is deprecated because of its
		// detrimental effects to the end user's experience. For more help,
		// check http://xhr.spec.whatwg.org/.
		r.open(mode || "GET", this.url_ + random, this.isAsync());
		return r;
	};

	proto.send_ = function(r) {

		// Set response type (sync request doesn't allow responseType change)
		if ('responseType' in r) {
			try { r.responseType = "arraybuffer"; } catch(e) {}
		}
		if (!r.responseType) {
			if (r.overrideMimeType) {
				// XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
				r.overrideMimeType(G.Stream.BIN_MIMETYPE);
			} else {
				// For IE9 compatibility only
				this.useVB_ = !r.setRequestHeader('Accept-Charset', 'x-user-defined');
			}
		}

		try {
			r.send(null);
		} finally {
			return r;
		}
	};

	proto.openRange_ = function(loadHandler, errorHandler, length) {
		length = Math.max(length, this.cacheSize);

		var r = this.open_(loadHandler, errorHandler);
		var p = this.position_;

		// State must be OPENED to set headers
		if (this.rangeSupported_) {
			r.setRequestHeader("Range", "bytes=" + p + "-" + (p + length - 1));
			this.bufPos_ = p;
		}
		return r;
	};

	proto.range_ = function() {
		return this.send_(this.openRange_(
			this.onRangeReceived_,
			this.onError_));
	};

	proto.response_ = function(r) {
		if (!this.useVB_) {
			return r.response || r.responseText;
		}
		var array = new VBArray(r.responseBody).toArray();
		var response = "";

		// Array.map() is extremely slow
		array.forEach(function(chr) {
			response += String.fromCharCode(chr);
		});
		return response;
	};

	proto.onRangeReceived_ = function(r) {
		var data;
		var state = r.readyState;
		var status = r.status;
		var isOK = ((status || 200) == 200 || status == 206);

		if (state == r.DONE) {
			data = this.buffer = !isOK ? "" : this.response_(r);
			/*jshint -W056 */
			this.reader_ = new ((data.byteLength) ? DataView : G.TextReader)(data);

			// There is a bug in some WebKit version like Safari 8.0.3
			// Also earlier versions of CocoonJS don't support ranges
			// (tested with v1.4.1)
			// See: https://bugs.webkit.org/show_bug.cgi?id=82672
			if (!r.getResponseHeader("Content-Range")) {
				this.bufPos_ = 0;
				this.rangeSupported_ = false;
			}
			this.bufSize_ = (r.getResponseHeader("Content-Length") | 0)
								/* For local files... */
								|| this.buffer.byteLength || this.buffer.length || 0;
			this.setError_(isOK, status);
		}
		return state;
	};

	proto.readAny_ = function(size, method) {
		this.ensureCapacity_(size);
		return _Object.base["read" + method].call(this);
	};

	proto.readUint8 = function() {
		return this.readAny_(1, "Uint8");
	};

	proto.readInt8 = function() {
		return this.readAny_(1, "Int8");
	};

	proto.readUint16 = function() {
		return this.readAny_(2, "Uint16");
	};

	proto.readInt16 = function() {
		return this.readAny_(2, "Int16");
	};

	proto.readUint32 = function() {
		return this.readAny_(4, "Uint32");
	};

	proto.readInt32 = function() {
		return this.readAny_(4, "Int32");
	};

	/**
	 * Reads the whole file data into the internal buffer.
	 *
	 * @return {Promise} A promise if this file object is
	 *         asynchronous or nothing if not.
	 */
	proto.readAll = function() {
		this.rewind();
		return this.ensureCapacity_(this.length);
	};

	proto.shouldRead_ = function(size) {
		var position = this.position_;
		var bufSize = this.bufSize_;
		var bufStart = this.bufPos_;
		var bufEnd = bufStart + bufSize;
		var reqEnd = position + size;
		var eos = reqEnd - this.length;	// Are we reading at eos?

		// Do we have a buffer?
		return (!bufSize ||
			/* Are we behind the buffer position? */
			position < bufStart ||
			/* Are we over the current buffer? */
			position > bufEnd ||
			/* Do we have enough buffer for the requested size? */
			reqEnd - eos > bufEnd);
	};

	proto.ensureCapacity_ = function(size) {
		if (this.shouldRead_(size)) {
			this.range_(size);
		}
	};

})();
