/*
 * Gamalto.Screen
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

	var _active;


	/* Dependencies */
	gamalto.require("Surface");
	gamalto.using("Color");
	gamalto.using("Rect");

	/**
	 * @constructor
	 */
	G.Screen = function(width, height) {
		Object.base(this, width, height);
	};
	
	/* Inheritance and shortcut */
	var proto = G.Screen.inherits(G.Surface);
	
	/* Instance methods */
	proto.setActive = function(parent) {
		 // Disable scanlines
		this.setScanlines();

		// Add the new screen to the document
		(parent || G.getContainer()).appendChild(this._canvas);

		// Adjust the screen stretching
		this.setStretch();
		
		if (_active) { window.removeEventListener("resize", _active, false); }
		window.addEventListener("resize", (_active = this), false);
	}

	proto.enableFiltering = function(isOn) {
		var style = this._canvas.style;

		if (!isOn &&
			(style.setMember("imageRendering", "crisp-edges") ||
			 style.setMember("imageRendering", "optimize-contrast") ||
			 style.setMember("interpolationMode",	"nearest-neighbor"))) {
	
		// Off? reset property to its initial state
		} else if (isOn) {
			 style.setMember("imageRendering", null);
			 style.setMember("interpolationMode", null);
		}
	}
	
	proto.setScanlines = function(dark, light) {
		var container = this._canvas.parentNode;

		if (container) {	
			var isOn = (dark || light),
				div = this._scanlines;

			if (isOn) {
				var s = new G.Surface(1, 2),
					r = s.renderer,
					c = s._context.canvas,
					p = G._xywh(this._canvas, container);

				// Prepare the object holding the scanline effect
				div = (div || document.createElement("div"));

				s = div.style;
				s.position = "absolute";
				s.left	 = p.x;
				s.top	 = p.y;
				s.width	 = p.w;
				s.height = p.h;

				// Create the scanlines effect
				r.fillRect(new G.Rect(0, 0, 1, 1),
						   new G.Color(0, 0, 0, 255 * (dark || 0) / 100));
				r.fillRect(new G.Rect(0, 1, 1, 1),
						   new G.Color(255, 255, 255, 255 * (light || 0) / 100));

				// Append the scanlines to the document
				s.backgroundImage = "url(" + c.toDataURL() + ")";
				container.appendChild(div);
				this._scanlines = div;

			} else if (div) {
				div.parentNode.removeChild(div);
				this._scanlines = null;
			}
		}
	}
			
	proto.setStretch = function(mode) {
		var c = this._canvas,
			s = c.style,
			p = c.parentNode;

		s.marginTop  = s.marginLeft = "";
		s.width = s.height = "";

		if (!p) { return; }
		mode = (this._stretch = (mode || this._stretch) | 0);
		if (mode === stat.STRETCH_NONE) { return; }

		var rw, rh,
			w1 = p.offsetWidth;
			h1 = p.offsetHeight,
			w2 = c.width,
			h2 = c.height;

		if (mode & stat.STRETCH_UNIFORM) {
			if (w1 / h1 < w2 / h2) {
				rw = w1;
				rh = rw * (h2 / w2);
			} else {
				rh = h1;
				rw = rh * (w2 / h2);
			}
		} else if (mode) {
			rw = w1;
			rh = h1;
		}

		if (mode & stat.STRETCH_FILL) {
			if (rw < w1) {
				rh *= w1 / rw;
				rw  = w1;
				s.marginTop = ((h1 - rh) / 2) + "px";
			} else {
				rw *= h1 / rh;
				rh  = h1;
				s.marginLeft = ((w1 - rw) / 2) + "px";
			}
		}
		s.width  = rw + "px";
		s.height = rh + "px";
	}

	proto.handleEvent = function(e) {
		switch (e.type) {
			case "resize":
				this.setStretch();
				break;
		}
	}

	var stat = G.Screen;
	
	stat.STRETCH_NONE		= 0;
	stat.STRETCH_UNIFORM	= 1 << 1;
	stat.STRETCH_FILL		= 1 << 2;

})();
