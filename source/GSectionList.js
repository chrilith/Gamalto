/*
 * Gamalto.SectionList
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
	gamalto.using_("Rect");
	
	/**
	 * @constructor
	 */
	G.SectionList = function() {
		var o = this;	
		o.length = 0;
		o._list = [];
		this.setMargin();
		this.setSpacing();
	}
	
	/* Inheritance and shortcut */
	var proto = G.SectionList.inherits(G.Object);
	
	/* Instance methods */

	proto.setMargin = function(x, y) {
		this._margin = new G.Vector(x | 0, y | 0);
	}

	proto.setSpacing = function(x, y) {
		this._spacing = new G.Vector(x | 0, y | 0);
	}

	proto.addSections = function(count, r, size) {
		var tw = size.width,
			th = size.height,
			mg = this._margin,
			sp = this._spacing;
		this.length += count;

		for (var y = r.tL.y + mg.y; y < r.bR.y - mg.y; y += th + sp.y) {
			for (var x = r.tL.x - mg.x; x < r.bR.x - mg.x; x += tw + sp.x) {
				this._list.push(this._createSection(x, y, tw, th));
				if (!--count) {
					return this;
				}
			}
		}
		return this;
	}

	proto.insertSection = function(at, section) {
		gamalto.assert_(at <= this.length);
		this._list.splice(at, 0, section);
		this.length++;
	}

	proto._createSection = function(x, y, w, h) {
		return new G.Rect(x, y, w, h);
	}
	
	proto.getSection = function(i) {
		return this._list[i | 0];
	}

})();
