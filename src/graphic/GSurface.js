/*
 * Gamalto.Surface
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
	gamalto.devel.require("Canvas2D");
	gamalto.devel.using("BaseRenderer");
	gamalto.devel.using("Box");

	/**
	 * Creates a new drawing surface.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Surface
	 * @augments Gamalto.Object
	 * @implements {Gamalto.ISize}
	 *
	 * @param {number} width
	 *        Physical horizontal size of the surface.
	 * @param {number} height
	 *        Physical vertical size of the surface.
	 * @param {Gamalto.BaseCanvas} [canvas]
	 *        Type of the internal canvas.
	 * 
	 * @example
	 * var surface = new Gamalto.Surface(320, 240);
	 */
	var _Object = G.Surface = function(width, height, canvas) {
		/**
		 * Drawing canvas.
		 * 
		 * @member {Gamalto.BaseCanvas}
		 * @readonly
		 * @alias Gamalto.Surface#canvas
		 */
		var canvas = this.canvas = new (canvas || G.Canvas2D)(width, height);
		/**
		 * Internal canvas.
		 * 
		 * @member {Gamalto.BaseRenderer}
		 * @readonly
		 * @alias Gamalto.Surface#renderer
		 */
		this.renderer = canvas.createRenderer();
		/**
		 * Horizontal size of the surface.
		 * 
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.Surface#width
		 */
		this.width = canvas.width;
		/**
		 * Vertical size of the surface.
		 * 
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.Surface#height
		 */
		this.height	= canvas.height;

		this.disableClipping();
	},

	/** @alias Gamalto.Surface.prototype */
	proto = _Object.inherits(G.Object);

	/**
	 * Activates the renderering clipping.
	 * 
	 * @param  {Gamalto.Box} rect
	 *         Rectangle representing the clipping area.
	 */
	proto.enableClipping = function(rect) {
		if (this.clipping_) {
			this.disableClipping();
		}
		this.clipping_ = true;
		this.renderer.clip_(rect);
	};

	/**
	 * Disables the renderering clipping.
	 */
	proto.disableClipping = function() {
		this.clipping_ = false;
		this.renderer.clip_();
	};

	/**
	 * Copies a surface content at the given position.
	 * 
	 * @param  {Gamalto.Surface} surface
	 *         Surface to copy.
	 * @param  {number} x
	 *         Horizontal origin of the copy.
	 * @param  {number} y
	 *         Vertical origin of the copy.
	 */
	proto.blit = function(surface, x, y) {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.drawBitmap(surface, x, y);
		renderer.setTransform(old);
	};

	/**
	 * Redraws parts of the given surface into the current surface.
	 * 
	 * @param  {Gamalto.Surface} surface
	 *         Surface to copy.
	 * @param  {number} x
	 *         Horizontal origin of the copy.
	 * @param  {number} y
	 *         Vertical origin of the copy.
	 * @param  {array.<Gamalto.Box>} regions
	 *         List of the regions to be updated.
	 */
	proto.redraw = function(surface, x, y, regions) {
		if (regions) {
			var renderer = this.renderer,
				old = renderer.setTransform(false);
			regions.forEach(function(r) {
				renderer.drawBitmapSection(surface, r.origin.x + x, r.origin.y + y, r);
			});
			renderer.setTransform(old);
		}
	};

	/**
	 * Clears the surface content.
	 */
	proto.clear = function() {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.clearRect(new G.Box(0, 0, this.width, this.height));
		renderer.setTransform(old);
	};

	/**
	 * Gets a buffer for direct drawing.
	 * 
	 * @return {object} A buffer or null if the surface is already locked.
	 */
	proto.lock = function() {
		return this.locked_ ? null : (this.locked_ = this.canvas._getRawBuffer());
	};

	/**
	 * Unlocks a previously locked surface.
	 */
	proto.unlock = function() {
		if (this.locked_) {
			this.canvas._copyRawBuffer(this.locked_);
			this.locked_ = null;
		}
	};

	/**
	 * Gets an object than can be drawn on a HTMLCanvasElement.
	 *
	 * @internal
	 * @ignore
	 * 
	 * @return {object} HTMLCanvasElement or HTMLImageElement.
	 */
	proto.getCanvas_ = function() {
		this.renderer.flush();
		return this.canvas.getCanvas_();
	};

})();
