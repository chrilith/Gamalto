/*
 * Gamalto.TileMap
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

	gamalto.devel.require("TileGroup");
	gamalto.devel.require("Vector2");
	gamalto.devel.using("Size");

	/**
	 * @constructor
	 */
	G.TileInfo = function() {
		this.left = 0;
		this.right = 0;
		this.top = 0;
		this.bottom = 0;
	};
	
	/**
	 * @constructor
	 */
	var _Object = G.TileMap = function(ts) {
		Object.base(this);
		this.setViewport(0, 0);
		this.setOrigin(0, 0);
		this.setOverflow(0, 0, 0, 0);
		this._tileSet = ts;
	},
	_Vector2 = G.Vector2,
	
	proto = _Object.inherits(G.TileGroup);
		
	proto.setOrigin = function(x, y) {
		var o = this;
		o._tileX = x;
		o._tileY = y;
		o._deltaX = 0;
		o._deltaY = 0;
	};
	
	proto.setViewport = function(width, height) {
		this._viewport = new G.Size(width, height);
	};
	
	proto.setOverflow = function(x1, y1, x2, y2) {
		this._tL = new _Vector2(x1, y1);
		this._bR = new _Vector2(x2, y2);
	};
	
	proto.render = function(renderer, w, h) {
		var tx = this._tileX | 0,
			ty = this._tileY | 0;
		this._drawSection(renderer, tx, ty, w, h, 0, 0);
	};
	
	proto._drawSection = function(renderer, tx, ty, tw, th, ox, oy) {
		var ts = this._tileSet,
			empty = G.TileGroup.NOTILE;
	
	// TODO: do not draw overflow
		for (var x = 0; x < tw; x++) {
			for (var y = 0; y < th; y++) {
				if (this.data[t] != empty) {
					var t = (x + tx) + (y + ty) * this.width;
					ts.draw(renderer, ox + x * ts.tile_.width, oy + y * ts.tile_.height, this.data[t] - 1);
				}
			}
		}
	};
	
	proto.update = function(mx, my) {
		var o  = this,
			ts = o._tileSet,
			tw = ts.tile_.width,
			th = ts.tile_.height,
			vp = o._viewport,
	
			// New and old directions
			ndx = Math.sign(mx),
			ndy = Math.sign(my),
			odx = Math.sign(o._deltaX),
			ody = Math.sign(o._deltaY);
	
		// Changing direction?
		// We must redraw the partial row and col on the other sides.
		if (odx != 0 && ndx - odx != 0) {
			o._deltaX += ndx * tw;
			o._tileX  += ndx;
		}
		if (ody != 0 && ndy - ody != 0) {
			o._deltaY += ndy * th;
			o._tileY  += ndy;
		}
	
		o._deltaX += mx;
		o._deltaY += my;
		
		// How many rows and cols should we have to draw?
		var w = (o._deltaX / tw) | 0,
			h = (o._deltaY / th) | 0,
		// Overflow
			o1 = o._tL,
			o2 = o._bR;
	
		// Out of map bounds? adjust... if the map doesn't loop (TODO)
	
		if (mx > 0 && o._tileX - w <= -o1.x) {
			w = this._tileX + o1.x;
			mx -= o._deltaX - w * tw;
			o._deltaX = 0;
	
		} else if (mx < 0 && (this._tileX + vp.width - this.width) - w >= o2.x) {
			w = (this._tileX + vp.width - this.width) - o2.x;
			mx -= o._deltaX - w * tw;
			o._deltaX = 0;
		}
	
		if (my > 0 && o._tileY - h <= -o1.y) {
			h = this._tileY + o1.y;
			my -= o._deltaY - h * th;
			o._deltaY = 0;
	
		} else if (my < 0 && (this._tileY + vp.height - this.height) - h >= o2.y) {
			h = (this._tileY + vp.height - this.height) - o2.y;
			my -= o._deltaY - h * th;
			o._deltaY = 0;
		}
	
		// New drawing offset
		o._deltaX %= tw;
		o._deltaY %= th;
	
		this._drawW = w;
		this._drawH = h;
	
		return new _Vector2(mx, my);
	};
	
	proto.draw = function(renderer) {
		// Let's redraw missing parts
		var o = this,
			ts = o._tileSet,
			vp = o._viewport,
			tw = ts.tile_.width,
			th = ts.tile_.height,
			w = this._drawW,
			h = this._drawH,
			redraw = null;
	
		if (!w && !h)
			return;
		o._tileX -= w;
		o._tileY -= h;	
	
		var cx = o._tileX,
			cy = o._tileY,
			ox = o._deltaX,
			oy = o._deltaY;
	
		if (w != 0) {
			if (w < 0) {
				w = -w;
				cx += (vp.width - w);
				ox += (vp.width - w) * tw;
			}
			this._drawSection(renderer, cx | 0, cy | 0, w, vp.height, ox, oy);
			(redraw = redraw || []).push(new G.Box(ox, oy, w * tw, vp.height * th));
		}
		if (h != 0) {
			if (h < 0) {
				h = -h;
				cy += (vp.height - h);
				oy += (vp.height - h) * th;
			}
			o._drawSection(renderer, cx | 0, cy | 0, vp.width, h, ox, oy);
			(redraw = redraw || []).push(new G.Box(ox, oy, vp.width * tw, h * th));
		}

		return redraw;
	};

})();
