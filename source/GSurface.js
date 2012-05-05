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
	G.using("Rect");
	G.using("Renderer");

	/**
	 * @constructor
	 */
	G.Surface = function(width, height) {
		this._initCanvas();
		this.setSize(width, height);
		this.disableClipping();
	};
	
	/* Inheritance and shortcut */
	var proto = G.Surface.inherits(G.Object);
	
	proto._initCanvas = function() {
		this._canvas = document.createElement("canvas");	
		this.renderer = new G.Renderer(this);
	//	this._canvas.style.zIndex = 0;
	}
	
	proto._applySize = function() {
		var o = this,
			c = o._canvas;
		c.width = o.width;
		c.height = o.height;
		o._context = c.getContext("2d");
	}
	
	/* Instance methods */
	proto.setSize = function(width, height) {
		var that	= this;
		that.width	= width  || 320;
		that.height	= height || 240;
		that._applySize();
		that._area = new G.Rect(0, 0, that.width, that.height);	// Used by G.Renderer
	}
	
	proto.enableClipping = function(x, y, width, height) {
		this._clipping = new G.Rect(x, y, width, height);
	}
	
	proto.disableClipping = function() {
		this._clipping = null;
	}
	
	proto.blit = function(s, x, y) {
		var cp = this._clipping,
			cx = this._context;

		this.renderer._reset();
		if (!cp) {
			// Everything is handled by the JavaScript engine
			cx.drawImage(s._canvas, x, y);
		} else {
			var r = new G.Rect(x, y, s.width, s.height).intersecting(cp);
	
			if (r !== null) {
				var dx = r.tL.x,
					dy = r.tL.y,
					sx = dx - x,
					sy = dy - y,
					ww = r.bR.x - dx + 1,
					hh = r.bR.y - dy + 1;
		
				cx.drawImage(s._canvas, sx, sy, ww, hh, dx, dy, ww, hh);
			}
		}
	}
	
	proto.redraw = function(s, x, y, list) {
		if (list) {
			var len = list.length | 0,
				o = this, n, i, r,
				c = o._clipping || new G.Rect(0, 0, o.width, o.height);
	
			for (n = 0; n < len; n++) {
				r = list[n].offset(x, y).intersecting(c);
	
				if (r !== null) {
					var dx = r.tL.x,
						dy = r.tL.y,
						sx = dx - x,
						sy = dy - y,
						ww = r.bR.x - dx + 1,
						hh = r.bR.y - dy + 1;
	
					this._context.drawImage(s._canvas, sx, sy, ww, hh, dx, dy, ww, hh);
				}
			}
		}
	}

	proto.clear = function() {
		this.renderer._reset();
		this._context.clearRect(0, 0, this.width, this.height);
	}

})();