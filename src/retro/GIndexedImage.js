/*
 * Gamalto.IndexedImage
 * --------------------
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
	gamalto.devel.using("BaseCanvas");
	gamalto.devel.using("AsyncFile");

	/* Local */
	var modules = [];
	var bufferMode;

	/**
	 * Creates a new image with indexed palette.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.IndexedImage
	 * @augments Gamalto.Object
	 */
	var _Object = G.IndexedImage = function() {
		this.file_ = new G.AsyncFile();
	};

	/** @alias Gamalto.IndexedImage.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Looks for a compatible module to decode the image data.
	 *
	 * @private
	 * @ignore
	 *
	 * @return {function} A function to decode the image data
	 *         or null if no module has been found.
	 */
	proto.findModule_ = function() {
		var i;
		var url = this.url_;
		var p1 = url.indexOf('?');
		var p2 = url.indexOf('#');

		// Get end of filename
		url = url.substr(0,
				p1 != -1 ? p1 :
				p2 != -1 ? p2 : url.length);

		// Get file extension if any
		p1 = url.lastIndexOf("/");
		p2 = url.lastIndexOf(".");
		url = url.substr(p2 > p1 ? p2 : url.length).toLowerCase();

		// Module lookup
		for (i = 0; i < modules.length; i++) {
			if (modules[i].ext.indexOf(url) != -1 &&
				modules[i].mime.indexOf(this.file_.mimeType) != -1) {

				return modules[i].reader;
			}
		}

		return null;
	};

	/**
	 * Loads and decodes the image data into memory.
	 *
	 * @private
	 * @ignore
	 */
	proto.load_ = function() {
		var file = this.file_;
		var that = this;

		// Open the file and get info
		return file.open(this.url_).then(function() {
			// Find the proper module
			if ((that.module_ = that.findModule_())) {
				file.readAll().then(function() {
					var buf = new G.StreamReader(file.buffer);
					file.close();
					that.onLoad_(buf);
					this.file_ = null;
				});
			} else {
				that.raiseEvent_("error");
				throw new Error("No image decoder found.");
			}
		});
	};

	/**
	 * Raises the requested event.
	 *
	 * @private
	 * @ignore
	 *
	 * @param  {string} type
	 *         Event type, "error" or "load".
	 */
	proto.raiseEvent_ = function(type) {
		var onevent = this["on" + type];
		if (onevent) {
			var e = gamalto.createEvent(type);
			e.path = [this];
			onevent.call(this, e);
		}
	};

	/**
	 * Decodes the image data.
	 *
	 * @private
	 * @ignore
	 *
	 * @param  {Gamalto.ReadableStream} buffer
	 *         Stream containing the image data.
	 */
	proto.onLoad_ = function(buffer) {
		var dec  = this.module_;
		var data = dec ? dec.call(this, buffer) : null;

		if (!data) {
			this.raiseEvent_("error");
			throw new Error("Failed to decode image.");

		} else {
			/**
			 * Image palette.
			 *
			 * @member {Gamalto.Palette}
			 * @readonly
			 *
			 * @alias Gamalto.IndexedImage#palette
			 */
			this.palette = data[0];
			this.data_ = data[1];	// For full redraw
			/**
			 * Width of the image in pixels.
			 *
			 * @member {number}
			 * @readonly
			 *
			 * @alias Gamalto.IndexedImage#width
			 */
			this.width = data[2];
			/**
			 * Height of the image in pixels.
			 *
			 * @member {number}
			 * @readonly
			 *
			 * @alias Gamalto.IndexedImage#height
			 */
			this.height	= data[3];

			this.buffer_ = G.BaseCanvas.create_(bufferMode, data[2], data[3]);

			this.raiseEvent_("load");
		}
	};

	/**
	 * Gets an object than can be drawn on a HTMLCanvasElement.
	 *
	 * @internal
	 * @ignore
	 *
	 * @return {HTMLCanvasElement}
	 */
	proto.getDrawable_ = function(refresh) {
		var buf;
		var pal = this.palette;

		if (pal._changed || refresh) {
			pal._changed = false;
			buf = this.data_.buffer;
			this.buffer_._copyRawBufferIndexed(pal._list, {
				data: buf.byteLength ? new Uint8Array(buf) : buf,
				width: this.width,
				height: this.height
			});
		}

		return this.buffer_.getDrawable_();
	};

	/**
	 * Adds a new image decoder to the list of avalaible decoding modules.
	 *
	 * @memberof Gamalto.IndexedImage
	 * @function addModule
	 * @static
	 *
	 * @param {object} module
	 *        Module descriptor.
	 */
	_Object.addModule = function(module) {
		module.mime.push(G.Stream.BIN_MIMETYPE);
		modules.push(module);
	};

	/**
	 * Sets the type of buffer to be used to render the image.
	 *
	 * @memberof Gamalto.IndexedImage
	 * @function setBufferMode
	 * @static
	 *
	 * @param {Gamalto.BaseCanvas} mode
	 *        Type of the canvas buffer.
	 */
	_Object.setBufferMode = function(mode) {
		bufferMode = mode;
	};

	/**
	 * Source url of the image.
	 *
	 * @memberof Gamalto.IndexedImage.prototype
	 * @member {string} src
	 * @readonly
	 */
	Object.defineProperty(proto, "src", {
		set: function(value) {
			this.url_ = value;
			this.load_();
		},
		get: function() {
			return this.url_ || "";
		}
	});

})();
