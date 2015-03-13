/*
 * Gamalto.File
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
	gamalto.require_("ReadableStream");
	gamalto.using_	("TextReader");

	/**
	 * @constructor
	 */
	var _Object = G.File = function() {
		Object.base(this, 0);
		this.cacheSize = 4096;	// Initial cache size
	}

	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.ReadableStream);

	proto.open = function(url) {
		this.initPos_ = 0;
		this.position_ = 0;
		this.url_ = url;
		// TODO: detect file not found
		return this.info_();
	}
	
	proto.close = function() {
		this.buffer = null;
		this.bufSize_ = 0;
		this.url_ = null;
	}

	// Specific data format
	proto.getReader_ = function() {
		this.ensureCapacity_(4);
		return _Object.base.getReader_.call(this);
	}

	// No position
	proto.at_ = function(len, from) {
		// "from" is ignored in G.File
		from = -(this.initPos_ - this.position_);
		this.position_ += len;
		return from;
	}

	proto.read = function(buffer, size) {
		while(size--) {
			buffer.writeInt8(this.readUInt8());
		}		
	}

	proto.seek = function(offset, origin) {
		_Object.base.seek.apply(this, arguments);
		
		// Invalidate current cached data if needed
		if (!(this.position_ >= this.initPos_ &&
			  this.position_ < (this.initPos_ + this.bufSize_))) {
			this.buffer = null;
			this.bufSize_ = 0;
		}
	}
	
	proto.pos = function() {
		return (this.initPos_ + this.position_);
	}
	
	proto.error = function() {
		return false;	// TODO
	}

	proto.info_ = function() {
		return this.send_(this.open_(this.infoHandler_, "HEAD"));
	}

	proto.infoHandler_ = function(r) {
		var u, // undefined
			status, state = r.readyState;

		if (state == r.DONE) {
			status = r.status;
			this.mimeType = r.getResponseHeader("Content-Type") ||
								"application/octet-stream";
			this.rangeSupported_ = !!r.getResponseHeader("Accept-Ranges");

			// Length should be -1 only using "file" URL scheme...
			if (-1 == (this.length =
							(status & 200 != 200) ? u :
							(status == 0) ? -1 /* local */ :
								(r.getResponseHeader("Content-Length") | 0))) {
				
				// With "file" URL scheme, the whole data is already loaded
				this.partHandler_(r);
				this.length = this.bufSize_;
			}
		}

		return state;
	}

	proto.isAsync = function() {
		return false;
	}

	proto.open_ = function(handler, mode) {
		var r = new XMLHttpRequest(),
			// FIXME: cached files may not return Content-Length header!
			random = (this.url_.indexOf("?") != -1 ? "&" : "?") + Math.random();

		// Set the handler...
		r.onreadystatechange = handler.bind(this, r);

		// Synchronous XMLHttpRequest on the main thread is deprecated because of its
		// detrimental effects to the end user's experience. For more help,
		// check http://xhr.spec.whatwg.org/.
		r.open(mode || "GET", this.url_ + random, this.isAsync());
		return r;	
	}

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
				// for IE9 compatibility only
				this.useVB_ = !r.setRequestHeader('Accept-Charset', 'x-user-defined');
			}
		}

		r.send(null);
		return r;
	}

	proto.openPart_ = function(handler, length) {
		length = Math.max(length, this.cacheSize);

		var r = this.open_(handler),
			p = this.position_;

		// State must be OPENED to set headers
		if (this.rangeSupported_) {
			r.setRequestHeader("Range", "bytes=" + p + "-" + (p + length - 1));
			this.initPos_ = p;
		}
		return r;
	}

	proto.part_ = function() {
		return this.send_(this.openPart_(this.partHandler_));
	}

	proto.response_ = function(r) {
		if (!this.useVB_) {
			return r.response || r.responseText;
		}
		var array = new VBArray(r.responseBody).toArray(),
			response = "";
		// Array.map() is extremely slow
		array.forEach(function(chr) {
			response += String.fromCharCode(chr);
		});
		return response;
	}

	proto.partHandler_ = function(r) {
		var data, state = r.readyState
		if (state == r.DONE) {
			data = this.buffer = ((r.status || 200) & 200 != 200) ? "" : this.response_(r);
			this.reader_ = new ((data.byteLength) ? DataView : G.TextReader)(data);
			// There is a bug in some WebKit version like Safari 8.0.3
			// Also earlier versions of CocoonJS don't support ranges (tested with v1.4.1)
			// See: https://bugs.webkit.org/show_bug.cgi?id=82672
			if (!r.getResponseHeader("Content-Range")) {
				this.initPos_ = 0;
				this.rangeSupported_ = false;
			}
			this.bufSize_ = (r.getResponseHeader("Content-Length") | 0)
								|| this.buffer.byteLength || this.buffer.length; // for local files...
		}
		return state;
	}

	proto.shouldRead_ = function(size) {
		var position = this.position_,
			bufSize = this.bufSize_,
			bufStart = this.initPos_,
			bufEnd = bufStart + bufSize,
			reqEnd = position + size,
			//Important for G.File since size always === 4
			eos = reqEnd - this.length;	// Are we reading eos?

			 // Do we have a buffer?
		return (!bufSize ||
			 // Are we behind the buffer position?
			 position < bufStart ||
			 // Are we over the current buffer?
			 position > bufEnd ||
			 // Do we have enough buffer the the rrequested size?
			 reqEnd - eos > bufEnd);
	}

	proto.ensureCapacity_ = function(size) {
		if (this.shouldRead_(size)) {
			this.part_(size);
		}
	}

})();
