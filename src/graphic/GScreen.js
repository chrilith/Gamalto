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
	var _active, _scanlines,
		COCOON = navigator.isCocoonJS;

	/* Dependencies */
	gamalto.require_("Surface");
	gamalto.using_("Color");
	gamalto.using_("Rect");

	/**
	 * @constructor
	 */
	G.Screen = function(width, height, canvas) {
		// Real screen
		this._screen = new G.Surface(width, height, canvas);
		Object.base(this, width, height, canvas);
	};

	/* Inheritance and shortcut */
	var proto = G.Screen.inherits(G.Surface);
	
	/* Instance methods */
	proto.__screenCanvas = function() {
		return this._screen._getCanvas();
	}

	proto.getSurface = function() {
		return this._screen;
	}

	proto.setActive = function() {
		// Disable scanlines
		this.setScanlines();

		// Add the new screen to the document
		var container = gamalto.getContainer();
		if (_active) {
			window.removeEventListener("resize", _active, false);
			container.removeChild(_active.__screenCanvas());
		}
		window.addEventListener("resize", (_active = this), false);
		container.appendChild(this.__screenCanvas());

		// Adjust the screen stretching
		this.setStretch();
	}

	proto.enableMouse = function(isOn) {
		this.__screenCanvas().style.cursor = isOn ? "" : "none";
	};

	proto.enableFiltering = function(isOn) {
		var style = this.__screenCanvas().style;

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

	proto.clear = function() {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.fillRect(new G.Rect(0, 0, this.width, this.height), G.Color.BLACK);
		renderer.setTransform(old);
	}
	
	proto.setScanlines = function(dark, light) {
		if (!(dark || light)) {
			this._scanlines = null;

		} else {
			var s = new G.Surface(1, 2),
				r = s.renderer;

			// Create the scanlines effect
			r.fillRect(new G.Rect(0, 0, 1, 1),
					   new G.Color(0, 0, 0, 255 * (dark || 0) / 100));
			r.fillRect(new G.Rect(0, 1, 1, 1),
					   new G.Color(255, 255, 255, 255 * (light || 0) / 100));			

			this._scanlines = new G.Pattern(s);
		}
	}

	proto.refresh = function() {
		this._screen.blit(this, 0, 0);
		if (this._scanlines) {
			this._screen.renderer.fillRect(null, this._scanlines);
		}
	}

	proto.handleEvent = function(e) {
		this.setStretch();
	}
	
	proto.setStretch = (COCOON)
	?function(mode) {
		var prefix = "idtkscale:";
		mode = (this._stretch = (mode || this._stretch) | 0);

		this._getCanvas().style.cssText =
			(mode === stat.STRETCH_DEFAULT) ? "" :
			(mode & stat.STRETCH_UNIFORM) ?
				(mode & stat.STRETCH_FILL) ?
					prefix + "ScaleAspectFill" :
				prefix + "ScaleAspectFit" :
			"";	// Default: ScaleToFill;
	}
	:function(mode) {
		var c = this.__screenCanvas(),
			s = c.style,
			p = c.parentNode;

		s.marginTop  = s.marginLeft = "";
		s.width = s.height = "";

		if (!p) { return; }
		mode = (this._stretch = (mode || this._stretch) | 0);
		if (mode === stat.STRETCH_DEFAULT) { return; }

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

	var stat = G.Screen;
	
	stat.STRETCH_DEFAULT	= 0;
	stat.STRETCH_UNIFORM	= 1 << 1;	// TODO: what about aspcect ratio only?
	stat.STRETCH_FILL		= 1 << 2;

})();
