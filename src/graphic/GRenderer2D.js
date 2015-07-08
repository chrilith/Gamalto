/*
 * Gamalto.Renderer2D
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

	/**
	 * Dependencies
	 */
	gamalto.devel.require("BaseRenderer");

	/**
	 * Creates a rendering engine for a canvas.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Renderer2D
	 * @augments Gamalto.BaseRenderer
	 *
	 * @see Gamalto.Canvas2D
	 */
	var _Object = G.Renderer2D = function(canvas) {
		Object.base(this, canvas);
	};

	/** @alias Gamalto.Renderer2D.prototype */
	var proto = _Object.inherits(G.BaseRenderer);

	/* Instance methods */
	proto.drawBitmap = function(bitmap, x, y) {
		var sw = bitmap.width;
		var sh = bitmap.height;
		var drawable = bitmap.getDrawable_;

		this.transform_(x, y, sw, sh);
		this.context
			.drawImage(drawable ? drawable.call(bitmap) : bitmap, x, y);
	};

	proto.drawBitmapSection = function(bitmap, x, y, r) {
		var sx = r.origin.x;
		var sy = r.origin.y;
		var sw = r.extent.x;
		var sh = r.extent.y;
		var gc = bitmap.getDrawable_;

		this.transform_(x, y, sw, sh);
		this.context
			.drawImage(gc ? gc.call(bitmap) :
				bitmap, sx, sy, sw, sh, x, y, sw, sh);
	};

	proto.enableFiltering = function(isOn) {
		this.context.setMember("imageSmoothingEnabled", Boolean(isOn));
	};

	proto.fillRect = function(r, style) {
		var s = this.canvas;
		var x = 0;
		var y = 0;
		var w, h;

		if (r) {
			x = r.origin.x;
			y = r.origin.y;
			w = r.extent.x;
			h = r.extent.y;
		} else {
			w = s.width;
			h = s.height;
		}

		var ctx = this.context;

		this.transform_(x, y, w, h);
		ctx.fillStyle = style.__toCanvasStyle();
		ctx.fillRect(x, x, w, h);
	};

	proto.clearRect = function(r) {
		this.context.clearRect(r.origin.x, r.origin.y, r.extent.x, r.extent.y);
	};

	proto.hLine = function(x, y, w, style) {
		var ctx = this.context;

		this.transform_(x, y, w, 1);
		ctx.strokeStyle = style.__toCanvasStyle();

		x += 0.0;
		y += 0.5;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w - 1, y);
		ctx.stroke();
	};

	proto.vLine = function(x, y, h, style) {
		var ctx = this.context;

		this.transform_(x, y, 1, h);
		ctx.strokeStyle = style.__toCanvasStyle();

		x += 0.5;
		y += 0.5;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + h - 1);
		ctx.stroke();
	};

	proto.reset = function() {
		_Object.base.reset.call(this);
		this.reset_();
	};

	proto.transform_ = function(x, y, w, h) {
		var transform = this.transform;

		if (!this.trans_ || !(
			transform.flipX ||
			transform.flipY ||
			transform.alpha < 1
		)) {
			this.reset_();
		}

		var ctx  = this.context;
		var cx = x + (w >> 1);
		var cy = y + (h >> 1);
		var fx = (transform.flipX ? -1 : 1);
		var fy = (transform.flipY ? -1 : 1);

		// Check: source-in=source-atop on iOS, cannot use colors with alpha channel
		// https://developer.mozilla.org/samples/canvas-tutorial/6_1_canvas_composite.html
		ctx.globalAlpha = transform.alpha;
		ctx.setTransform(fx, 0, 0, fy, cx * (1 - fx), -cy * (fy - 1));
	};

	proto.clip_ = function(r) {
		var ctx = this.context;

		if (!r) {
			ctx.restore();
		} else {
			ctx.save();
			ctx.beginPath();
			ctx.rect(r.origin.x, r.origin.y, r.extent.x, r.extent.y);
			ctx.clip();
		}
	};

	proto.copy_ = function(bitmap, sx, sy, sw, sh, dx, dy, dw, dh) {
		var drawable = bitmap.getDrawable_;
		this.context.drawImage(drawable ? drawable.call(bitmap) :
			bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
	};

	proto.reset_ = function() {
		var ctx = this.context;
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	};

})();
