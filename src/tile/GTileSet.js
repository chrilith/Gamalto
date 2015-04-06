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

	/**
	 * @constructor
	 */
	var _Object = G.TileSet = function(bitmap, size) {
		this.tile_ = size;
		Object.base(this, bitmap);
	};

	var proto = _Object.inherits(G.SpriteSheet);

	proto.addSections = function(count, r) {
		return _Object.base.addSections.call(this, this.tile_, count, r);
	};

	proto.createSection_ = function(x, y, w, h) {
		return new G.Tile(x, y, w, h);
	};
	
	proto.draw = function(renderer, x, y, i) {
		renderer.drawBitmapSection(this.bitmap_, x, y, this.getSection(i).rect);
	};

})();
