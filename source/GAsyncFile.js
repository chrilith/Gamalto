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
	gamalto.require_("SeekableStream");
	gamalto.using_("Convert");
	gamalto.using_("Async");

	/**
	 * @constructor
	 */
	G.AsyncFile = function() {
		Object.base(this);
		this.cacheSize = 4096;	// Initial cache size
	}

	/* Inheritance and shortcut */
	var proto = G.AsyncFile.inherits(G.SeekableStream);

	proto.open = function(url) {
		this._position = 0;
		this._url = url;
		// TODO: detect file not found
		return this._info();
	}

	proto.close = function() {
		this._data = null;
		this._bufSize = 0;
		this._url = null;
	}

	// Specific data format
	proto._readData = function() {
		var pos = -(this._initPos - this._position++);
		return (typeof this._data == "object") ? 
			this._data[pos] : this._data.charCodeAt(pos) & 0xff;
	}

	proto._readByte = function() {
		var that = this;
		return this._shouldRead().then(function() {
			return that._readData();
		});
	}

	proto.pos = function() {
		return (this._initPos + this._position);
	}
	
	proto.error = function() {
		return false;	// TODO
	}

	proto._info = function() {
		var u,	// = undefined
			status, 
			that = this,
			r = this._open("HEAD"),
			promise = new G.Promise();

		r.onreadystatechange = function() {
			if (r.readyState == r.DONE) {
				status = r.status;
				that.mimeType = r.getResponseHeader("Content-Type") ||
									"application/octet-stream";
				
				that._rangeSupported = false; /*gamalto.env.isHttpRangesSupported
									&& !!r.getResponseHeader("Accept-Ranges");*/

				// Length should be -1 only using "file" URL scheme...
				if (-1 == (that.length =
								(status & 200 != 200) ? u :
								(status == 0) ? -1 /* local */ :
									(r.getResponseHeader("Content-Length") | 0))) {
					/*
						Here, the whole data is loaded into memory since HTTP is not
						supported. TODO: Optimization may apply.
					*/
					if (r.response) {
						that.length = r.response.byteLength;
					} else {
						that.length = (r.responseText || "").length;
					}
				}
				gamalto.log_("Loading async file size:", that.length);
				// TODO: handle error with "status"
				promise.resolve(that);
			}
		};

		r.send(null);
		return promise;
	}

	proto._open = function(mode) {
		var r = new XMLHttpRequest();
		r.open(mode || "GET", this._url, true);

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
		var promise = new G.Promise();
		r.onreadystatechange = function() {
			if (r.readyState == r.DONE) {
				var status = (r.status || 200);
				promise.resolve((status < 200 || status > 206) ? "" : (r.response || r.responseText));
			}
		};

		r.send(null);
		return promise;
	}

	proto._part = function(length) {
		length = length || this.cacheSize;

		var r = this._open(),
			p = this._position,
			that = this;

		// Optimize loading needed bytes only!
		if (this._rangeSupported) {
			r.setRequestHeader("Range", "bytes=" + p + "-" + (p + length - 1));
		}
		this._initPos = p;
		return this._send(r).then(function(data) {
			that._data = typeof data == "object" ? new Uint8Array(data) : data;
			that._bufSize = (r.getResponseHeader("Content-Length") | 0)
								|| that._data.length; // for local files...
		});
	}

	proto._shouldRead = function() {
		if (!this._bufSize ||
			 this._position < this._initPos ||
			 this._position > this._initPos + this._bufSize) {

			return this._part();
		} else {
			return G.Async.immediate();
		}
	}

	proto.readUInt8 = function() {
		return this._readByte();
	}

	proto.readSInt8 = function() {
		return this.readUInt8().then(function(value) {
			return G.Convert.toSInt8(value);
		});
	}

	/* Big Endian */

	proto.readUInt16BE = function() {
		var a, b, that = this;

		return this._readByte().then(function(value) {
			b = value;
			return that._readByte();
		}).then(function(value) {
			a = value;
			return (b << 8) | a;
		});
	};

	proto.readSInt16BE = function() {
		return this.readUInt16LE().then(function(value) {
			return G.Convert.toSInt16(value);
		});
	};

	proto.readUInt32BE = function(at) {
		var a, b, c, d, that = this;

		return this._readByte().then(function(value) {
			d = value;
			return that._readByte();
		}).then(function(value) {
			c = value;
			return that._readByte();
		}).then(function(value) {
			b = value;
			return that._readByte();
		}).then(function(value) {
			a = value;
			return (d << 24) | (c << 16) | (b << 8) | a;
		});
	}

	proto.readSInt32BE = function(at) {
		return this.readUInt32BE().then(function(value) {
			return G.Convert.toSInt32(value);
		});
	}

	/* Little Endian (JavaScript is little endian) */

	proto.readUInt16LE = function(at) {
		var a, b, that = this;

		return this._readByte().then(function(value) {
			a = value;
			return that._readByte();
		}).then(function(value) {
			b = value;
			return (b << 8) | a;
		});
	}

	proto.readSInt16LE = function(at) {
		return this.readUInt16LE().then(function(value) {
			return G.Convert.toSInt16(value);
		});
	}

	proto.readUInt32LE = function(at) {
		var a, b, c, d, that = this;

		return this._readByte().then(function(value) {
			a = value;
			return that._readByte();
		}).then(function(value) {
			b = value;
			return that._readByte();
		}).then(function(value) {
			c = value;
			return that._readByte();
		}).then(function(value) {
			d = value;
			return (d << 24) | (c << 16) | (b << 8) | a;
		});
	}

	proto.readSInt32LE = function(at) {
		return this.readUInt32LE().then(function(value) {
			return G.Convert.toSInt32(value);
		});
	}

	proto.readString = function(length, stopChar) {
		var c,
			i = 0,
			s = "",
			that = this;

		return G.Async.loop(function() {
			return that.readUInt8().then(function(value) {
				if ((c = value) == (stopChar | 0)) { return true; }
				s += String.fromCharCode(c);

				return ++i >= (length & 0xffff);
			});

		}).then(function() {
			return s;
		});
	}

	proto.read = function(buffer, size) {
		var that = this;

		return this._part(size).then(function() {
			while (size--) {
				buffer.writeInt8(that._readData());
			}
		});
	}

	proto.seek = function(offset, origin) {
		this._shouldRead();
		G.AsyncFile.base.seek.apply(this, arguments);

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

})();
