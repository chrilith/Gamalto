/*
 * Gamalto.Rect
 * ------------
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
	gamalto.devel.using("Vector2");

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Creates a rectangle shape.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Rect
	 * @augments Gamalto.Shape
	 * @implements {Gamalto.IBox}
	 *
	 * @param  {number} x
	 *         Horizontal position of the top left corner of the rectangle.
	 * @param  {number} y
	 *         Vertical position of the top left corner of the rectangle.
	 * @param  {number} width
	 *         Horizontal size of the rectangle.
	 * @param  {number} height
	 *         Vertical size of the rectangle.
	 */
	var _Object = G.Rect = function(x, y, width, height) {
		// Origin will be added by the base constructor
		Object.base(this, x, y);
		this.extent = new _Vector2(width, height);
	};

	/** @alias Gamalto.Rect.prototype */
	var proto = _Object.inherits(G.Shape);

	/**
	 * Determines if a rectangle intersects with the current rectangle.
	 *
	 * @param  {Gamalto.IBox} that
	 *	       Rectangle to test.
	 *
	 * @return {boolean} True if the two rectangles intersect.
	 */
	proto.intersects = function(that) {
		return _Object.intersect(this, that);
	};

	/**
	 * Gets the intersecting rectangle if any.
	 *
	 * @param  {Gamalto.IBox} that
	 *	       Rectangle to intersect.
	 *
	 * @return {Gamalto.Rect} Intersecting rectangle or null.
	 */
	proto.getIntersecting = function(that) {
		return _Object.getIntersecting(this, that);
	};

	/**
	 * Determines if a rectangle is inscribed in the current rectangle.
	 *
	 * @param  {Gamalto.IBox} that
	 *	       Rectangle to test.
	 *
	 * @return {boolean} True if the two rectangles intersect.
	 */
	proto.containts = function(that) {
		var tLx = that.origin.x;
		var tLy = that.origin.y;
		var bRx = tLx + that.extent.x - 1;
		var bRy = tLy + that.extent.y - 1;

		return (this.pointInShape(tLx, tLy) &&
				this.pointInShape(bRx, bRy));
	};

	/**
	 * Determines if an object is equal to the current object.
	 *
	 * @param  {Gamalto.IBox} that
	 *         Object to test.
	 *
	 * @return {boolean} True if the two objects are equal.
	 */
	proto.equals = function(that) {
		return (this.origin_.x == that.origin.x &&
				this.origin_.y == that.origin.y &&
				this.extent_.x == that.extent.x &&
				this.extent_.y == that.extent.y);
	};

	/**
	 * Translates the shape by the vector.
	 *
	 * @param  {Gamalto.IPoint} vec
	 *         Vector to use for the translation.
	 */
	proto.translate = function(vec) {
		_Object.base.translate.call(this, vec);
		this.vertices_[0] = this.origin_;

		// Prevent recomputation of normals
		this.setVertices_();
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
		var tL = this.origin_;
		var bR = this.vertices_[2];

		return (x >= tL.x &&
				x <= bR.x &&
				y >= tL.y &&
				y <= bR.y);
	};

	/**
	 * Gets the bounding box of the shape.
	 *
	 * @return {Gamalto.Box} Bounding box of the shape.
	 */
	proto.toBox = function() {
		return new G.Box(origin.x, origin.y, extent.x, extent.y);
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Rect} Copy of the object.
	 */
	proto.clone = function() {
		var origin = this.origin_;
		var extent = this.extent;

		return new _Object(origin.x, origin.y, extent.x, extent.y);
	};

	/**
	 * Determines if two rectangles intersect.
	 *
	 * @function intersect
	 * @memberof Gamalto.Rect
	 * @static
	 *
	 * @param  {Gamalto.IBox} r1
	 *         First rectangle to test.
	 * @param  {Gamalto.IBox} r2
	 *         Second rectangle to test.
	 *
	 * @return {boolean} True if the two rectangles intersect.
	 */
	_Object.intersect = function(r1, r2) {
		var r1tL  = r1.origin;
		var r1bRx = r1tL.x + r1.extent.x - 1;
		var r1bRy = r1tL.y + r1.extent.y - 1;

		var r2tL  = r2.origin;
		var r2bRx = r2tL.x + r2.extent.x - 1;
		var r2bRy = r2tL.y + r2.extent.y - 1;

		return !(	r1tL.x > r2bRx  ||
					r1bRx  < r2tL.x ||
					r1tL.y > r2bRy  ||
					r1bRy  < r2tL.y);
	};

	/**
	 * Gets the intersecting rectangle if any.
	 *
	 * @function getIntersecting
	 * @memberof Gamalto.Rect
	 * @static
	 *
	 * @param  {Gamalto.IBox} r1
	 *         First rectangle to intersect.
	 * @param  {Gamalto.IBox} r2
	 *         Second rectangle to intersect.
	 *
	 * @return {Gamalto.Rect} Intersecting rectangle or null.
	 */
	_Object.getIntersecting = function(r1, r2) {
		var r1tL  = r1.origin;
		var r1bRx = r1tL.x + r1.extent.x - 1;
		var r1bRy = r1tL.y + r1.extent.y - 1;

		var r2tL  = r2.origin;
		var r2bRx = r2tL.x + r2.extent.x - 1;
		var r2bRy = r2tL.y + r2.extent.y - 1;

		return !_Object.intersects(r1, r2) ? null :
			new _Object(
				new _Vector2(
					(r1tL.x > r2tL.x ? r1tL.x : r2tL.x),
					(r1tL.y > r2tL.y ? r1tL.y : r2tL.y)),
				new _Vector2(
					(r1bRx  < r2bRx  ? r1bRx  : r2bRx),
					(r1bRy  < r2bRy  ? r1bRy  : r2bRy))
			);
	};

})();
