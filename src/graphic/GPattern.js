/*
 * Gamalto.Pattern
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
	gamalto.devel.using("Surface");
	gamalto.devel.using("Rect");
	gamalto.devel.using("Renderer2D");

	/**
	 * @constructor
	 */
	G.Pattern = function(bitmap, r) {
		r = r || new G.Rect(0, 0, bitmap.width, bitmap.height);
		var s = new G.Surface(r.extent.x, r.extent.y);
		s.renderer.drawBitmapSection(bitmap, 0, 0, r);
		// FIXME: only renderers should directly access context methods
		this._pattern = s.__canvas._context.createPattern(s.getCanvas_(), "repeat");
	};

	/* Inheritance and shortcut */
	var proto = G.Pattern.inherits(G.Object);
	
	/* Instance methods */
	proto.__toCanvasStyle = function() {
		return this._pattern;
	};

})();
