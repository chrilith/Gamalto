/*
 * Gamalto.MouseEvent
 * ------------------
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

(function() {

	/* Dependencies */
	gamalto.devel.require("Event");
	gamalto.devel.using("Screen");

	/**
	 * Creates a mouse event.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.MouseEvent
	 * @augments Gamalto.Event
	 *
	 * @param {string} type
	 *        Event name.
	 */
	var _Object = G.MouseEvent = function(type) {
		Object.base(this, type);

		/**
		 * Event target element.
		 *
		 * @internal
		 *
		 * @member {HTMLElement}
		 */

		/**
		 * Absolute horizontal position of the mouse.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.MouseEvent.prototype
		 * @member {number} absX
		 */

		/**
		 * Absolute vertical position of the mouse.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.MouseEvent.prototype
		 * @member {number} absY
		 */

		/**
		 * Target-relative horizontal position of the mouse.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.MouseEvent.prototype
		 * @member {number} x
		 */

		/**
		 * Target-relative vertical position of the mouse.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.MouseEvent.prototype
		 * @member {number} y
		 */

		/**
		 * Bitmask of the mouse buttons state.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.MouseEvent.prototype
		 * @member {number} buttons
		 */
	};

	/** @alias Gamalto.KeyboardEvent.prototype */
	var proto = _Object.inherits(G.Event);

	/**
	 * Determines if an object is equal to the current object.
	 *
	 * @param  {Gamalto.Event} that
	 *         Object to test.
	 *
	 * @return {boolean} True if the two objects are equal.
	 */
	proto.equals = function(that) {
		return (this.type		== that.type &&
				this.absX		== that.absX &&
				this.absY		== that.absY &&
				this.buttons	== that.buttons &&
				this.modifiers	== that.modifiers);
	};

	/**
	 * Checks if the event occured on the active screen.
	 *
	 * @return {boolean} Whether the event occured on the active screen
	 */
	proto.onScreen = function() {
		var active = G.Screen.getActive_();
		return (active && this.target_ == active.getElement_());
	};

	/* Constants */
	var constant = G.Event;

	constant.MOUSEMOVE	= "mousemove";
	constant.MOUSEDOWN	= "mousedown";
	constant.MOUSEUP	= "mouseup";

	constant.MBUT_LEFT		= 0x0001;
	constant.MBUT_RIGHT		= 0x0002;
	constant.MBUT_MIDDLE	= 0x0004;

})();
