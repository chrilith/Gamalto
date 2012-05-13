/*
 * Gamalto.SpriteSheet
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

For production software, the copyright notice only is required. You must also
display a splash screen showing the Gamalto logo in your game of other software
made using this middleware.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 *
 */

(function() {

	/* Dependencies */
	gamalto.require_("SectionList");
	gamalto.using_("Bitmap");
	gamalto.using_("Rect");

	/**
	 * @constructor
	 */
	G.SpriteSheet = function(bitmap) {
		Object.base(this);
		this._bitmap = bitmap;
	}
	
	/* Inheritance and shortcut */
	var proto = G.SpriteSheet.inherits(G.SectionList);
	
	/* Instance methods */
	proto.addSections = function(count, r, size) {
		var b = this._bitmap,
			w = b.width,
			h = b.height;

		r = r || new G.Rect(0, 0, w, h);
		if ((count = count || -1) < 0) {
			count = (w / size.width | 0) * (h / size.height | 0);
		}
		return G.SpriteSheet.base.addSections.call(this, count, r, size);
	}

	proto.draw = function(renderer, x, y, i) {
		renderer.drawBitmapSection(this._bitmap, x, y, this.getSection(i));
	}

})();