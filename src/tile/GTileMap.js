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

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Creates a new rectangular tile-based map.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.TileMap
	 * @augments Gamalto.TileGroup
	 *
	 * @param {Gamalto.TileSet} ts
	 *        Tilset to be used to render the map.
	 * @param {number} width
	 *        Viewport horizontal size.
	 * @param {number} height
	 *        Viewport vertical size.
	 */
	var _Object = G.TileMap = function(ts, width, height) {
		Object.base(this);

		// Initialize overflow parts to 0
		this.overflow_();

		/**
		 * Gets or sets the size of the visible area of the map in tiles.
		 *
		 * @member {Gamalto.Size}
		 * @alias Gamalto.TileMap#viewport
		 */
		this.viewport = new G.Size(width, height);

		/**
		 * Gets of sets the origin of the visible area of the map in tiles.
		 *
		 * @member {Gamalto.Vector2}
		 * @alias Gamalto.TileMap#origin
		 */
		this.origin = new _Vector2();

		/**
		 * Tileset to be used to render the map data.
		 *
		 * @protected
		 * @ignore
		 *
		 * @member {Gamalto.TileSet}
		 */
		this.set_ = ts;

		/**
		 * Whether the map loops. Defaults to not looping.
		 *
		 * @member {boolean}
		 * @alias Gamalto.TileMap#loop
		 */
		this.loop = false;
	};

	/** @alias Gamalto.TileMap.prototype */
	var proto = _Object.inherits(G.TileGroup);

	/**
	 * Sets the parts which overflow the current viewport without altering
	 * the map position and size.
	 *
	 * @private
	 * @ignore
	 *
	 * @param {number} top
	 *        Size of the top part of the overscan.
	 * @param {number} right
	 *        Size of the right part of the overscan.
	 * @param {number} bottom
	 *        Size of the bottom part of the overscan.
	 * @param {number} left
	 *        Size of the left part of the overscan.
	 */
	proto.overflow_ = function(top, right, bottom, left) {
		this.tL_ = new _Vector2(left, top);
		this.bR_ = new _Vector2(right, bottom);
	};

	/**
	 * Sets the size in tiles of the offscreen area to be drawn around
	 * the effective viewport to help sides redraw while moving in the map.
	 *
	 * @param {number} top
	 *        Size of the top part of the overscan.
	 * @param {number} right
	 *        Size of the right part of the overscan.
	 * @param {number} bottom
	 *        Size of the bottom part of the overscan.
	 * @param {number} left
	 *        Size of the left part of the overscan.
	 */
	proto.setOverscan = function(top, right, bottom, left) {
		this.overflow_(top, right, bottom, left);

		// Reset the viewport to recompute pre-adjusted size
		this.viewport = this.vp_;
	};

	/**
	 * Renders the visible part of the map including the overscan if any.
	 *
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the {@linkcode Gamalto.surface} to which
	 *         the map will be rendered.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 */
	proto.draw = function(renderer, x, y) {
		var og = this.og_;
		var tL = this.tL_;
		var vp = this.avp_;
		var dt = this.delta_;

		this.drawSection_(renderer, og.x - tL.x, og.y - tL.y,
			vp.width, vp.height, x + dt.x, y + dt.y);
	};

	/**
	 * Draws the wanted part of the map.
	 *
	 * @protected
	 * @override
	 * @ignore
	 *
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the {@linkcode Gamalto.surface} to which
	 *         the map will be rendered.
	 * @param  {number} tx
	 *         Horizontal origin of the map part to be drawn in tiles.
	 * @param  {number} ty
	 *         Vertical origin of the map part to be drawn in tiles.
	 * @param  {number} tw
	 *         Horizontal size of the map part to be drawn in tiles.
	 * @param  {number} th
	 *         Vertical size of the map part to be drawn in tiles.
	 * @param  {number} ox
	 *         Horizontal drawing offset in pixels.
	 * @param  {number} oy
	 *         Vertical drawing offset in pixels.
	 */
	proto.drawSection_ = function(renderer, tx, ty, tw, th, ox, oy) {
		var x, y, tile, index;
		var w = this.width;
		var h = this.height;
		var ts = this.set_;
		var size = ts.size;
		var first = ts.firstIndex;

		// Adjust the drawing position if an overscan is defined.
		// Like this the map viewport will be always rendered properly at
		// the same position regardless of the overscan.
		ox -= this.tL_.x * size.width;
		oy -= this.tL_.y * size.height;

		// Looping map ?
		if (this.loop) {
			if (tx < 0) { tx = tx % w + w; }
			if (ty < 0) { ty = ty % h + h; }
		}

		for (x = 0; x < tw; x++) {
			for (y = 0; y < th; y++) {
				// Modulo to prevent out of bounds reads
				index = (x + tx) % w + (y + ty) % h * w;

				// Get the wanted tile
				if ((tile = this.data[index] - first) < 0) {
					continue;
				}

				// And draw it!
				ts.draw(renderer, ox + x * size.width, oy + y * size.height, tile);
			}
		}
	};

	/**
	 * Updates the map position.
	 * You can, for instance, pass the computed displacement of
	 * a {@linkcode Gamalto.ScrollingRegion}
	 * and then adjust the effective scrolling displacement with
	 * the returned ratios.
	 *
	 * @param  {number} mx
	 *         Horizontal displacement in pixels.
	 * @param  {number} my
	 *         Vertical displacement in pixels.
	 *
	 * @return {Gamalto.Vector2} Ratios applied to the desired displacement.
	 * Always (1,1) when the map loops.
	 */
	proto.update = function(mx, my) {
		var sz = this.set_.size;
		var tw = sz.width;
		var th = sz.height;

		var vp = this.avp_;
		var origin = this.og_;
		var delta = this.delta_;

		// Desired values
		var omx = mx;
		var omy = my;

		// New and old directions
		var ndx = Math.sign(mx);
		var ndy = Math.sign(my);
		var odx = Math.sign(delta.x);
		var ody = Math.sign(delta.y);

		// Changing direction? We must redraw the partial row and col
		// on the other sides.
		if (odx !== 0 && ndx - odx !== 0) {
			delta.x  += ndx * tw;
			origin.x += ndx;
		}
		if (ody !== 0 && ndy - ody !== 0) {
			delta.y  += ndy * th;
			origin.y += ndy;
		}

		// Adjust by overscan
		origin = _Vector2.sub(origin, this.tL_);

		delta.x += mx;
		delta.y += my;

		// How many rows and cols should we have to draw?
		var w = (delta.x / tw) | 0;
		var h = (delta.y / th) | 0;

		// Overscan
		var tL = this.tL_;
		var bR = this.bR_;

		// Out of map bounds? adjust... if the map doesn't loop
		if (!this.loop) {
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
		}

		// New drawing offset
		delta.x %= tw;
		delta.y %= th;

		this.drawW_ = w;
		this.drawH_ = h;

		// Returns the ratios
		return new _Vector2(mx / omx, my / omy);
	};

	/**
	 * Redraws the missing sides of the viewport when scrolling the map.
	 *
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the {@linkcode Gamalto.surface} to which
	 *         the sides will be rendered.
	 * @param  {number} x
	 *         Horizontal drawing position of the map.
	 * @param  {number} y
	 *         Vertical drawing position of the map.
	 *
	 * @return {array.<Gamalto.IBox>} List of redrawn areas or null
	 * if nothing has been redrawn.
	 */
	proto.redraw = function(renderer, x, y) {
		var sz = this.set_.size;
		var tw = sz.width;
		var th = sz.height;

		var vp = this.avp_;

		var w = this.drawW_;
		var h = this.drawH_;

		var redraw = null;

		if (!w && !h) {
			return redraw;
		}

		var cx = (this.og_.x -= w);
		var cy = (this.og_.y -= h);

		// Drawing offset in pixels
		var ox = this.delta_.x;
		var oy = this.delta_.y;

		// Adjust by overscan
		cx -= this.tL_.x;
		cy -= this.tL_.y;

		if (w !== 0) {
			// Save for clipping...
			var ccx = cx;
			var cox = ox;

			if (w < 0) {
				w = -w;
				cx += (vp.width - w);
				ox += (vp.width - w) * tw;
			} else {
				/* ...clip the horizontal part to be drawn if any,
				   to prevent rendering of the same tiles...
				*/
				cox += w * tw;
				ccx += w;
			}
			this.drawSection_(renderer, cx | 0, cy | 0, w, vp.height, x + ox, y + oy);
			(redraw = redraw || [])
				.push(new G.Box(x + ox, y + oy, w * tw, vp.height * th));

			// ...and apply
			cx = ccx;
			ox = cox;
		}
		if (h !== 0) {
			if (h < 0) {
				h = -h;
				cy += (vp.height - h);
				oy += (vp.height - h) * th;
			}
			this.drawSection_(renderer, cx | 0, cy | 0, vp.width - w, h, x + ox, y + oy);
			(redraw = redraw || [])
				.push(new G.Box(x + ox, y + oy, (vp.width - w) * tw, h * th));
		}

		return redraw;
	};

	/**
	 * Gets the tile at the given position.
	 *
	 * @param  {number} x
	 *         Horizontal position in the map.
	 * @param  {number} y
	 *         Vertical position in the map.
	 * @param  {boolean} [absolute]
	 *         Whether to get the tile at an absolute position or
	 *         in the visible space.
	 *
	 * @return {Gamalto.Tile}
	 */
	proto.getTile = function(x, y, absolute) {
		var w = this.width;
		var h = this.height;
		var ts = this.set_;
		var tw = ts.size.width;
		var th = ts.size.height;
		var tx, ty;

		if (absolute) {
			tx = x / tw;
			ty = y / th;
		} else {
			var og = this.og_;
			var dt = this.delta_;
			tx = (og.x * tw + x - dt.x) / tw | 0;
			ty = (og.y * th + y - dt.y) / th | 0;
		}

		// Adjust
		if (this.loop) {
			if (tx < 0) { tx = tx % w + w; }
			if (ty < 0) { ty = ty % h + h; }
		}

		var index = tx % w + ty % h * w;
		var tile = this.data[index | 0] - ts.firstIndex;

		return ts.getSection(tile);
	};

	Object.defineProperties(proto, {
		origin: {
			get: function() { return this.og_; },
			set: function(value) {
				/**
				 * Delta in pixels when drawing the map.
				 * The origin position in the map is given in tiles and adjusted
				 * using this delta.
				 *
				 * @private
				 * @ignore
				 *
				 * @member {Gamalto.Vector2}
				 */
				this.delta_ = new _Vector2();
				this.og_ = value;
			}
		},
		viewport: {
			get: function() { return this.vp_; },
			set: function(value) {
				this.vp_ = value;

				// Adjusted versions of Viewport taking overscan into account.
				var size = _Vector2.add(this.tL_, this.bR_);
				this.avp_ = new G.Size(value.width + size.x, value.height + size.y);
			}
		}
	});

})();
