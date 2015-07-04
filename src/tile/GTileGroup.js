/*
 * Gamalto.TileGroup
 * -----------------
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
	 * Base object to create a tile-based image.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.TileGroup
	 * @augments Gamalto.Object
	 * @implements {Gamalto.ISize}
	 */
	var _Object = G.TileGroup = function() {
		Object.base(this);
	};

	/** @alias Gamalto.TileGroup.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Sets the data needed to render the tile-based image.
	 *
	 * @param {array.<number>} data
	 *        List of tile indices representing the image.
	 * @param {number} width
	 *        Horizontal size of the image in tiles.
	 * @param {number} height
	 *        Vertical size of the image in tiles.
	 */
	proto.setData = function(data, width, height) {
		/**
		 * List of tile indices representing the image.
		 *
		 * @member {array.<number>}
		 * @readonly
		 * @alias Gamalto.TileGroup#data
		 */
		this.data = data;
		/**
		 * Horizontal size of the image in tiles.
		 *
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.TileGroup#width
		 */
		this.width = width;
		/**
		 * Vertical size of the image in tiles.
		 *
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.TileGroup#height
		 */
		this.height = height;
	};

})();
