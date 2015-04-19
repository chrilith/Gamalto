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
	 * Base object to create a movable entity. It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.TileSet
	 * @augments Gamalto.SpriteSheet
	 */
	var _Object = G.TileSet = function(bitmap, size) {
		Object.base(this, bitmap);
		/**
		 * Gets the size of the tileset.
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
	},

	proto = _Object.inherits(G.SpriteSheet);

	proto.addSections = function(count, r) {
		return _Object.base.addSections.call(this, this.size, count, r);
	};

	proto.createSection_ = function(x, y, w, h) {
		return new G.Tile(x, y, w, h);
	};
	
	proto.draw = function(renderer, x, y, i) {
		var offset = this.offset;
		renderer.drawBitmapSection(this.bitmap_, x + offset.x, y + offset.y, this.getSection(i));
	};

})();
