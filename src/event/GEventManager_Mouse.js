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

	/* Dependencies */
	gamalto.devel.require("EventManager");
	gamalto.devel.require("MouseEvent");
	gamalto.devel.using("KeyboardEvent");

	/* Aliases */
	var _EventManager = G.EventManager;

	/**
	 * Creates a new mouse event handler.
	 * This is an internal object which is not accessible to the client code.
	 *
	 * @constructor Gamalto.MouseEventHandler
	 * @augments Gamalto.Object
	 * @implements {Gamalto.IEventHandler}
	 * @protected
	 *
	 * @param  {Gamalto.EventManager} parent
	 *         Parent event manager.
	 */
	var _Object = function(parent) {
			this.parent_ = parent;
		};

	/** @alias Gamalto.MouseEventHandler.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Initializes the event handler.
	 */
	proto.init = function() {
		/**
		 * Bitmask holding mouse buttons state between events.
		 *
		 * @private
		 *
		 * @member {mumber}
		 */
		this.buttons_ = 0;
	};

	/**
	 * Starts listening to events.
	 */
	proto.listen = function() {
		// Use global to help event lsitening when changing active screen
		global.addEventListener("mousemove", this, false);
		global.addEventListener("mouseup", this, false);
		global.addEventListener("mousedown", this, false);
	};

	/**
	 * Stops listening to events.
	 */
	proto.release = function() {
		global.removeEventListener("mousemove", this, false);
		global.removeEventListener("mouseup", this, false);
		global.removeEventListener("mousedown", this, false);
	};

	/**
	 * Pushes an new event into the event queue.
	 *
	 * @private
	 *
	 * @param  {Gamalto.MouseEvent} e
	 *         New mouse event.
	 *
	 * @return {boolean} Whether the event has been pushed.
	 */
	proto.push_ = function(e) {
		var E = G.Event;
		var q = this.parent_.q_;

		// Prevent too big queue
		if (q.length == _EventManager.LIMIT) {
			return false;
		}

		// Create a new event
		var evt = new G.MouseEvent(e.type);

		// Set modifiers
		evt.modifiers =
			(e.shiftKey	? E.KMOD_SHIFT	: 0) |
			(e.ctrlKey	? E.KMOD_CTRL	: 0) |
			(e.altKey	? E.KMOD_ALT	: 0) |
			(e.metaKey	? E.KMOD_META	: 0);

		// Mouse related stuff
		evt.absX = e.clientX;
		evt.absY = e.clientY;

		// Relative
		var pos = gamalto.getBox_(evt.target_ = (e.target || e.srcElement));
		evt.x = evt.absX - pos.x;
		evt.y = evt.absY - pos.y;

		// Buttons
		if (e.type != "mousemove") {
			var state = (
					(e.button === 0 ? E.MBUT_LEFT   : 0) |
					(e.button === 1 ? E.MBUT_MIDDLE : 0) |
					(e.button === 2 ? E.MBUT_RIGHT  : 0)
				);

			if (e.type == "mouseup") {
				this.buttons_ &= ~state;
			} else {
				this.buttons_ |=  state;
			}
		}

		evt.buttons = this.buttons_;

		return (!q.length || !evt.equals(q[q.length - 1])) ?
			Boolean(q.push(evt)) : false;
	};

	/**
	 * Event handler.
	 *
	 * @private
	 *
	 * @param  {KeyboardEvent} e
	 *         System event.
	 */
	proto.handleEvent = function(e) {
		switch (e.type) {
			case "mousemove":
			case "mouseup":
			case "mousedown":
				this.push_(e);
				break;
		}
	};

	/**
	 * Defines a manager to handle mouse events.
	 *
	 * @constant BIT_MOUSE
	 * @memberof Gamalto.EventManager
	 */
	_EventManager.addObject_("BIT_MOUSE", _Object);

})(this);
