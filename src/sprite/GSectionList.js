/*
 * Gamalto.SectionList
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
	gamalto.devel.require("Vector2");
	gamalto.devel.using("Rect");
	
	/**
	 * @constructor
	 */
	var _Object = G.SectionList = function() {
		var o = this;	
		o.length = 0;
		o._list = [];
		this.setMargin();
		this.setSpacing();
	},
	_Vector2 = G.Vector2,
	
	/* Inheritance and shortcut */
	proto = _Object.inherits(G.Object);
	
	/* Instance methods */

	proto.setMargin = function(x, y) {
		this._margin = new _Vector2(x | 0, y | 0);
	};

	proto.setSpacing = function(x, y) {
		this._spacing = new _Vector2(x | 0, y | 0);
	};

	proto.addSections = function(count, r, size) {
		var tw = size.width,
			th = size.height,
			// Format
			mg = this._margin,
			sp = this._spacing,
			// Rectangle
			tL = r.origin,
			bR = _Vector2.add(tL, r.extent).substractFloat(1);

		this.length += count;

		for (var y = tL.y + mg.y; y < bR.y - mg.y; y += th + sp.y) {
			for (var x = tL.x - mg.x; x < bR.x - mg.x; x += tw + sp.x) {
				this._list.push(this._createSection(x, y, tw, th));
				if (!--count) {
					return this;
				}
			}
		}
		return this;
	};

	proto.insertSection = function(at, section) {
		gamalto.assert_(at <= this.length);
		this._list.splice(at, 0, section);
		this.length++;
	};

	proto._createSection = function(x, y, w, h) {
		return new G.Rect(x, y, w, h);
	};
	
	proto.getSection = function(i) {
		return this._list[i | 0];
	};

})();
