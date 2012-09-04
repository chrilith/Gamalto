/*
 * Gamalto.GEventManager_Keyboard_iCade
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

(function(env) {

	/**
	 * Dependencies
	 */
	G.require	("EventManager");
	G.using		("KeyboardEvent");
	
	/* Local */
	var input, base = G.EventManager;

	base._addManager("BIT_KBICADE", {
		init: function() {
			if (this._listen & base.BIT_KBICADE) {
				var body,
					h = this._handlerTouchCade = this._handleTouchCade.bind(this);
				this._handlerKeyCade = this._handleKeyCade.bind(this);
				
				// Element to enable external keyboard and activate iCade
				if (!input) {
					input = document.createElement("input");
					input.style.position = "relative";
					input.style.top = "-9999px";
				}
				document.addEventListener("DOMContentLoaded", function() {
					body = document.body;
					body.appendChild(input);
					body.addEventListener("touchstart", h, false);
				}, false);
			}
		},
		listen: function() {
			if (this._listen & base.BIT_KBICADE) {
				input.addEventListener("keydown", this._handlerKeyCade, false);
			}
		},
		release: function() {
			if (this._listen & base.BIT_KBICADE) {
				input.removeEventListener("keydown", this._handlerKeyCade, false);
				document.body.removeEventListener("touchstart", this._handlerTouchCade, false);
				input.parentNode.removeChild(input);
			}
		}
	});

	var proto = base.prototype;
	
	proto._pushKeyCade = function(e) {
		var i, key, type,
			q = this._q,
			cst = G.Event;

		key = (e.keyCode || e.which);
		// Prevent slowdown, we are polling on the input only
		// and so everything can be ignored but the special keys
		if ([16,17,18,91,93].indexOf(key) == -1 &&
				!e.ctrlKey && !e.metaKey) {	// For system shortcuts
			e.preventDefault();
		}
		if (q.length == 128) {
			return false;
		}		

		var test = [
			87, 69, cst.K_ICADE_UP,
			88, 90, cst.K_ICADE_DOWN,
			65, 81, cst.K_ICADE_LEFT,
			68, 67, cst.K_ICADE_RIGHT,

			89, 84, cst.K_ICADE_FIRE1,
			85, 70, cst.K_ICADE_FIRE2,
			73, 77, cst.K_ICADE_FIRE3,
			72, 82, cst.K_ICADE_FIRE4,
			74, 78, cst.K_ICADE_FIRE5,
			75, 80, cst.K_ICADE_FIRE6,

			79, 71, cst.K_ICADE_FIREX1,
			76, 86, cst.K_ICADE_FIREX2
		];
		
		for (i = 0; i < test.length; i += 3) {
			if (key == test[i+0] || key == test[i+1]) {
				type = (key == test[i+1]) ? cst.KEYUP : e.type;
				key  = test[i+2];
				break;
			}
		}
		if (!type) {
			return false;
		}
		
		var evt = new G.KeyboardEvent(type);
		evt.keyCode = key;
		evt.modifiers = 0;

		// We are adding a new event
		return !!(q.push(evt));
	}

	proto._handleKeyCade = function(e) {
		switch (e.type) {
			case "keydown":
				this._pushKeyCade(e);
				break;
		}
	}
	
	proto._handleTouchCade = function(e) {
		input.focus();
	}

})(ENV);
