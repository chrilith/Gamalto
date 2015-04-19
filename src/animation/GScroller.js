/*
 * Gamalto.Scroller
 * ----------------
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
	gamalto.devel.using("Box");
	gamalto.devel.using("Surface");
	gamalto.devel.using("ScrollingRegion");

	/**
	 * Creates a multi-region scrolling object.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Scroller
	 * @augments Gamalto.Object
	 *
	 * @param {Gamalto.Surface} surface
	 *        Surface holding the image to be scrolled.
	 * @param {boolean} [doubleBuffer]
	 *        Whether to active double buffuring. Required for looping and parallax scrolling.
	 */
	var _Object = G.Scroller = function(surface, doubleBuffer) {
		/**
		 * Dictionary holding the scrolling regions.
		 *
		 * @private
		 * @ignore
		 * 
		 * @member {Object}
		 */
		this.regions_ = {};
		/**
		 * Surface holding the graphics to be scrolled
		 *
		 * @private
		 * @ignore
		 * 
		 * @member {Gamalto.Surface}
		 */
		var buffer = this.surface_ = surface;

		if (doubleBuffer) {
			// TODO: clone the surface instead to have same canvas, same renderer
			buffer = new G.Surface(surface.width, surface.height);
			buffer.blit(surface, 0, 0);
		}
		/**
		 * Current surface when double buffer is active or passed surface if not.
		 * Using double buffer, you must use this property instead of the original surface.
		 *
		 * @readonly
		 * 
		 * @member {Gamalto.Surface}
		 * @alias Gamalto.Scroller#surface
		 */
		this.surface = buffer;
	},
	
	/** @alias Gamalto.Scroller.prototype */
	proto = _Object.inherits(G.Object);
	

	/**
	 * Gets the specified registered scrolling region.
	 * 
	 * @param  {string} name
	 *         Name of the requested region.
	 * 
	 * @return {Gamalto.ScrollingRegion} Region if it exists.
	 */
	proto.getRegion = function(name) {
		return this.regions_[name];
	};

	/**
	 * Regiters a scrolling region.
	 * 
	 * @param {string} name
	 *        Name the region to be registered.
	 * @param {Gamalto.ScrollingRegion} region
	 *        [Region]{@link Gamalto.ScrollingRegion} instance to be registered.
	 */
	proto.setRegion = function(name, region) {
		this.regions_[name] = region;
	};

	/**
	 * Scrolls the region using the specified displacement, or the internal state if not specified.
	 * To prevent a region from moving, simply set its speed to 0.
	 *
	 * @private
	 * @ingore
	 * 
	 * @param  {string} name
	 *         Name the region to be drawn.
	 * @param  {number} dx
	 *         Value beween -1 and +1 indicating the desired horizontal displacement.
	 * @param  {number} dy
	 *         Value beween -1 and +1 indicating the desired vertical displacement.
	 */
	proto.drawRegion_ = function(name, dx, dy) {
		var region = this.getRegion(name);

		if (!isNaN(dx) || !isNaN(dy)) {
			// In that case, reset the current position
			region.reset();
			dx = dx || 0;
			dy = dy || 0;
		} else {
			dx = region.curr_.x;
			dy = region.curr_.y;
		}
		this.move_(region, dx, dy);
	};

	/**
	 * Updates the internal displacement state of the registered regions.
	 * 
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@link Gamalto.ITiming} from which the elapsed time will be read.
	 * @param  {number} dx
	 *         Value beween -1 and +1 indicating the horizontal displacement.
	 * @param  {number} dy
	 *         Value beween -1 and +1 indicating the vertical displacement.
	 */
	proto.update = function(timer, dx, dy) {
		var regions = this.regions_;
		for (var name in regions) {
			regions[name].update(timer, dx, dy);
		}
	};

	/**
	 * Redraws parts of the current surface into the buffer surface.
	 * Useful only with double buffering.
	 * 
	 * @param  {array.<Gamalto.IBox>} regions
	 *         List of the regions to be updated.
	 */
	proto.redraw = function(regions) {
		// Get the next destionation surface
		var surface = this.surface_;
		// Prepare regions
		regions = regions || [new G.Box(0, 0, surface.width, surface.height)];
		// Update the surface
		surface.redraw(this.surface, 0, 0, regions);
	};

	/**
	 * Scrolls the registered regions.
	 *
	 * @return {Gamalto.Surface} Currently active surface to be displayed.
	 */
	proto.draw = function() {
		// Swap buffers if double buffering is enabled
		var	buf1 = this.surface_,
			buf2 = this.surface;

		this.surface_ = buf2;
		this.surface  = buf1;

		for (var name in this.regions_) {
			this.drawRegion_(name);
		}

		return this.surface;
	};

	/**
	 * Moves the specified [region]{@link Gamalto.ScrollingRegion}.
	 *
	 * @private
	 * @ignore
	 * 
	 * @param  {Gamalto.ScrollingRegion} region
	 *         Region to be scrolled.
	 * @param  {number} sx
	 *         Horizontal displacement in pixels.
	 * @param  {number} sy
	 *         Vertical displacement in pixels.
	 */
	proto.move_ = function(region, sx, sy) {
		var b = region.bounds_,
			x = b.origin.x,
			y = b.origin.y,
			w = b.extent.x,
			h = b.extent.y,
	
			src = this.surface_,
			dst = this.surface,

		/* Clip for out of bounds values */
			cx = (sx < 0 ? -sx : 0) + x,
			cy = (sy < 0 ? -sy : 0) + y,
			ww = w - (sx < 0 ? -sx : sx),
			hh = h - (sy < 0 ? -sy : sy),
			// Destination in the window buffer
			dx = (sx > 0 ? sx : 0),
			dy = (sy > 0 ? sy : 0),

			renderer = dst.renderer;

		// Copy a main surface area to the region buffer
		if (src !== dst) { renderer.clearRect(b); }
		renderer.copy_(src, cx, cy, ww, hh, dx, dy, ww, hh);

		// Handle auto loop
		if (region.loop) {
			if (sx < 0) {
				renderer.copy_(src,
							  dx, dy, -sx, h,
							  dx + w + sx, dy, -sx, h);
			} else if (sx > 0) {
				renderer.copy_(src,
							  dx + w - sx, dy, sx, h,
							  dx, dy, sx, h);
			}
			if (sy < 0) {
				renderer.copy_(src,
							  dx, dy, w, -sy,
							  dx, dy + h + sy, w, -sy);
			} else if (sy > 0) {
				renderer.copy_(src,
							  dx, dy + h - sy, w, sy,
							  dx, dy, w, sy);
			}
		}
	};

})();
