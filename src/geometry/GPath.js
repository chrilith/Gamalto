/*
 * Gamalto.Path
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
	gamalto.devel.require("BasePolyline");
	gamalto.devel.require("Vector2");

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Creates a path.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Path
	 * @augments Gamalto.BasePolyline
	 *
	 * @param  {number} x
	 *         Horizontal position of the shape origin.
	 * @param  {number} y
	 *         Vertical position of the shape origin.
	 * @param  {array.<Gamalto.IPoint>} points
	 *         List of path points excluding the origin.
	 */
	var _Object = G.Path = function(x, y, points) {
		/**
		 * Pre-computed distances used in PathAnimator.
		 *
		 * @private
		 *
		 * @member {array.<Gamalto.IPoint>}
		 */
		this.distances_ = [];

		Object.base(this, x, y, points);
	};

	/** @alias Gamalto.Path.prototype */
	var proto = _Object.inherits(G.BasePolyline);

	/**
	 * Computes distances and length.
	 *
	 * @private
	 */
	proto.compute_ = function() {
		var dist;
		var vertices = this.vertices_;

		this.distances_.length = this.length_ = 0;

		vertices.forEach(function(vertex, i) {

			if (i > 0) {
				this.length_ += (dist = _Vector2.distance(vertex, vertices[i - 1]));
				this.distances_.push(dist);
			}

		}, this);
	};

	/**
	 * Determines if a point lies on the path.
	 *
	 * @param  {number} x
	 *         Horizontal position of the point to test.
	 * @param  {number} y
	 *         Vertical position of the point to test.
	 *
	 * @return {boolean} True if the point lies on the path.
	 */
	proto.pointInShape = function(x, y) {
		var i, a, b, p1, p2;
		var tolerance = 0.0001;
		var vertices = this.vertices_;

		for (i = 0; i < vertices.length - 1; i++) {
			v1 = vertices[i];
			v2 = vertices[i + 1];

			// Slope
			a = (v2.y - v1.y) / (v2.x - v1.x);

			// Y-intercept
			b = v1.y - a * v1.x;

			if (Math.fabs(y - a * x + b) < tolerance) {
				if ((x >= v1.x && x <= v2.x) ||
					(x >= v2.x && x <= v1.x)) {

					return true;
				}
			}
		}

		return false;
	};

	Object.defineProperties(proto, {
		/**
		 * Gets the distances between the path points.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.Path.prototype
		 * @member {array.<Gamalto.IPoint>} distances
		 */
		"distances": {
			get: function() {
				if (this.dirty_) {
					this.compute_();
					this.dirty_ = false;
				}
				return this.distances_;
			}
		},

		/**
		 * Length of the path.
		 *
		 * @readonly
		 *
		 * @memberof Gamalto.Path.prototype
		 * @member {number} length
		 */
		"length": {
			get: function() {
				// DRY
				return (this.distances & 0) + this.length_;
			}
		}
	});

})();
