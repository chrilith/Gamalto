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

(function(env) {

	/* Dependencies */
	G.using("Canvas");
	G.using("File");
	G.using("MemoryStream");
	G.using("Palette");

	/* Local */
	var modules = [];

	/**
	 * @constructor
	 */
	G.IndexedImage = function() {
		this._file = new G.File();
		
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

	var stat = G.IndexedImage;

	stat.addModule = function(module) {
		modules.push(module);
	}

	/* Inheritance and shortcut */
	var proto = G.IndexedImage.inherits(G.Object);

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
				modules[i].mime == this._file.mimeType) {
				
				return modules[i].reader;
			}
		}
		return null;
	}

	proto._load = function() {
		var file = this._file;

		// Open the file and get info
		file.open(this._url);

		// Find the proper module
		if ((this._module = this._findModule())) {

			// Allocate temporary buffer
			var buf = new G.MemoryStream(file.length);

			// Read data
			file._beginRead(buf, 0,
							file.length,
							this._ended.bind(this));
		} else {
			this._error();
		}
	}
	
	proto._error = function() {
		// TODO
		if (this.onerror) {
			this.onerror();
		}
	}

	proto._ended = function(buffer, result) {
		buffer.seek(0);

		var dec  = this._module,
			data = dec ? dec.call(this, buffer) : null;

		this._file._endRead(result);
		this._file.close();

		if (!data) {
			this._error();

		} else {
			this._palette	= data[0];
			this.width		= data[2];
			this.height		= data[3];			

			// TODO: use setSize()?
			this._image =
				(this._canvas = new G.Canvas(data[2], data[3]))
					._createRawBuffer();

			// Render the first pass and save cached data
			this._prepare(data[1]);
	
			// TODO
			if (this.onload) {
				this.onload();
			}
		}
	}

	proto._setPixel = function(p, color) {
		var data = this._image.data,
			c = this._palette.getColor(color);

		p <<= 2;
		data[p + 0] = c.r;
		data[p + 1] = c.g;
		data[p + 2] = c.b;
		data[p + 3] = c.a;
	}

	proto._toCanvas = function(refresh) {
		if (refresh) {
			var all = this._cache.length, curr;

			while (all--) {
				curr = this._cache[all];
				this._setPixel(curr.pixel, curr.index);
			}

			// Here we loose lots of time!
			// TODO: add image.data management in Surface ???
			//this._canvas._copyRawBuffer(this._image);
		}
		return this._image;
		//return this._canvas._canvas;
	}

	proto._prepare = function(data) {
		var idx, pix = 0;
		this._cache = [];

		while (!data.eos()) {
			idx = data.readByte();
			this._setPixel(pix, idx);

			if (this._palette.isAnimated(idx)) {
				this._cache.push({ pixel : pix, index : idx });
			}
			pix++;
		}

		//this._canvas._copyRawBuffer(this._image);
	}

})(ENV);
