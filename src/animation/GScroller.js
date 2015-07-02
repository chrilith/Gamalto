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
	 *        Whether to active double buffuring. Required for looping and
	 *        parallax scrolling.
	 */
	var _Object = G.Scroller = function(surface, doubleBuffer) {
		Object.base(this);
		this.resetRegions();

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
		 * Using double buffer, you must use this property instead of the original
		 * surface.
		 *
		 * @readonly
		 *
		 * @member {Gamalto.Surface}
		 * @alias Gamalto.Scroller#surface
		 */
		this.surface = buffer;
	};

	/** @alias Gamalto.Scroller.prototype */
	var proto = _Object.inherits(G.Object);

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
	 * Scrolls the region using the specified displacement, or the internal state
	 * if not specified. To prevent a region from moving, simply set its speed
	 * to 0.
	 *
	 * @private
	 * @ingore
	 *
	 * @param  {string} name
	 *         Name the region to be drawn.
	 * @param  {number} dx
	 *         Value beween 0 and 1 indicating the desired horizontal
	 *         displacement ratio.
	 * @param  {number} dy
	 *         Value beween 0 and 1 indicating the desired vertical
	 *         displacement ratio.
	 */
	proto.drawRegion_ = function(name, dx, dy) {
		var region = this.getRegion(name);

		dx = region.curr_.x * gamalto.defined(dx, 1) | 0;
		dy = region.curr_.y * gamalto.defined(dy, 1) | 0;

		this.move_(region, dx, dy);
	};

	/**
	 * Removes all regions.
	 */
	proto.resetRegions = function() {
		/**
		 * Dictionary holding the scrolling regions.
		 *
		 * @private
		 * @ignore
		 *
		 * @member {Object}
		 */
		this.regions_ = {};
	};

	/**
	 * Updates the internal displacement state of the registered regions.
	 *
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@link Gamalto.ITiming} from which the elapsed time will
	 *         be read.
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
	 * @param  {array.<Gamalto.IBox>} [regions]
	 *         List of the regions to be updated. Defaults to the whole surface.
	 */
	proto.redraw = function(regions) {
		// Get the next destionation surface
		var	offs = this.surface_;

		// And the current view
		var view = this.surface;

		// No need to redraw on a same surface...
		// Also, IE throw an 'unexpected call to method or property access' exception
		// calling Surface.redraw()
		if (offs != view) {
			// Prepare regions
			regions = regions || [new G.Box(0, 0, offs.width, offs.height)];

			// Update the surface
			offs.redraw(view, 0, 0, regions);
		}
	};

	/**
	 * Scrolls the registered regions.
	 *
	 * @param  {number} dx
	 *         Value beween 0 and 1 indicating the horizontal displacement ratio.
	 * @param  {number} dy
	 *         Value beween 0 and 1 indicating the vertical displacement ratio.
	 *
	 * @return {Gamalto.Surface} Currently active surface to be displayed.
	 */
	proto.draw = function(dx, dy) {
		// Swap buffers if double buffering is enabled
		var	buf1 = this.surface_;
		var buf2 = this.surface;

		this.surface_ = buf2;
		this.surface = buf1;

		for (var name in this.regions_) {
			this.drawRegion_(name, dx, dy);
		}

		return buf1;
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
		var b = region.bounds_;
		var x = b.origin.x;
		var y = b.origin.y;
		var w = b.extent.x;
		var h = b.extent.y;

		var src = this.surface_;
		var dst = this.surface;

		/* Clip for out of bounds values */
		var cx = (sx < 0 ? -sx : 0) + x;
		var cy = (sy < 0 ? -sy : 0) + y;
		var ww = w - (sx < 0 ? -sx : sx);
		var hh = h - (sy < 0 ? -sy : sy);

		// Destination in the window buffer
		var dx = x + (sx > 0 ? sx : 0);
		var dy = y + (sy > 0 ? sy : 0);

		var renderer = dst.renderer;

		// Copy a main surface area to the region buffer
		if (src !== dst) { renderer.clearRect(b); }
		renderer.copy_(src, cx, cy, ww, hh, dx, dy, ww, hh);

		// Handle auto loop
		if (region.loop) {
			if (sx < 0) {
				renderer.copy_(src,
								dx, cy, -sx, hh,
								dx + ww, dy, -sx, hh);

				if (sy < 0) {
					renderer.copy_(src,
									dx, dy, -sx, -sy,
									dx + ww, dy + hh, -sx, -sy);

				} else if (sy > 0) {
					renderer.copy_(src,
									dx, cy + hh, -sx, sy,
									dx + ww, cy, -sx, sy);
				}

			} else if (sx > 0) {
				renderer.copy_(src,
								cx + ww, cy, sx, hh,
								cx, dy, sx, hh);

				if (sy < 0) {
					renderer.copy_(src,
									cx + ww, dy, sx, -sy,
									cx, dy + hh, sx, -sy);

				} else if (sy > 0) {
					renderer.copy_(src,
									cx + ww, cy + hh, sx, sy,
									cx, cy, sx, sy);
				}
			}

			if (sy < 0) {
				renderer.copy_(src,
								cx, dy, ww, -sy,
								dx, dy + hh, ww, -sy);

			} else if (sy > 0) {
				renderer.copy_(src,
								cx, cy + hh, ww, sy,
								dx, cy, ww, sy);
			}
		}
	};

})();
