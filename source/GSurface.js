/*
 * Gamalto.Surface
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012-2014 Chris Apers and The Gamalto Project, all rights reserved.

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
	gamalto.require_("Buffer");
	gamalto.using_("Rect");
	gamalto.using_("Renderer2D");
	gamalto.using_("RendererWebGL");

	/**
	 * @constructor
	 */
	G.Surface = function(width, height, mode) {
		Object.base(this, width, height, mode);
		this.renderer = new G["Renderer" + (this._mode == G.Buffer.OPTIMIZED ? "WebGL" : "2D")](this);
		this.disableClipping();
	};
	
	/* Inheritance and shortcut */
	var proto = G.Surface.inherits(G.Buffer);

	/* Instance methods */
	proto.enableClipping = function(x, y, width, height) {
		if (this._isClipping) {
			this.disableClipping();
		}
		this._isClipping = true;
		this.renderer._clip(new G.Rect(x, y, width, height));
	}

	proto.disableClipping = function() {
		this._isClipping = false;
		this.renderer._clip();
	}

	proto.blit = function(s, x, y) {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.drawBitmap(s, x, y);
		renderer.setTransform(old);
	}

	proto.redraw = function(s, x, y, list) {
		if (list) {
			var renderer = this.renderer,
				len = list.length | 0,
				old = renderer.setTransform(false);
			list.forEach(function(r) {
				renderer.drawBitmapSection(s, r.tL.x + x, r.tL.y + y, r);
			});
			renderer.setTransform(old);
		}
	}

	proto.clear = function() {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.clearRect(new G.Rect(0, 0, this.width, this.height));
		renderer.setTransform(old);
	}

	// TODO: exception if accessing other methods while locked
	proto.lock = function() {
		if (!this._locked) {
			return (this._locked = this._getRawBuffer());
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

})();
