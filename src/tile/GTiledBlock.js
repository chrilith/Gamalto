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
	 * @memberof Gamalto
	 * @constructor Gamalto.TiledBlock
	 * @augments Gamalto.TileGroup
	 */
	G.TiledBlock = function(ts, data, rows) {
		Object.base(this);
		this.setData(data, rows, Math.ceil(data.length / rows));
		this._tileSet = ts;
	};
	
	var proto = G.TiledBlock.inherits(G.TileGroup);
	
	proto.draw = function(renderer, x, y) {
		var ts = this._tileSet,
			tw = ts.size.width,
			th = ts.size.height,
			empty = G.TileGroup.NOTILE;

		// TODO: while and inc++ on "t"	
		for (var tx = 0; tx < this.width; tx++) {
			for (var ty = 0; ty < this.height; ty++) {
				var t = tx + ty * this.width,
					d = this.data[t];
				if (d != empty) {
					ts.draw(renderer, x + tx * tw, y + ty * th, d);
				}
			}
		}
	};

	// TODO: getSize?

})();
