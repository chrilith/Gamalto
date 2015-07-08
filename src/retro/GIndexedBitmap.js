/*
 * Gamalto.IndexedBitmap
 * ---------------------
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
	gamalto.devel.require("Bitmap");
	gamalto.devel.using("IndexedImage");

	/**
	 * Creates a framework compatible bitmap with indexed palette.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.IndexedBitmap
	 * @augments Gamalto.Bitmap
	 *
	 * @param {Gamalto.indexedImage} source
	 *        Image to be used by the bitmap object.
	 */
	var _Object = G.IndexedBitmap = function(source) {
		Object.base(this, source);
		// To force initial image rendering
		this.updated_ = true;
	},

	/** @alias Gamalto.IndexedBitmap.prototype */
	proto = _Object.inherits(G.Bitmap);

	/**
	 * Creates an image object that can be used as bitmap source.
	 * 
	 * @internal
	 * @ignore
	 * 
	 * @return {Gamalto.IndexedImage}
	 */
	proto.createSource_ = function() {
		return (this.source_ = new G.IndexedImage());
	};

	/**
	 * Gets an object than can be drawn on a HTMLCanvasElement.
	 *
	 * @internal
	 * @ignore
	 * 
	 * @return {HTMLCanvasElement}
	 */
	proto.getDrawable_ = function() {
		var refresh = this.updated_;
		this.updated_ = false;
		return this.source_.getDrawable_(refresh);
	};

	/**
	 * Animates the palette of the bitmap image.
	 * 
	 * @param  {Gamalto.Timer} timer
	 *         [Timer]{@link Gamalto.Timer} object from which the elpased time will be read.
	 * 
	 * @return {boolean} Whether the palette has changed.
	 */
	proto.animate = function(timer) {
		return (this.updated_ = this.source_.palette.update(timer));
	};

	/**
	 * Forces a refresh of the bitmap.
	 */
	proto.refresh = function() {
		this.updated_ = true;
	};

})();
