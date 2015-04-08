/*
 * Gamalto.Screen
 * --------------
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

(function(global) {

	/* Dependencies */
	gamalto.devel.require("Surface");
	gamalto.devel.using("Color");
	gamalto.devel.using("Box");

	/**
	 * Creates a new surface to handle the main display.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Screen
	 * @augments Gamalto.Surface
	 *
	 * @param {number} width
	 *        Physical horizontal size of the screen.
	 * @param {number} height
	 *        Physical vertical size of the screen.
	 * @param {Gamalto.BaseCanvas} [canvas]
	 *        Type of the internal canvas.
	 *
	 * @example
	 * var screen = new Gamalto.Screen(320, 240);
	 */
	var _Object = G.Screen = function(width, height, canvas) {

		Object.base(this, width, height, canvas);
		/**
		 * Surface that will be display on the physical screen.
		 *
		 * @private
		 * @ignore
		 * 
		 * @member {Gamalto.Surface}
		 */
		this.screen_ = new G.Surface(width, height, canvas);
	},

	/** @alias Gamalto.Screen.prototype */
	proto = _Object.inherits(G.Surface);


	/**
	 * Gets the HTMLCanvasElement of the screen.
	 *
	 * @private
	 * @ignore
	 * 
	 * @return {HTMLCanvasElement} Screen canvas element.
	 */
	proto.getElement_ = function() {
		return this.screen_.getCanvas_();
	};

	/**
	 * Gets the displayed screen surface for direct access.
	 * Accessing the surface may lead to unexpected rendering artifacts.
	 * 
	 * @return {Gamalto.Surface} Screen surface.
	 */
	proto.getSurface = function() {
		return this.screen_;
	};

	/**
	 * Sets the mouse cursor visibility.
	 * 
	 * @param {boolean} isOn
	 *        Whether to show the mouse cursor.
	 */
	proto.enableMouse = function(isOn) {
		this.getElement_().style.cursor = isOn ? "" : "none";
	};

	/**
	 * Sets the filtering state.
	 * 
	 * @param {boolean} isOn
	 *        Whether to smooth the screen when stretched.
	 */
	proto.enableFiltering = function(isOn) {
		var style = this.getElement_().style;

		// No way for IE:(
		if (!isOn &&
			(style.setMember("imageRendering", "pixelated") ||
			 style.setMember("imageRendering", "crisp-edges") ||
			 style.setMember("imageRendering", "optimize-contrast") )) {
	
		// Off? reset property to its initial state
		} else if (isOn) {
			 style.setMember("imageRendering", null);
		}
	};

	/**
	 * Clears the screen to black.
	 */
	proto.clear = function() {
		var renderer = this.renderer,
			old = renderer.setTransform(false);
		renderer.fillRect(new G.Box(0, 0, this.width, this.height), G.Color.BLACK);
		renderer.setTransform(old);
	};
	
	/**
	 * Sets the scalines effect state.
	 * If no parameter is specified, scalines are disabled.
	 * 
	 * @param {number} dark
	 *        The dark lines level between 0 and 1.
	 * @param {number} light
	 *        The light lines level between 0 and 1.
	 */
	proto.setScanlines = function(dark, light) {
		if (!(dark || light)) {
			this.scanlines_ = null;

		} else {
			var s = new G.Surface(1, 2),
				r = s.renderer;

			// Create the scanlines effect
			r.fillRect(new G.Box(0, 0, 1, 1),
					   new G.Color(0, 0, 0, 255 * (dark || 0) / 100));
			r.fillRect(new G.Box(0, 1, 1, 1),
					   new G.Color(255, 255, 255, 255 * (light || 0) / 100));			

			this.scanlines_ = new G.Pattern(s);
		}
	};

	/**
	 * Displays the screen content.
	 */
	proto.refresh = function() {
		this.screen_.blit(this, 0, 0);
		if (this.scanlines_) {
			this.screen_.renderer.fillRect(null, this.scanlines_);
		}
	};

	/**
	 * Adjust the logical screen size.
	 * 
	 * @param {number} mode
	 *        Bitmask indicating the transformation to apply.
	 */
	proto.setStretch = function(mode) {
		var canvas = this.getElement_(),
			style = canvas.style,
			parent = canvas.parentNode;

		// Reset styles to default (parent should be set to overflow=hidden)
		style.marginTop =
			style.marginLeft =
			style.width =
			style.height = "";

		// Read the requested mode
		mode = (this.stretch_ = Number(mode || this.stretch_) | 0);
		if (mode === this.STRETCH_DEFAULT) { return; }

		var rw, rh,
			w1 = parent.offsetWidth;
			h1 = parent.offsetHeight,
			w2 = canvas.width,
			h2 = canvas.height;

		if (mode & this.STRETCH_UNIFORM) {
			if (w1 / h1 < w2 / h2) {
				rw = w1;
				rh = rw * (h2 / w2);
			} else {
				rh = h1;
				rw = rh * (w2 / h2);
			}
		// Any other non-default mode?
		} else if (mode) {
			rw = w1;
			rh = h1;
		}

		if (mode & this.STRETCH_FILL) {
			if (rw < w1) {
				rh *= w1 / rw;
				rw  = w1;
				style.marginTop = ((h1 - rh) >> 1) + "px";
			} else {
				rw *= h1 / rh;
				rh  = h1;
				style.marginLeft = ((w1 - rw) >> 1) + "px";
			}
		}
		// Finally sets the canvas element size
		style.width  = rw + "px";
		style.height = rh + "px";
	};
	
	/**
	 * No specific streching.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.STRETCH_DEFAULT	= 0;
	/**
	 * Bit to keep aspect ratio.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.STRETCH_UNIFORM	= 1 << 1;
	/**
	 * Bit to fill the parent.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.STRETCH_FILL	= 1 << 2;

	/**
	 * Active screen.
	 *
	 * @ignore
	 * 
	 * @type {Gamalto.Screen}
	 */
	var active;

	/**
	 * Sets the visible screen.
	 *
	 * @function setActive
	 * @memberof Gamalto.Screen
	 * @static
 	 * 
	 * @param {Gamalto.Screen} screen
	 *        Screen to be shown.
	 */
	_Object.setActive = function(screen) {
		var container = gamalto.getContainer();
		if (active) {
			container.removeChild(active.getElement_());
		}
		container.appendChild(screen.getElement_());
		// Adjust the screen size
		screen.setStretch();
	};

	// Adjusts the screen when the window is resized
	global.addEventListener("resize", function() {
		if (active) {
			active.setStretch();
		}
	}, false);

})(this);
