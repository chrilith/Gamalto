/*
 * Gamalto.Circle
 * --------------
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
	gamalto.devel.require("Shape");
	gamalto.devel.using("Box");

	/**
	 * Creates a circle shape.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Circle
	 * @augments Gamalto.Shape
	 *
	 * @param  {number} x
	 *         Horizontal position of the circle center.
	 * @param  {number} y
	 *         Vertical position of the circle center.
	 * @param  {number} radius
	 *         Radius of the circle.
	 *
	 * @example
	 * // Getting an object instance
	 * var circle = new Gamalto.Circle(100, 100, 50);
	 */
	var _Object = G.Circle = function(x, y, radius) {
		Object.base(this, x, y);

		/**
		 * Radius of the circle.
		 * @member {number}
		 */
		this.radius = radius;
	};

	/** @alias Gamalto.Circle.prototype */
	var proto = _Object.inherits(G.Shape);

	/**
	 * Determines if an circle intersects with the current circle.
	 *
	 * @param  {Gamalto.Circle} that
	 *	       Circle to test.
	 *
	 * @return {boolean} True if the two circles intersect.
	 */
	proto.intersects = function(that) {
		var origin = that.origin;
		var radius = this.radius + that.radius;

		return this.intersects_(origin.x, origin.y, radius);
	};

	/**
	 * Determines if a circle is equal to the current circle.
	 *
	 * @param  {Gamalto.Circle} that
	 *         Circle to test.
	 *
	 * @return {boolean} True if the two circles are equal.
	 */
	proto.equals = function(that) {
		return (this.origin.equals(that.origin) &&
				this.radius == that.radius);
	};

	/**
	 * Determines if a point lies inside the shape.
	 *
	 * @param  {number} x
	 *         Horizontal position of the point to test.
	 * @param  {number} y
	 *         Vertical position of the point to test.
	 *
	 * @return {boolean} True if the point lies inside the shape.
	 */
	proto.pointInShape = function(x, y) {
		return this.intersects_(x, y, this.radius);
	};

	/**
	 * Common formula to check point and circle intersection.
	 *
	 * @ignore
	 * @private
	 *
	 * @param  {number} x
	 *         Horizontal position of the point to test.
	 * @param  {number} y
	 *         Vertical position of the point to test.
	 * @param  {number} radius
	 *         Computed radius to test.
	 *
	 * @return {boolean} True if an intersection has been found.
	 */
	proto.intersects_ = function(x, y, radius) {
		var origin = this.origin;
		var cx = (x - origin.x);
		var cy = (y - origin.y);

		return (cx * cx + cy * cy <= radius * radius);
	};

	/**
	 * Gets the bounding box of the shape.
	 *
	 * @return {Gamalto.Box} Bounding box of the shape.
	 */
	proto.toBox = function() {
		var radius = this.radius;

		return new G.Box(
			this.origin.x - radius,
			this.origin.y - radius,
			radius + radius,
			radius + radius
		);
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Circle} Copy of the object.
	 */
	proto.clone = function() {
		return new _Object(this.origin.x, this.origin.y, this.radius);
	};

})();
