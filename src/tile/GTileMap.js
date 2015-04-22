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

	/* Dependencies */
	gamalto.devel.require("TileGroup");
	gamalto.devel.require("Vector2");
	gamalto.devel.using("Size");

	/**
	 * @constructor
	 */
	var _Object = G.TileMap = function(ts, width, height) {
		Object.base(this);
		this.viewport = new G.Size(width, height);
		this.origin = _Vector2.zero();
		this.setOverscan();
		this.set_ = ts;
	},
	_Vector2 = G.Vector2,

	proto = _Object.inherits(G.TileGroup);

	proto.setOverscan = function(left, top, right, bottom) {
		this.tL_ = new _Vector2(left, top);
		this.bR_ = new _Vector2(bottom, right);
	};
	
	proto.render = function(renderer, w, h) {
		this.drawSection_(renderer, this.origin_.x | 0, this.origin_.y | 0, w, h, 0, 0);
	};
	
	proto.drawSection_ = function(renderer, tx, ty, tw, th, ox, oy) {
		var x, y, t, ts = this.set_,
			empty = G.TileGroup.NOTILE;
	
		// TODO: do not draw overscan (?)
		for (x = 0; x < tw; x++) {
			for (y = 0; y < th; y++) {
				if (this.data[t] != empty) {
					t = (x + tx) + (y + ty) * this.width;
					ts.draw(renderer, ox + x * ts.size.width, oy + y * ts.size.height, this.data[t] - 1);
				}
			}
		}
	};
	
	proto.update = function(mx, my) {
		var sz = this.set_.size,
			tw = sz.width,
			th = sz.height,

			vp = this.viewport,
			origin = this.origin_,
			delta = this.delta_,

			// Desired values
			omx = mx,
			omy = my,
	
			// New and old directions
			ndx = Math.sign(mx),
			ndy = Math.sign(my),
			odx = Math.sign(delta.x),
			ody = Math.sign(delta.y);
	
		// Changing direction? We must redraw the partial row and col on the other sides.
		if (odx != 0 && ndx - odx != 0) {
			delta.x  += ndx * tw;
			origin.x += ndx;
		}
		if (ody != 0 && ndy - ody != 0) {
			delta.y  += ndy * th;
			origin.y += ndy;
		}

		delta.x += mx;
		delta.y += my;

		// How many rows and cols should we have to draw?
		var w = (delta.x / tw) | 0,
			h = (delta.y / th) | 0,
		// Overscan
			tL = this.tL_,
			bR = this.bR_;
	
		// Out of map bounds? adjust... if the map doesn't loop (TODO)
	
		if (mx > 0 && origin.x - w <= -tL.x) {
			w = origin.x + tL.x;
			mx -= delta.x - w * tw;
			delta.x = 0;

		} else if (mx < 0 && (origin.x + vp.width - this.width) - w >= bR.x) {
			w = (origin.x + vp.width - this.width) - bR.x;
			mx -= delta.x - w * tw;
			delta.x = 0;
		}

		if (my > 0 && origin.y - h <= -tL.y) {
			h = origin.y + tL.y;
			my -= delta.y - h * th;
			delta.y = 0;

		} else if (my < 0 && (origin.y + vp.height - this.height) - h >= bR.y) {
			h = (origin.y + vp.height - this.height) - bR.y;
			my -= delta.y - h * th;
			delta.y = 0;
		}

		// New drawing offset
		delta.x %= tw;
		delta.y %= th;

		// CHECKME: what if draw() is not called? should be += and then reset in draw()
		this.drawW_ = w;
		this.drawH_ = h;

		// Returns the ratio applied to the desired displacement
		return new _Vector2(mx / omx, my / omy);
	};
	
	proto.draw = function(renderer) {
		// Let's redraw missing parts
		var sz = this.set_.size,
			tw = sz.width,
			th = sz.height,

			vp = this.viewport,

			w = this.drawW_,
			h = this.drawH_,

			redraw = null;

		if (!w && !h) {
			return redraw;
		}

		var cx = (this.origin_.x -= w),
			cy = (this.origin_.y -= h),
			ox = this.delta_.x,
			oy = this.delta_.y;

		if (w != 0) {
			if (w < 0) {
				w = -w;
				cx += (vp.width - w);
				ox += (vp.width - w) * tw;
			}
			this.drawSection_(renderer, cx | 0, cy | 0, w, vp.height, ox, oy);
			(redraw = redraw || []).push(new G.Box(ox, oy, w * tw, vp.height * th));
		}
		if (h != 0) {
			if (h < 0) {
				h = -h;
				cy += (vp.height - h);
				oy += (vp.height - h) * th;
			}
			this.drawSection_(renderer, cx | 0, cy | 0, vp.width, h, ox, oy);
			(redraw = redraw || []).push(new G.Box(ox, oy, vp.width * tw, h * th));
		}

		return redraw;
	};

	/**
	 * Current top left position in the map in tiles.
	 * 
	 * @memberof Gamalto.TileMap.prototype
	 * @member {Gamalto.Vector2} origin
	 */
	Object.defineProperties(proto, {
		origin: {
			get: function() { return this.origin_; },
			set: function(value) {
				this.delta_ = _Vector2.zero();
				this.origin_ = value;
			}
		}
	});
})();
