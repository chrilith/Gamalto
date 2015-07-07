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
	 * @memberof Gamalto
	 * @constructor Gamalto.Renderer2D
	 * @augments Gamalto.BaseRenderer
	 */
	G.Renderer2D = function(canvas) {
		Object.base(this, canvas);
	};

	/* Inheritance and shortcut */
	var proto = G.Renderer2D.inherits(G.BaseRenderer);

	/* Instance methods */
	proto.drawBitmap = function(bitmap, x, y) {
		var sw = bitmap.width;
		var sh = bitmap.height;
		var xy = this._transform(x, y, sw, sh);
		var gc = bitmap.getCanvas_;

		this._getContext()
			.drawImage(gc ? gc.call(bitmap) : bitmap, xy[0], xy[1]);
	};

	proto.drawBitmapSection = function(bitmap, x, y, r) {
		var sx = r.origin.x;
		var sy = r.origin.y;
		var sw = r.extent.x;
		var sh = r.extent.y;
		var xy = this._transform(x, y, sw, sh);
		var gc = bitmap.getCanvas_;

		this._getContext()
			.drawImage(gc ? gc.call(bitmap) :
				bitmap, sx, sy, sw, sh, xy[0], xy[1], sw, sh);
	};

	proto.enableFiltering = function(isOn) {
		this._getContext().setMember("imageSmoothingEnabled", Boolean(isOn));
	};

	proto.fillRect = function(r, style) {
		var s = this.canvas;
		var x = 0;
		var y = 0;
		var w, h, v;

		if (r) {
			x = r.origin.x;
			y = r.origin.y;
			w = r.extent.x;
			h = r.extent.y;
		} else {
			w = s.width;
			h = s.height;
		}

		var ctx = this._getContext();
		var xy  = this._transform(x, y, w, h);

		ctx.fillStyle = style.__toCanvasStyle();
		ctx.fillRect(xy[0], xy[1], w, h);
	};

	proto.clearRect = function(r) {
		this._getContext().clearRect(r.origin.x, r.origin.y, r.extent.x, r.extent.y);
	};

	proto.hLine = function(x, y, w, style) {
		var ctx = this._getContext();
		var xy  = this._transform(x, y, w, 1);

		ctx.strokeStyle = style.__toCanvasStyle();

		x = (xy[0] | 0) + 0.0;
		y = (xy[1] | 0) + 0.5;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w - 1, y);
		ctx.stroke();
	};

	proto.vLine = function(x, y, h, style) {
		var ctx = this._getContext();
		var xy  = this._transform(x, y, 1, h);

		ctx.strokeStyle = style.__toCanvasStyle();

		x = (xy[0] | 0) + 0.5;
		y = (xy[1] | 0) + 0.5;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + h - 1);
		ctx.stroke();
	};

	// http://en.wikipedia.org/wiki/Transformation_matrix
	// http://cairographics.org/matrix_transform/

	proto._transform = function(x, y, w, h) {
		var transform = this.transform;

		if (!this._trans || !(
			transform.flipX ||
			transform.flipY ||
			transform.alpha < 1 ||
			!this._origin.isZero() ||
			this._scaleX != 1 ||
			this._scaleY != 1 ||
			(this._rotate !== 0 && this._rotate !== 360) ||
			this._mask
		)) {
			this._reset();
			return [x, y];
		}

		// TODO: compute matrices members in an array and use apply() once per change?
		var o  = this;
		var dx = 0;
		var dy = 0;
		var c  = o.canvas._context;
		var cx = x + (w >> 1) + this._origin.x;
		var cy = y + (h >> 1) + this._origin.y;
		var fx = (transform.flipX ? -1 : 1) * o._scaleX;
		var fy = (transform.flipY ? -1 : 1) * o._scaleY;
		var rt = o._rotate;

		c.globalAlpha = transform.alpha;

		// Check: source-in=source-atop on iOS, cannot use colors with alpha channel
		// https://developer.mozilla.org/samples/canvas-tutorial/6_1_canvas_composite.html
		c.globalCompositeOperation = o._mask ? "source-in" : "source-over";
		c.setTransform(fx, 0, 0, fy, cx * (1 - fx), -cy * (fy - 1));

		// Position adjustment to copy to the correct [x,y] position
		if (o._scaleX != 1) {
			dx = (w >> 1) * (1 / o._scaleX - 1);
		}
		if (o._scaleY != 1) {
			dy = (h >> 1) * (1 / o._scaleY - 1);
		}

		// Rotation, matrix multiplication will be handled natively to simplify...
		if (rt) {
			var cos = Math.cos(rt);
			var sin = -Math.sin(rt);

			c.transform( cos, sin,
						-sin, cos,
						cx - cos * cx + sin * cy - dx,
						cy - sin * cx - cos * cy + dy);
			dx = dy = 0;
		}

		return [x - dx, y + dy];
	};

	proto.clip_ = function(r) {
		var ctx = this._getContext();

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
		var getCanvas = bitmap.getCanvas_;
		this._getContext().drawImage(getCanvas ? getCanvas.call(bitmap) :
			bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
	};

	proto._reset = function() {
		var ctx = this._getContext();
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	};

})();
