/*
 * Gamalto.TiledBlock
 * ------------------
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
	gamalto.devel.require("TileGroup");

	/**
	 * Creates a new rectangular tile-based image.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.TiledBlock
	 * @augments Gamalto.TileGroup
	 *
	 * @param {Gamalto.TileSet} ts
	 *        Tilset to be used to render the map.
	 * @param {array.<number>} data
	 *        List of tile indices representing the image.
	 * @param {number} rows
	 *        Horizontal size the of image in tiles.
	 */
	var _Object = G.TiledBlock = function(ts, data, rows) {
		Object.base(this);
		this.setData(data, rows, Math.ceil(data.length / rows));
		/**
		 * Tileset to be used to render the map data.
		 *
		 * @protected
		 * @ignore
		 *
		 * @member {Gamalto.TileSet}
		 */
		this.set_ = ts;
	};

	/** @alias Gamalto.TiledBlock.prototype */
	var proto = _Object.inherits(G.TileGroup);

	/**
	 * Renders the tile-based image.
	 *
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the {@linkcode Gamalto.surface} to which
	 *         the image will be rendered.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 */
	proto.draw = function(renderer, x, y) {
		var tile;
		var ts = this.set_;
		var tw = ts.size.width;
		var th = ts.size.height;
		var ox = x;
		var ow = x + tw * this.width;
		var pos = 0;

		while (pos < this.data.length) {
			// Get the wanted tile
			if ((tile = this.data[pos++] - ts.firstIndex) !== -1) {
				// And draw it!
				ts.draw(renderer, x, y, tile);
			}
			if ((x += tw) === ow) {
				x  = ox;
				y += th;
			}
		}
	};

})();
