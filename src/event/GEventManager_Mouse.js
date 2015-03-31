/*
 * Gamalto.EventManager Standard Mouse Module
 * ------------------------------------------
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
	/* Shortcut */
	var core = gamalto;

	/**
	 * Dependencies
	 */
	gamalto.devel.require("EventManager");
	gamalto.devel.require("MouseEvent");
	gamalto.devel.using("KeyboardEvent");

	/* Local */
	var base = G.EventManager,
		manager = function(parent) {
			this._parent = parent;
		};

	base._addManager("BIT_MOUSE", manager);

	var proto = manager.prototype;

	proto.init = function() {
		this._buttons = 0;
	};

	proto.listen = function() {
		global.addEventListener("mousemove", this, false);
		global.addEventListener("mouseup", this, false);
		global.addEventListener("mousedown", this, false);
	};

	proto.release = function() {
		global.removeEventListener("mousemove", this, false);
		global.removeEventListener("mouseup", this, false);
		global.removeEventListener("mousedown", this, false);
	};

	proto._handle = function(e) {
		var p = this._parent,
			q = p._q;
		if (q.length == 128) {
			return false;
		}
		var cst = G.Event,
			evt = new G.MouseEvent(e.type),
			pos;

		evt._time = e.timeStamp; // || Date.now();
		evt.modifiers = !G.KeyboardEvent ? 0 :
			(e.shiftKey		&& evt.keyCode != 16	? cst.KMOD_SHIFT: 0) |
			(e.ctrlKey		&& evt.keyCode != 17	? cst.KMOD_CTRL	: 0) |
			(e.altKey		&& evt.keyCode != 18	? cst.KMOD_ALT	: 0);// |
	//		(e.altGraphKey	&& evt.keyCode != 16	? cst.KMOD_ALTGR: 0) | => CTRL+ALT raised
	//		(e.metaKey		&& evt.keyCode != 91
	//						&& evt.keyCode != 93	? cst.KMOD_META	: 0);	// CHECKME

		evt.target = (e.target || e.srcElement);

		// Mouse related stuff
		evt.absX = e.clientX;
		evt.absY = e.clientY;

		// Relative
		pos = core._xywh(evt.target);
		evt.x = evt.absX - pos.x;
		evt.y = evt.absY - pos.y;

		// Buttons
		if (e.type != "mousemove") {
			var state = (
					(e.button === 0 ? cst.KBUT_LEFT : 0) |
					(e.button === 1 ? cst.KBUT_MIDDLE : 0) |
					(e.button === 2 ? cst.KBUT_RIGHT : 0)
				);
			if (e.type == "mouseup") {
				this._buttons &= ~state;
			} else {
				this._buttons |=  state;
			}
		}
		evt.buttons = this._buttons;

		if (!q.length || !evt.equals(q[q.length - 1])) {
			return !!(q.push(evt));
		}
		return false;
	};

	proto.handleEvent = function(e) {
		switch (e.type) {
			case "mousemove":
			case "mouseup":
			case "mousedown":
				this._handle(e);
				break;
		}
	};

})(this);
