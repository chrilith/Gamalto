/*
 * Gamalto.GEventManager_Keyboard
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
	var base = G.EventManager;

	base._addManager("BIT_KEYBOARD", {
		init: function() {
			if (this._listen & base.BIT_KEYBOARD) {
				this._handlerKeyboard = this._handleKey.bind(this);
			}
		},
		listen: function() {
			if (this._listen & base.BIT_KEYBOARD) {
				var h = this._handlerKeyboard;
				env.addEventListener("keydown", h, false);
				env.addEventListener("keyup", h, false);
			}
		},
		release: function() {
			if (this._listen & base.BIT_KEYBOARD) {
				var h = this._handlerKeyboard;
				env.removeEventListener("keydown", h, false);
				env.removeEventListener("keyup", h, false);
			}
		}
	});

	var proto = base.prototype;
	
	/* TODO: Involve a constant polling (or readable in poll only??).
	   If needed, _release() will flush Q only
	proto.getModifiersState = function() {
		return ;
	}
	
	proto.disableSystemKey = function() {
		// do a preventDefaut with useCapture = true ??
		// Enable F11 for example, or Windows key?
	}
	*/
	
	proto.enableKeyRepeat = function(delay, interval) {
		this._rDelay = delay;		// 500
		this._rInterval = interval;	// 30
	}
	
	proto._pushKey = function(e) {
		var t, q = this._q;
		if (q.length == 128) {
			return false;
		}
		var cst = Event,
			evt = new G.KeyboardEvent(e.type);
		evt.keyCode = (e.keyCode || e.which);
		evt._time = e.timeStamp; // || Date.now();
		evt.modifiers =
			(e.shiftKey		&& e.keyCode != 16	? cst.KMOD_SHIFT: 0) |
			(e.ctrlKey		&& e.keyCode != 17	? cst.KMOD_CTRL	: 0) |
			(e.altKey		&& e.keyCode != 18 	? cst.KMOD_ALT	: 0);// |
	//		(e.altGraphKey	&& e.keyCode != 16	? cst.KMOD_ALTGR: 0) | => CTRL+ALT raised
	//		(e.metaKey		&& e.keyCode != 91
	//						&& e.keyCode != 92	? cst.KMOD_META	: 0);	// CHECKME
	
		var cur, lst = q.length - 1;
		for (var n = lst; n >= 0; n--) {
			cur = q[n];

			// Same event?
			if (cur.equals(evt)) {
				// Should we repeat?
				if (n == lst && (t = (cur._repeat ? this._rInterval : this._rDelay) | 0)) {
					// Not in time, ignore...
					if ((Date.now() - cur._time) < t) {	// TODO: add delta to event timeStamp
						return false;
					} else {
						cur._repeat = false;	// Prevent repeating when polling (keyA keyA [keyB keyA] <= polled, should not repeat keyA!)
						evt._repeat = true;		// tell next event that we should repeat
						break;
					}
				}
				// Not repeating, can we register it?
				if (!cur._done) {
					return false;
				}
			}
		}
		// We are adding a new event, ignore the equals() test next time
		if (lst >= 0) {
			q[lst]._done = true;
		}
		return !!(q.push(evt));
	}

	proto._handleKey = function(e) {
		switch (e.type) {
			case "keydown":
			case "keyup":
				this._pushKey(e);
				break;
		}
		//console.log(e);
	}

})(ENV);
