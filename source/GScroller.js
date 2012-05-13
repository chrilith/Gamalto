/*
 * Gamalto.Scroller
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
	G.using("Rect");
	G.using("Renderer");			// FIXME
	G.using("ScrollingRegion");
	G.using("Surface");
	G.using("Timer");	

	/**
	 * @constructor
	 */
	G.Scroller = function(surface, region) {
		this._regs = {};
		this._surface = surface;
		this.setRegion("__default", region ||
			new G.ScrollingRegion(0, 0, surface.width, surface.height));
	};
	
	/* Inheritance and shortcut */
	var proto = G.Scroller.inherits(G.Object);
	
	/* Instance methods */
	
	proto.getRegion = function(name) {
		return this._regs[G.N(name || "__default")];
	}
	
	proto.setRegion = function(name, region) {
		name = G.N(name);
		if (region){
			this._regs[name] = region;
		} else if (this._regs[name]) {
			delete this._regs[name];
		}
	}
	
	proto.update = function(timer, dx, dy, region) {
		return this.getRegion(region)._update(timer, dx, dy);
	}
	
	proto.draw = function(region, sx, sy) {
		var r = this.getRegion(region),
			c = r._curr;
		sx = isNaN(sx) ? c.x : sx;
		sy = isNaN(sy) ? c.y : sy;
	
		c.x = 0;	// Reset current position
		c.y = 0;
		if (!sx && !sy) {
			return;
		}
		this._move(r, sx, sy);
	}
	
	proto._move = function(region, sx, sy) {
		var b = region._bounds,
			x = b.tL.x,
			y = b.tL.y,
			s = this._surface,
			w = b.width,
			h = b.height,
	
			src = s._context,
			dst = region._buffer._context,
		
		/* We cannot use negative value using this signature of drawImage()
		   and so we have to compute the correct values */
			cx = (sx < 0 ? -sx : 0) + x,
			cy = (sy < 0 ? -sy : 0) + y,
			ww = w - (sx < 0 ? -sx : sx),
			hh = h - (sy < 0 ? -sy : sy),
			// Destination in the window buffer
			dx = (sx > 0 ? sx : 0),
			dy = (sy > 0 ? sy : 0);
	
		// Copy a main surface area to the region buffer. Double buffering is far more effecient
		dst.clearRect(0, 0, w, h);	// The buffer is never transformed
		dst.drawImage(src._canvas, cx, cy, ww, hh, dx, dy, ww, hh);
	
		// Handle auto loop
		if (region._loop) {
			if (sx < 0) {
				dst.drawImage(src._canvas,
							  x, y, -sx, h,
							  w + sx, 0, -sx, h);
			} else if (sx > 0) {
				dst.drawImage(src._canvas,
							  x + w - sx, y, sx, h,
							  0, 0, sx, h);
			}
			if (sy < 0) {
				dst.drawImage(src._canvas,
							  x, y, w, -sy,
							  0, h + sy, w, -sy);
			} else if (sy > 0) {
				dst.drawImage(src._canvas,
							  x, y + h - sy, w, sy,
							  0, 0, w, sy);
			}
		}

		s.renderer._reset(); // FIXME: access to an unexpected method!!
		src.clearRect(x, y, w, h);
		src.drawImage(dst._canvas, x, y);
	}

})();
