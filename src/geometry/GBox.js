/*
 * Gamalto.Box
 * -----------
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
	gamalto.devel.require("Vector2");

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Creates a lightweight box object.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Box
	 * @augments Gamalto.Object
	 * @implements {Gamalto.IBox}
	 *
	 * @param  {number} x
	 *         Horizontal position of the top left corner of the box.
	 * @param  {number} y
	 *         Vertical position of the top left corner of the box.
	 * @param  {number} width
	 *         Horizontal size of the box.
	 * @param  {number} height
	 *         Vertical size of the box.
	 */
	var _Object = G.Box = function(x, y, width, height) {
		this.origin = new _Vector2(x, y);
		this.extent = new _Vector2(width, height);
	};

	/** @alias Gamalto.Box.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Determines if an object is equal to the current object.
	 *
	 * @param  {Gamalto.IBox} that
	 *         Object to test.
	 *
	 * @return {boolean} True if the two objects are equal.
	 */
	proto.equals = function(that) {
		return (that.origin.x == this.origin.x &&
				that.origin.y == this.origin.y &&
				that.extent.x == this.extent.x &&
				that.extent.y == this.extent.y);
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Box} Copy of the object.
	 */
	proto.clone = function() {
		return new _Object(
			this.origin.x, this.origin.y,
			this.extent.x, this.extent.y);
	};

	/**
	 * Defines a simple box object.
	 *
	 * @memberof Gamalto
	 * @interface IBox
	 */

	/**
	 * Gets or sets the top left corner of the box.
	 *
	 * @member {Gamalto.IPoint} Gamalto.IBox#origin
	 */

	/**
	 * Gets or sets the box extent.
	 *
	 * @member {Gamalto.IPoint} Gamalto.IBox#extent
	 */

})();
