/*
 * Gamalto.IndexedImage
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

// TODO: optimize memory and speed

(function() {

	/* Dependencies */
	gamalto.using_("Canvas2D");
	gamalto.using_("File");
	gamalto.using_("AsyncFile");
	gamalto.using_("MemoryStream");
	gamalto.using_("Palette");

	/* Local */
	var modules = [], _bufferType;

	/**
	 * @constructor
	 */
	var _Object = G.IndexedImage = function() {
		this._file = new G.AsyncFile();
		
		Object.defineProperty(this, "src", {
			set: function(value) {
				this._url = value;
				this._load();
			},
			get: function() {
				return this._url || "";
			},
			enumerable: true
		});
	}

	var stat = _Object;

	stat.addModule = function(module) {
		module.mime.push(G.Stream.BIN_MIMETYPE);
		modules.push(module);
	}

	stat.setBufferType = function(type) {
		var old = _bufferType;
		_bufferType = type;
		return old;
	};

	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.Object);

	proto._findModule = function() {
		var i, u = this._url,
			p1 = u.indexOf('?'),
			p2 = u.indexOf('#');
			
		// Get end of filename
		u = u.substr(0,
				p1 != -1 ? p1 :
				p2 != -1 ? p2 : u.length);
		
		// Get extention if any
		p1 = u.lastIndexOf("/");
		p2 = u.lastIndexOf(".");
		u = u.substr(p2 > p1 ? p2 : u.length).toLowerCase();

		// Module lookup
		for (i = 0; i < modules.length; i++) {
			if (modules[i].ext.indexOf(u) != -1 &&
				~modules[i].mime.indexOf(this._file.mimeType)) {
				
				return modules[i].reader;
			}
		}
		return null;
	}

	proto._load = function() {
		var file = this._file,
			that = this;

		// Open the file and get info
		return file.open(this._url).then(function() {
			// Find the proper module
			if ((that._module = that._findModule())) {
				// Allocate temporary buffer
				var buf = new G.MemoryStream(file.length);
				// Read data
				file.read(buf, file.length).then(function() {
					file.close();
					that._ended(buf);
				});
			} else {
				that._error();
			}			
		});
	}
	
	proto._error = function() {
		// TODO
		if (this.onerror) {
			this.onerror();
		}
	}

	proto._ended = function(buffer) {
		buffer.rewind();

		var dec  = this._module,
			data = dec ? dec.call(this, buffer) : null;

		if (!data) {
			this._error();

		} else {
			this._palette	= data[0];
			this._data		= data[1];	// For full redraw
			this.width		= data[2];
			this.height		= data[3];			

			this._buffer = new (_bufferType || G.Canvas2D)(data[2], data[3]);

			// TODO
			if (this.onload) {
				this.onload();
			}
		}
	}

	proto._getCanvas = function(refresh) {
		var buf, pal = this._palette;

		if (pal._changed || refresh) {
			pal._changed = false;
			buf = this._data.buffer;
			this._buffer._copyRawBufferIndexed(pal._list, {
				data: buf.byteLength ? new Uint8Array(buf) : buf,
				width: this.width,
				height: this.height
			});
		}

		return this._buffer._getCanvas();
	}

})();
