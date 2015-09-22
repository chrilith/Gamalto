/*
 * Gamalto.EventManager Keyboard Module
 * ------------------------------------
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
	gamalto.devel.using("Event");
	gamalto.devel.using("KeyboardEvent");

	/* Aliases */
	var _EventManager = G.EventManager;

	/**
	 * Creates a new keyboard event handler.
	 * This is an internal object which is not accessible to the client code.
	 *
	 * @constructor Gamalto.KeyboardEventHandler
	 * @augments Gamalto.Object
	 * @implements {Gamalto.IEventHandler}
	 * @protected
	 *
	 * @param  {Gamalto.EventManager} parent
	 *         Parent event manager.
	 */
	var _Object = function(parent) {
		/**
		 * Parent manager.
		 *
		 * @private
		 *
		 * @member {Gamalto.EventManager}
		 */
		this.parent_ = parent;

		/**
		 * Last key event for key repeat even if the is no more event in queue.
		 *
		 * @private
		 *
		 * @member {Gamalto.KeyboardEvent}
		 */
		this.last_ = null;

		/**
		 * Whether we are repeating a key to switch from delay to internval.
		 *
		 * @private
		 *
		 * @memebr {boolean}
		 */
		this.repeating_ = false;
	};

	/** @alias Gamalto.KeyboardEventHandler.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Initializes the event handler.
	 */
	proto.init = function() {
		this.enableKeyRepeat();
	};

	/**
	 * Starts listening to events.
	 */
	proto.listen = function() {
		global.addEventListener("keydown", this, false);
		global.addEventListener("keyup", this, false);
	};

	/**
	 * Stops listening to events.
	 */
	proto.release = function() {
		global.removeEventListener("keydown", this, false);
		global.removeEventListener("keyup", this, false);
	};

	/**
	 * Enables or disables the keyboard repeat rate.
	 * Parameters are expressed in milliseconds.
	 *
	 * @param  {number} [delay=500]
	 *         How long the key must be pressed before to begin repeating.
	 * @param  {number} [interval=30]
	 *         Repeat speed after delay.
	 */
	proto.enableKeyRepeat = function(delay, interval) {
		/**
		 * Milliseconds before to begin repeating.
		 *
		 * @private
		 *
		 * @member {number}
		 */
		this.rDelay_ = gamalto.defined(delay, 500);

		/**
		 * Repeat speed.
		 *
		 * @private
		 *
		 * @member {number}
		 */
		this.rInterval_ = gamalto.defined(interval, 30);
	};

	/**
	 * Pushes an new event into the event queue.
	 *
	 * @private
	 *
	 * @param  {Gamalto.KeyBoardEvent} e
	 *         New keyboard event.
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
		var evt = new G.KeyboardEvent(e.type);

		// See http://javascript.info/tutorial/keyboard-events
		evt.keyCode = (e.keyCode || e.which);

		// Set modifiers only if it isn't the only key pressed
		evt.modifiers =
			(e.shiftKey		&& evt.keyCode != 16	? E.KMOD_SHIFT	: 0) |
			(e.ctrlKey		&& evt.keyCode != 17	? E.KMOD_CTRL	: 0) |
			(e.altKey		&& evt.keyCode != 18	? E.KMOD_ALT	: 0) |
			(e.metaKey		&& evt.keyCode != 91
							&& evt.keyCode != 93	? E.KMOD_META	: 0);

		// Clear key repeat state if not the same event
		var last = this.last_;

		if (!evt.equals(last)) {
			this.repeating_ = false;

		} else {
			var time;

			// Is there any repeat delay? (read the expected repeat time...)
			if ((time = (this.repeating_ ? this.rInterval_ : this.rDelay_) | 0)) {

				// Yes, but elapsed time is to short, ignore... (but still repeating)
				if ((Date.now() - last.time) < time) {
					return false;
				}

				// Set the repeat state to check against interval instead of delay next time
				this.repeating_ = true;

			// Not in 'interval' (which may be 0) and no 'delay'
			} else if (!this.repeating_) {
				return false;
			}
		}

		this.last_ = evt;
		return Boolean(q.push(evt));
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
			case "keydown":
			case "keyup":
				this.push_(e);
				break;
		}
	};

	/**
	 * Defines a manager to handle keyboard events.
	 *
	 * @constant BIT_KEYBOARD
	 * @memberof Gamalto.EventManager
	 */
	_EventManager.addObject_("BIT_KEYBOARD", _Object);

})(this);
