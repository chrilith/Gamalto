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
	gamalto.devel.using("Rect");

	/**
	 * @constructor
	 */
	G.Surface = function(width, height, canvas) {
		var canvas = this.canvas = new (canvas || G.Canvas2D)(width, height);
		this.renderer = canvas.createRenderer(canvas);
		this.width	= canvas.width;
		this.height	= canvas.height;
		this.disableClipping();
	};

	/* Inheritance and shortcut */
	var proto = G.Surface.inherits(G.Object);

	/* Instance methods */
	proto.enableClipping = function(x, y, width, height) {
		if (this._isClipping) {
			this.disableClipping();
		}
		this._isClipping = true;
		this.renderer._clip(new G.Rect(x, y, width, height));
	};

	proto.disableClipping = function() {
		this._isClipping = false;
		this.renderer._clip();
	};

	proto.blit = function(s, x, y) {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.drawBitmap(s, x, y);
		renderer.setTransform(old);
	};

	proto.redraw = function(s, x, y, list) {
		if (list) {
			var renderer = this.renderer,
				len = list.length | 0,
				old = renderer.setTransform(false);
			list.forEach(function(r) {
				renderer.drawBitmapSection(s, r.origin.x + x, r.origin.y + y, r);
			});
			renderer.setTransform(old);
		}
	};

	proto.clear = function() {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.clearRect(new G.Rect(0, 0, this.width, this.height));
		renderer.setTransform(old);
	};

	// TODO: exception if accessing other methods while locked
	proto.lock = function() {
		if (!this._locked) {
			return (this._locked = this.canvas._getRawBuffer());
		}
		return null;
	};

	proto.unlock = function() {
		if (this._locked) {
			this.canvas._copyRawBuffer(this._locked);
			this._locked = null;
		}
	};

	proto.getCanvas_ = function() {
		this.renderer.flush();
		return this.canvas.getCanvas_();
	};

})();
