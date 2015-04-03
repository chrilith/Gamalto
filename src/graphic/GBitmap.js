/*
 * Gamalto.Bitmap
 * --------------
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
	
	/**
	 * Creates a framework compatible bitmap.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Bitmap
	 * @augments Gamalto.Object
	 *
	 * @param {HTMLImageElement} source
	 *        Image to be used by the bitmap object.
	 */
	var _Object = G.Bitmap = function(source) {
		this.source_ = source;
	},
	
	/** @alias Gamalto.Bitmap.prototype */
	proto = G.Bitmap.inherits(G.Object);

	/**
	 * Creates an image object that can be used as bitmap source.
	 * 
	 * @internal
	 * @ignore
	 * 
	 * @return {HTMLImageElement}
	 */
	proto.createSource_ = function() {
		return (this.source_ = new Image());
	};

	/**
	 * Gets an object than can be drawn on a HTMLCanvasElement.
	 *
	 * @internal
	 * @ignore
	 * 
	 * @return {HTMLImageElement}
	 */
	proto.getCanvas_ = function() {
		return this.source_;
	};

	Object.defineProperties(proto, {
		/**
		 * Width of the bitmap in pixels.
		 * 
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.Bitmap#width
		 */
		"width": {
			get: function() {
				var source = this.source_;
				return source ? source.width : 0;
			}
		},
		/**
		 * Height of the bitmap in pixels.
		 * 
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.Bitmap#height
		 */
		"height": {
			get: function() {
				var source = this.source_;
				return source ? source.height : 0;
			}
		}
	});

})();
