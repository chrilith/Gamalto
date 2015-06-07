/*
 * Gamalto.Font
 * ------------
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
	gamalto.devel.using("BaseRenderer");
	gamalto.devel.using("Size");

	/**
	 * Creates a new graphical font from a bitmap.
	 * 
	 * @memberof Gamalto
	 * @constructor Gamalto.Font
	 * @augments Gamalto.SpriteSheet
	 * 
	 * @param {Gamalto.Bitmap} bitmap
	 *        Image holding the font data.
	 * @param {string} firstLetter
	 *        First character of the font.
	 */
	var _Object = G.Font = function(bitmap, firstLetter) {
		Object.base(this, bitmap);
		/**
		 * Code of the first character of the font.
		 * 
		 * @private
		 * @ignore
		 * 
		 * @member {number}
		 */
		this.firstLetter_ = firstLetter.charCodeAt(0);
	},
	
	/** @alias Gamalto.Font.prototype */
	proto = _Object.inherits(G.SpriteSheet);
	
	/**
	 * Draws a text into a surface.
	 * 
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the surface where the text must be drawn.
	 * @param  {string} text
	 *         Text to be drawn.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 *
	 * @return {Gamalto.Size} Size of drawn text.
	 */
	proto.draw = function(renderer, text, x, y) {
		var index, section, chr;
		var w = 0;
		var h = 0;

		for (chr = 0; chr < text.length; chr++) {
			index = text.charCodeAt(chr) - this.firstLetter_;

			if ((section = this.getSection(index))) {
				if (renderer) {
					renderer.drawBitmapSection(this.bitmap_, x + w, y, section);
				}
				w += section.extent.x;
				h  = Math.fmax(section.extent.y, h);
			}
		}

		return new G.Size(w, h);
	};

	/**
	 * Computes the size of the specified text in pixels.
	 * 
	 * @param  {string} text
	 *         Text to be measured.
	 * 
	 * @return {Gamalto.Size} Size of the text.
	 */
	proto.measureText = function(text) {
		return this.draw(null, text);
	};

})();
