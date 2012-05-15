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
	G.using("Convert");

	/**
	 * @constructor
	 */
	G.File = function() {
		this.cacheSize = 4096;	// Initial cache size
	}

	/* Inheritance and shortcut */
	var proto = G.File.inherits(G.Object);
		
	proto.open = function(url) {
		this._position = 0;
		this._url = url;
		// TODO: detect file not found
		this._info();
	}

	proto.readByte = function() {
		this._shouldRead();
		return this._data.charCodeAt(-(this._initPos - this._position++)) & 0xff;
	}

	/* Big Endian */

	proto.readUInt16BE = function() {
		var b = this.readByte(),
			a = this.readByte();
		return (b << 8) | a;
	}
	
	proto.readSInt16BE = function() {
		return G.Convert.toSInt16(this.readUInt16LE());
	}

	proto.readUInt32BE = function() {
		var d = this.readByte(),
			c = this.readByte(),
			b = this.readByte(),
			a = this.readByte();
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32BE = function() {
		return G.Convert.toSInt32(this.readUInt32BE());
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function() {
		var a = this.readByte(),
			b = this.readByte();
		return (b << 8) | a;
	}
	
	proto.readSInt16LE = function() {
		return G.Convert.toSInt16(this.readUInt16LE());
	}

	proto.readUInt32LE = function() {
		var a = this.readByte(),
			b = this.readByte(),
			c = this.readByte(),
			d = this.readByte();
		return (d << 24) | (c << 16) | (b << 8) | a;
	}

	proto.readSInt32LE = function() {
		return G.Convert.toSInt32(this.readUInt32LE());
	}

	proto.readString = function(length, stopChar) {
		var c, s = "";
		for (var i = 0; i < length; i++) {
			if ((c = this.readByte()) == (stopChar | 0)) { break; }
			s += String.fromCharCode(c);
		}
		return s;
	}

	proto.seek = function(offset, origin) {
		var C = G.File;

		switch (origin) {
			case C.SEEK_SET:
				this._position = offset;
				break;

			case C.SEEK_CUR:
				this._position += offset;
				break;

			case G.File.SEEK_END:
				this._position = this.length - offset;
				break;
		}
		// Invalidate current cached data if needed
		if (!(this._position >= this._initPos &&
			  this._position < (this._initPos + this._bufSize))) {
			this._data = null;
			this._bufSize = 0;
		}
	}
	
	proto.tell = function() {
		return (this._initPos + this._position);
	}
	
	proto.rewind = function() {
		this.seek(0, C.SEEK_SET);
	}
	
	proto.eof = function() {
		return false;	// TODO
	}
	
	proto.error = function() {
		return false;	// TODO
	}

	proto._info = function() {
		var u,	// = undefined
			status, ranges,
			r = this._open("HEAD");

		r.send(null);
		status = r.status;
		ranges = this._rangeSupported = !!r.getResponseHeader("Accept-Ranges");

		// Length should be -1 only using "file" URL scheme...
		if (-1 == (this.length =
						(status > 206) ? u :
						(status == 0) ? -1 /* local */ :
							(r.getResponseHeader("Content-Length") | 0))) {
			
			this._part();
			this.length = this._bufSize;
		}
	}

	proto._open = function(mode) {
		var r = new XMLHttpRequest();
		r.open(mode || "GET", this._url, false);
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
	
	/* Constants */
	var constant = G.File;

	constant.SEEK_SET = 0;
	constant.SEEK_CUR = 1;
	constant.SEEK_END = 2;

})();
