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
	gamalto.require("ReadableStream");
	gamalto.using("Convert");

	/**
	 * @constructor
	 */
	G.File = function() {
		Object.base(this, 0);
		this.cacheSize = 4096;	// Initial cache size
	}

	/* Inheritance and shortcut */
	var proto = G.File.inherits(G.ReadableStream);

	proto.open = function(url) {
		this._position = 0;
		this._url = url;
		// TODO: detect file not found
		this._info();
	}
	
	proto.close = function() {
		this._data = null;
		this._bufSize = 0;
		this._url = null;
	}

	// Specific data format
	proto._readByte = function() {
		this._shouldRead();
		return this._data.charCodeAt(-(this._initPos - this._position++)) & 0xff;
	}
	// No position
	proto._at = function(at, relative) { return 0; }

	proto.read = function(buffer, size) {
		while(size--) {
			buffer.writeInt8(this.readUInt8());
		}		
	}

	proto.seek = function(offset, origin) {
		G.File.base.seek.apply(this, arguments);
		
		// Invalidate current cached data if needed
		if (!(this._position >= this._initPos &&
			  this._position < (this._initPos + this._bufSize))) {
			this._data = null;
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
			this.length = (r.responseText || "").length;
		}

		// TODO: handle error with "status"
	}

	proto._open = function(mode/*, async */) {
		var r = new XMLHttpRequest();
		r.open(mode || "GET", this._url, arguments[1]);	// [1] = async, internal use only
		//XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
		// Should set responseType one day and read "reponse" to get an ArrayBuffer
		r.overrideMimeType('text/plain; charset=x-user-defined');

		return r;
	}

	proto._send = function(r) {
		r.send(null);		
		var status = (r.status || 200);
		return (status < 200 || status > 206) ? "" : r.responseText;
	}

	proto._part = function(length) {
		length = length || this.cacheSize;

		var r = this._open(),
			p = this._position;

		// Optimize loading needed bytes only!
		if (this._rangeSupported) {
			r.setRequestHeader("Range", "bytes=" + p + "-" + (p + length - 1));
		}
		this._initPos = p;
		this._data = this._send(r);
		this._bufSize = (r.getResponseHeader("Content-Length") | 0)
							|| this._data.length; // for local files...
		return r;
	}

	proto._shouldRead = function() {
		if (!this._bufSize ||
			 this._position < this._initPos ||
			 this._position > this._initPos + this._bufSize) {

			this._part();
		}		
	}

	/* Special case for internal use to read data asynchronously.
	   If range is not supported, the whole file will be read all the time */
	proto._beginRead = function(buffer, offset, size, callback) {
		var r = this._open(null, true);

		// Optimize loading needed bytes only!
		if (this._rangeSupported) {
			r.setRequestHeader("Range", "bytes=" + offset + "-" + (offset + size - 1));
		}
		r.onreadystatechange = this._asyncRead.bind(this, buffer, offset, size, callback);
		r.send(null);

		return r;
	}

	proto._asyncRead = function(buffer, offset, size, callback, e) {
		var xhr = e.target;
		if (this._asyncResult(xhr)) {
			var data = (xhr.responseText || "");
			
			// If !_rangeSupported, size may be higher
			size = (data.length > size) ? size : data.length;
			offset = this._rangeSupported ? 0 : offset;

			// Save data
			while (size--) {
				buffer.writeInt8(data.charCodeAt(offset++) & 0xff);
			}
			// Execute callback if any
			if (callback) {
				callback(buffer, xhr);
			}
		}
	}

	proto._asyncResult = function(xhr) {
		return xhr.readyState == 4 && 200 == ((xhr.status || 200) & 200);
	}

	proto._endRead = function(result) {
		if (!this._asyncResult(result)) {
			result.abort();
		}
		// free the callback
		result.onreadystatechange = null;
	}

})();
