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
		this._initPos = 0;
		this._position = 0;
		this._url = url;
		// TODO: detect file not found
		this._info();
	}
	
	proto.close = function() {
		this.buffer = null;
		this._bufSize = 0;
		this._url = null;
	}

	// Specific data format
	proto._getReader = function() {
		this._shouldRead();
		return _Object.base._getReader.call(this);
	}

	// No position
	proto._at = function(len, from) {
		// "from" is ignored in G.File
		from = -(this._initPos - this._position);
		this._position += len;
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
		if (!(this._position >= this._initPos &&
			  this._position < (this._initPos + this._bufSize))) {
			this.buffer = null;
			this._bufSize = 0;
		}
	}
	
	proto.pos = function() {
		return (this._initPos + this._position);
	}
	
	proto.error = function() {
		return false;	// TODO
	}

	proto._info = function() {
		var u,	// = undefined
			status, r = this._open("HEAD");

		r.send(null);
		status = r.status;
		this.mimeType = r.getResponseHeader("Content-Type") ||
							"application/octet-stream";
		this._rangeSupported = !!r.getResponseHeader("Accept-Ranges");
		
		// Length should be -1 only using "file" URL scheme...
		if (-1 == (this.length =
						(status & 200 != 200) ? u :
						(status == 0) ? -1 /* local */ :
							(r.getResponseHeader("Content-Length") | 0))) {
			/*
				Here, the whole data is loaded into memory since HTTP is not
				supported. TODO: Optimization may apply.
			*/
			var response = r.response || r.responseText || "";
			this.length = response.byteLength || response.length || 0;
		}

		// TODO: handle error with "status"
	}

	proto._open = function(mode) {
		var r = new XMLHttpRequest();
		// Synchronous XMLHttpRequest on the main thread is deprecated because of its
		// detrimental effects to the end user's experience. For more help,
		// check http://xhr.spec.whatwg.org/.
		r.open(mode || "GET", this._url, false);

		if (typeof r.responseType == "string") {
			try { r.responseType = "arraybuffer"; } catch(e) {}
		}

		if (!r.responseType) {
			if (r.overrideMimeType) {
				//XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
				r.overrideMimeType(G.Stream.BIN_MIMETYPE);
			} else {
				gamalto.error_("Binary load not supported!");
			}
		}

		return r;
	}

	proto._send = function(r) {
		r.send(null);		
		var status = (r.status || 200);
		return (status < 200 || status > 206) ? "" : (r.response || r.responseText);
	}

	proto._part = function(length) {
		length = length || this.cacheSize;

		var r = this._open(),
			p = this._position;

		// Optimize loading needed bytes only!
		if (this._rangeSupported) {
			r.setRequestHeader("Range", "bytes=" + p + "-" + (p + length - 1));
			this._initPos = p;
		}
		var data = this.buffer = this._send(r);
		this._reader = new ((data.byteLength) ? DataView : G.TextReader)(data);
		// There is a bug in some WebKit version like Safari 8.0.3
		// Also earlier versions of CocoonJS don't support ranges (tested with v1.4.1)
		// See: https://bugs.webkit.org/show_bug.cgi?id=82672
		if (!r.getResponseHeader("Content-Range")) {
			this._initPos = 0;
			this._rangeSupported = false;
		}
		this._bufSize = (r.getResponseHeader("Content-Length") | 0)
							|| this.buffer.length; // for local files...
		return r;
	}

	proto._shouldRead = function() {
		if (!this._bufSize ||
			 this._position < this._initPos ||
			 this._position > this._initPos + this._bufSize) {

			this._part();
		}		
	}

})();
