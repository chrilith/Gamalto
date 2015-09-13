/*
 * Gamalto.Shape
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

	/* Dependencies */
	gamalto.devel.require("Vector2");

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Abstract object to create a geometric shape.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Shape
	 * @augments Gamalto.Object
	 *
	 * @param  {number} x
	 *         Horizontal position of the shape origin.
	 * @param  {number} y
	 *         Vertical position of the shape origin.
	 */
	var _Object = G.Shape = function(x, y) {
		this.origin_ = new _Vector2(x, y);
	};

	/** @alias Gamalto.Shape.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Translates the shape by the vector.
	 *
	 * @virtual
	 *
	 * @param  {Gamalto.IPoint} vec
	 *         Vector to use for the translation.
	 */
	proto.translate = function(vec) {
		this.origin_ = _Vector2.add(this.origin_, vec);
	};

	/**
	 * Gets of sets the origin of the shape.
	 *
	 * @memberof Gamalto.Shape.prototype
	 * @member {Gamalto.IPoint} origin
	 */
	Object.defineProperty(proto, "origin", {
		get: function() {
			return this.origin_;
		},
		set: function(value) {
			// Convenient way to have inheriting object properly updated.
			var vec = _Vector2.sub(value, this.origin_);
			this.translate(vec);
		}
	});

	/**
	 * Abstract method to determine if a point lies inside the shape.
	 *
	 * @function
	 * @name Gamalto.Shape#pointInShape
	 *
	 * @abstract
	 *
	 * @param  {number} x
	 *         Horizontal position of the point to test.
	 * @param  {number} y
	 *         Vertical position of the point to test.
	 *
	 * @return {boolean} True if the point lies inside the shape.
	 */

	/**
	 * Abstract method to get the bounding box of the shape.
	 *
	 * @function
	 * @name Gamalto.Shape#toBox
	 *
	 * @abstract
	 *
	 * @return {Gamalto.Box} Bounding box of the shape.
	 */

})();
