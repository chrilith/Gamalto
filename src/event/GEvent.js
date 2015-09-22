/*
 * Gamalto.Event
 * -------------
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

	/**
	 * Abstract event object.
	 *
	 * @abstract
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Event
	 * @augments Gamalto.Object
	 *
	 * @param {string} type
	 *        Event name.
	 */
	var _Object = G.Event = function(type) {
		/**
		 * Event type.
		 *
		 * @readonly
		 *
		 * @memebr {string}
		 * @alias Gamalto.Event#type
		 */
		this.type = type;

		/**
		 * Event time.
		 *
		 * @readonly
		 *
		 * @member {mumber}
		 * @alias Gamalto.Event#time
		 */
		this.time = Date.now();

		/**
		 * Bitmask holding modifiers (KMOD_*) state.
		 *
		 * @readonly
		 *
		 * @member {mumber}
		 * @alias Gamalto.Event#modifiers
		 */
		this.modifiers = 0;
	};

	/** @alias Gamalto.Event.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Determines if an object is equal to the current object.
	 *
	 * @param  {Gamalto.Event} that
	 *         Object to test.
	 *
	 * @return {boolean} True if the two objects are equal.
	 */
	proto.equals = function(that) {
		return (this.type == that.type);
	};

	/* Constants */
	_Object.KMOD_NONE		= 0x0000;
	_Object.KMOD_SHIFT		= 0x0001;	// | 0x0002
	_Object.KMOD_CTRL		= 0x0004;	// | 0x0008
	_Object.KMOD_ALT		= 0x0010;	// | 0x0020
	_Object.KMOD_META		= 0x0040;	// | 0x0080

})();
