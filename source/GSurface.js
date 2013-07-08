/*
 * Gamalto.Surface
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
	gamalto.require("Canvas");
	gamalto.using("Rect");
	gamalto.using("Renderer");

	/**
	 * @constructor
	 */
	G.Surface = function(width, height/*, renderer*/) {
		Object.base(this, width, height);
		this.renderer = new G.Renderer(this);
		this.disableClipping();
	};
	
	/* Inheritance and shortcut */
	var proto = G.Surface.inherits(G.Canvas);

	/* Instance methods */
	proto.enableClipping = function(x, y, width, height) {
		var ctx = this.renderer._getContext();

		if (this._isClipping) {
			this.disableClipping();
		}

		ctx.save();
		ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.clip();
	}

	proto.disableClipping = function() {
		this.renderer._getContext().restore();
	}

	proto.blit = function(s, x, y) {
		this.renderer._reset();
		this.renderer._getContext().drawImage(s._getCanvas(), x, y);
	}

	proto.redraw = function(s, x, y, list) {
		if (list) {
			var len = list.length | 0, n;

			this.renderer._reset();
			for (n = 0; n < len; n++) {
				var r = list[n],

					sx = r.tL.x,
					sy = r.tL.y,
					dx = sx + x,
					dy = sy + y,
					sw = r.width,
					sh = r.height;

				this.renderer._getContext()
					.drawImage(s._getCanvas(), sx, sy, sw, sh, dx, dy, sw, sh);
			}
		}
	}

	proto.clear = function() {
		var renderer = this.renderer;
		renderer._reset();
		renderer._getContext().clearRect(0, 0, this.width, this.height);
	}

	// TODO: exception if accessing other methods while locked
	proto.lock = function() {
		if (!this._locked) {
			return (this._locked = this.renderer._getContext().getImageData(0, 0, this.width, this.height));
		}
		return null;
	}

	proto.unlock = function() {
		if (this._locked) {
			this._copyRawBuffer(this._locked);
			this._locked = null;
		}
	}

	proto._getCanvas = function() {
		this.renderer.flush();
		return G.Surface.base._getCanvas.call(this);
	}

	/* Constants */
	var constant = G.Surface;

	constant.DEFAULT	= 0;
})();
