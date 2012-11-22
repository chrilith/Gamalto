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
	gamalto.using("Canvas");
	gamalto.using("File");
	gamalto.using("MemoryStream");
	gamalto.using("Palette");

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
			this._data		= data[1];	// For full redraw
			this.width		= data[2];
			this.height		= data[3];			

			// TODO: use setSize()?
			this._image =
				(this._canvas = new G.Canvas(data[2], data[3]))
					._createRawBuffer();

			// Render the first pass and save cached data
			this._fullRedraw();

			// TODO
			if (this.onload) {
				this.onload();
			}
		}
	}

	proto._toCanvas = function(refresh) {
		var pal = this._palette;

		if (pal._changed || refresh) {
			pal._changed = false;
			this._fullRedraw();
		}

		return this._canvas._canvas;
	}

	proto._fullRedraw = function() {
		// TODO: optimize animated palette rendering using cache? (see history)

		var color, index, pixel = 0,
			data	= this._data,
			dest	= this._image.data,
			colors	= this._palette._colorsAsArray();

		data.seek(0);
		while (!data.eos()) {
			index = data.readByte();
			color = colors[index];

			dest[pixel + 0] = color[0];
			dest[pixel + 1] = color[1];
			dest[pixel + 2] = color[2];
			dest[pixel + 3] = color[3];

			pixel += 4;
		}
		this._canvas._copyRawBuffer(this._image);
	}

})(ENV);
