/*
 * Gamalto.SpriteSheet
 * -------------------
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
	gamalto.devel.require("SectionList");
	gamalto.devel.using("Box");

	/**
	 * Creates a set of sprites from a bitmap.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.SpriteSheet
	 * @augments Gamalto.SectionList
	 */
	var _Object = G.SpriteSheet = function(bitmap) {
		Object.base(this);
		this.bitmap_ = bitmap;
	},
	
	/** @alias Gamalto.SpriteSheet.prototype */
	proto = _Object.inherits(G.SectionList);
	
	/**
	 * Adds a new set of sprites to the list using the specified parameters.
	 * 
	 * @param {Gamalto.Size} size
	 *        Size of a sprite.
	 * @param {number} [count]
	 *        Number of sprite sections to compute. Defaults to the number of sections contained in the specified rectangle.
	 * @param {Gamalto.IBox} [r]
	 *        Rectangle defining the bounds of the container. Defaults to the bitmap bounds.
	 *
	 * @return {Gamalto.SpriteSheet} Current object for method chaining.
	 */
	proto.addSections = function(size, count, r) {
		var b = this.bitmap_,
			w = b.width,
			h = b.height;

		r = r || new G.Box(0, 0, w, h);
		if ((count = gamalto.defined(count, -1)) < 0) {
			count = (w / size.width | 0) * (h / size.height | 0);
		}
		return _Object.base.addSections.call(this, size, count, r);
	};

	/**
	 * Draws a sprite into a surface.
	 *
	 * @virtual
	 * 
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the surface where the sprite must be drawn.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 * @param  {number} index
	 *         Zero-based index of the sprite to be drawn.
	 */
	proto.draw = function(renderer, x, y, index) {
		renderer.drawBitmapSection(this.bitmap_, x, y, this.getSection(index));
	};

})();
