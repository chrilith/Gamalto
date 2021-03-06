/*
 * Gamalto.TileSet
 * ---------------
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
	gamalto.devel.require("SpriteSheet");
	gamalto.devel.using("Tile");
	gamalto.devel.using("Vector2");

	/**
	 * Creates a set of tiles from a bitmap to render tile-based graphics.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.TileSet
	 * @augments Gamalto.SpriteSheet
	 *
	 * @param {Gamalto.Bitmap} bitmap
	 *        Image holding the tiles data.
	 * @param {Gamalto.Size} size
	 *        Size of a tile.
	 */
	var _Object = G.TileSet = function(bitmap, size) {
		Object.base(this, bitmap);
		/**
		 * Gets the size of a tile in the tileset.
		 *
		 * @readonly
		 * 
		 * @member {Gamalto.Size}
		 * @alias Gamalto.TileSet#size
		 */
		this.size = size;
		/**
		 * Gets or sets the offset in pixels to be applied when drawing a tile from the tileset.
		 *
		 * @member {Gamalto.Vector2}
		 * @alias Gamalto.TileSet#offset
		 */
		this.offset = new G.Vector2(0, 0);

		/**
		 * Gets or sets the index of the first tile in this tileset.
		 * 
		 * @member {number}
		 * @alias Gamalto.TileSet#firstIndex
		 */
		this.firstIndex = 0;
	},

	/** @alias Gamalto.TileSet.prototype */
	proto = _Object.inherits(G.SpriteSheet);

	/**
	 * Adds a new set of tiles to the list using the specified parameters.
	 * The size is here implied and equals to the size specified in the constructor.
	 * 
	 * @param {number} [count]
	 *        Number of tile sections to compute. Defaults to the number of sections contained in the specified rectangle.
	 * @param {Gamalto.IBox} [r]
	 *        Rectangle defining the bounds of the container. Defaults to the bitmap bounds.
	 *
	 * @return {Gamalto.SpriteSheet} Current object for method chaining.
	 */
	proto.addSections = function(count, r) {
		return _Object.base.addSections.call(this, this.size, count, r);
	};

	proto.createSection_ = function(x, y, w, h, index) {
		var tile = new G.Tile(x, y, w, h);
		tile.index = index;
		return tile;
	};

	/**
	 * Draws a tile into a surface.
	 * 
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the surface where the tile must be drawn.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 * @param  {number} index
	 *         Zero-based index of the tile to be drawn.
	 */
	proto.draw = function(renderer, x, y, index) {
		var offset = this.offset;
		_Object.base.draw.call(this, renderer, x + offset.x, y + offset.y, index);
	};

})();
