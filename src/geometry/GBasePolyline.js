/*
 * Gamalto.Polyline
 * ----------------
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
	gamalto.devel.require("Vector2");

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Abstract object to create a line-based shape.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BasePolyline
	 * @augments Gamalto.Shape
	 *
	 * @param  {number} x
	 *         Horizontal position of the shape origin.
	 * @param  {number} y
	 *         Vertical position of the shape origin.
	 * @param  {array.<Gamalto.IPoint>} points
	 *         List of path points excluding the origin.
	 */
	var _Object = G.BasePolyline = function(x, y, points) {
		Object.base(this, x, y);

		points = (points || []).slice();
		points.unshift(this.origin_);

		/**
		 * Whether the object needs recomputation.
		 *
		 * @protected
		 * @ignore
		 *
		 * @member {boolean}
		 */
		this.dirty_ = true;

		/**
		 * Internal array of path points.
		 *
		 * @protected
		 * @ignore
		 *
		 * @type {array.<Gamalto.IPoint>}
		 */
		this.vertices_ = points;
	};

	/** @alias Gamalto.BasePolyline.prototype */
	var proto = _Object.inherits(G.Shape);

	/**
	 * Determines if an object is equal to the current object.
	 *
	 * @param  {Gamalto.Path} that
	 *         Object to test.
	 *
	 * @return {boolean} True if the two objects are equal.
	 */
	proto.equals = function(that) {
		var vertices = this.vertices_;
		var compares = that.vertices_;

		// Quick check
		if (compares.length != vertices.length) {
			return false;
		}

		// Point after point...
		for (var i = 0; i < vertices.length; i++) {
			if (!_Vector2.equal(vertices[i], compares[i])) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Translates the shape by the vector.
	 *
	 * @param  {Gamalto.IPoint} vec
	 *         Vector to use for the translation.
	 */
	proto.translate = function(vec) {
		var vertices = this.vertices_;

		// For origin
		_Object.base.translate.call(this, vec);
		vertices[0] = this.origin_;

		// Now all vertices...
		vertices.forEach(function(vertex, i) {
			// The first element is the origin, it has already been translated
			if (i > 0) { vertices[i] = _Vector2.add(vertex, vec); }
		});

		// No need to set it dirty for now (normals, distances)
	};

	/**
	 * Gets the bounding box of the shape.
	 *
	 * @return {Gamalto.Box} Bounding box of the shape.
	 */
	proto.toBox = function() {
		var x1, y1, x2, y2;
		var origin = this.origin_;

		x1 = x2 = origin.x;
		y1 = y2 = origin.y;

		this.vertices_.forEach(function(vertex) {
			x1 = Math.fmin(x1, vertex.x);
			y1 = Math.fmin(y1, vertex.y);
			x2 = Math.fmax(x2, vertex.x);
			y2 = Math.fmax(y2, vertex.y);
		});

		return new G.Box(x1, y1, (x2 - x1 + 1), (y2 - y1 + 1));
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Path} Deep copy of the object.
	 */
	proto.clone = function() {
		var points = [];

		this.vertices_.forEach(function(vertex, i) {
			// Ignore the origin which will be added by the constructor
			if (i > 0) { points.push(vertex.clone()); }
		});

		return new this.constructor(this.origin_.x, this.origin_.y, points);
	};

	Object.defineProperties(proto, {
		/**
		 * Gets of sets the vertices of the shape.
		 *
		 * @memberof Gamalto.Path.prototype
		 * @member {array.<Gamalto.IPoint>} vertices
		 */
		"vertices": {
			get: function() {
				return this.vertices_;
			},
			set: function(value) {
				if (value.length === 0) {
					this.vertices_ = [this.origin_];
				} else {
					this.vertices_ = value;

					// Reset the origin based on the new list of vectors
					this.origin_ = value[0];
				}
				this.dirty_ = true;
			}
		}
	});

})();
