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

(function() {

	/**
	 * Dependencies
	 */
	gamalto.require_("EventManager");
	gamalto.using_("KeyboardEvent");	// FIXME: iCade consts are required
	
	/* Local */
	var input,
		base = G.EventManager,
		E = G.Event,
		_slow = [16, 17, 18, 91, 93],
		_test = [
			87, 69, E.K_ICADE_UP,
			88, 90, E.K_ICADE_DOWN,
			65, 81, E.K_ICADE_LEFT,
			68, 67, E.K_ICADE_RIGHT,

			89, 84, E.K_ICADE_FIRE1,
			85, 70, E.K_ICADE_FIRE2,
			73, 77, E.K_ICADE_FIRE3,
			72, 82, E.K_ICADE_FIRE4,
			74, 78, E.K_ICADE_FIRE5,
			75, 80, E.K_ICADE_FIRE6,

			79, 71, E.K_ICADE_FIREX1,
			76, 86, E.K_ICADE_FIREX2
		],
		manager = function(parent) {
			this._parent = parent;
		};

	base._addManager("BIT_KBICADE", manager);

	var proto = manager.prototype;
	
	proto.init = function() {
		// Element to enable external keyboard and activate iCade
		if (!input) {
			input = document.createElement("input");
			input.style.position = "absolute";
			input.style.top = "-9999px";
		}
		// CHECKME: we cannot call init() before gamalto.init()
		document.addEventListener("DOMContentLoaded", function() {
			var body = document.body;
			body.appendChild(input);
			body.addEventListener("touchstart", this, false);
		}, false);
	}

	proto.listen = function() {
		input.addEventListener("keydown", this, false);
	}

	proto.release = function() {
		input.removeEventListener("keydown", this, false);
		document.body.removeEventListener("touchstart", this, false);
		input.parentNode.removeChild(input);
	}
	
	proto._pushKeyCade = function(e) {
		var i, type,
			q = this._parent._q,
			key = (e.keyCode || e.which);

		// Prevent slowdown: we are polling on the input only
		// and so everything can be ignored but the special keys
		if (_slow.indexOf(key) == -1 &&
				!e.ctrlKey && !e.metaKey) {	// For system shortcuts
			e.preventDefault();
		}
		if (q.length == 128) {
			return false;
		}		
		for (i = 0; i < _test.length; i += 3) {
			if (key == _test[i+0] || key == _test[i+1]) {
				type = (key == _test[i+1]) ? E.KEYUP : e.type;
				key  = _test[i+2];
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

	proto.handleEvent = function(e) {
		switch (e.type) {
			case "keydown":
				this._pushKeyCade(e);
				break;
			case "touchstart":
				if (e.target == G.getContainer()) {
					input.focus();
				}
				break;
		}
	}

})();
