/*
 * Gamalto.TouchGamepad
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

// FIXME: bug on iOS5 where touchend event is not always raised properly

(function() {
	/* Dependencies */
	G.require("Shape");

	/* Local */
	var AXES	= 0,
		BUTTONS	= 1,
		COUNT	= 2;

	/**
	 * @constructor
	 */
	G.TouchGamepad = function(name, container) {
		this.id = name;
		this.axes = [];
		this.buttons = [];
		this.connected = false;
		// this._capture = false; // For mouse handling

		this._parent = container || G.getMainContainer();
		this._shapes = {
			func: ["_checkAxes", "_checkButton"],
			nfo : [[], []] 	// 0 = axes, 1 = buttons
		};

		this.reflow();
	}

	var proto = G.TouchGamepad.inherits(G.Object);

	proto.setActive = function(isOn) {
		if (this.connected != isOn) {
			var action = isOn ? "addEventListener" : "removeEventListener",
				events = this.isSupported() ?
					["touchstart", "touchend", "touchmove"] :
					["mousedown",  "mouseup",  "mousemove"];

			this.connected = isOn;
			window[action]("resize", this, false);
			for (var i = 0; i < 3; i++) {
				this._parent[action](events[i], this, false);
			}
		}
	}
	
	proto.isSupported = function() {
		return ('ontouchstart' in window);
	}

	proto.handleEvent = function(e) {
		if (e.type == "resize") {
			this.reflow();
		} else if (e.type.substr(0, 5) == "touch") {
			this._handleAction(e, e.type != "touchend");
		} else {
			this._mouseHandler(e);
		}
	}
	
	/* Mouse handler for desktop testing */
	proto._mouseHandler = function(e) {
		var end, capture = this._capture;

		if (e.type == "mousedown") {
			capture = this._capture = (e.button === 0) || capture;
		}
		if (capture) {
			end = (e.type == "mouseup" && e.button === 0);
			this._handleAction(e, !end);
		}
		if (end) { this._capture = false; }
	}

	proto._handleAction = function(e, active) {
		// Handle both touch and mouse for desktop testing
		var p, i, touch = (active ? e.touches : e.changedTouches) || [e];

		e.preventDefault();
		if (active) {
			// Clear everything before checking touches
			p = this.axes;
			for (i = 0; i < p.length; i++) { p[i] = 0; }
			p = this.buttons;
			for (i = 0; i < p.length; i++) { p[i] = 0; }
		}

		for (i = 0; i < touch.length; i++) {
			var x = touch[i].clientX,
				y = touch[i].clientY;
			this._check(x, y, active);
		}
	}
	
	proto.reflow = function() {
		this._rect = G._xywh(this._parent);

		var j, p = this._shapes.nfo[AXES];
		for (i = 0; i < p.length; i++) {
			p[i].bbox = p[i].shape.getBoundingBox();
		}
	}

	proto.addAxes = function(shape, align) {
		this.axes.push(0);
		this.axes.push(0);

		this._shapes.nfo[AXES].push({
			shape: shape,
			align: align,
			bbox : shape.getBoundingBox()
		});
	}
	
	proto.addButton = function(shape, align) {
		this.buttons.push(0);

		this._shapes.nfo[BUTTONS].push({
			shape: shape,
			align: align
		});
	}

	proto._checkAxes = function(i, x, y, active) {
		var p = this._shapes.nfo[AXES][i];

		if (p.shape.pointInShape(x, y)) {
			if (!active) {
				x = y = 0;
			} else {
				var bbox = p.bbox,
					w = bbox.width >> 1,
					h = bbox.height >> 1;

				x = Math.fmin(1, Math.fmax(-1, ((x - bbox.tL.x) - w) / (w - 1)));
				y = Math.fmin(1, Math.fmax(-1, ((y - bbox.tL.y) - h) / (h - 1)));	
			}

			this.axes[(i << 1) + 0] = x;
			this.axes[(i << 1) + 1] = y;

			return true;
		}
		return false;
	}
	
	proto._checkButton = function(i, x, y, active) {
		var p = this._shapes.nfo[BUTTONS][i];

		if (p.shape.pointInShape(x, y)) {
			this.buttons[i] = active | 0;

			return true;
		}
		return false;
	}

	proto._check = function(x, y, active) {
		var j, i, xx, yy, tc,
			sh = this._shapes,
			r = this._rect,
			S = G.Shape;

		for (j = 0; j < COUNT; j++) {
			var p = sh.nfo[j];
			for (i = 0; i < p.length; i++) {
				xx = x - r.x;
				yy = y - r.y;
				tc = p[i];
				
				if (tc.align & S.ALIGN_BOTTOM) {
					yy -= r.h >> (tc.align & S.ALIGN_TOP ? 1 : 0);
				}
				if (tc.align & S.ALIGN_RIGHT) {
					xx -= r.w >> (tc.align & S.ALIGN_LEFT ? 1 : 0);
				}

				// TODO: check for change and raise event
				if (this[sh.func[j]](i, xx, yy, active)) {
					// Touch has been assigned, no more check
					return;
				}
			}
		}
	}

})();
