/*
 * Gamalto.Polygon
 * ---------------
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

	gamalto.devel.require("Shape");
	gamalto.devel.require("Vector2");

	var _Object = G.Polygon = function(x, y, points) {
		Object.base(this, x, y);
		this.normals_ = [];

		points = (points || []).slice();
		points.unshift(this.origin_.clone());
		this.vertices_ = points;
		this.compute_();
	},
	_Vector2 = G.Vector2,

	proto = _Object.inherits(G.Shape);

	proto.compute_ = function() {
		// Compute normals
		var vertex2, edge, tmp
			last = this.vertices_.length - 1;
		this.normals_.length = 0;

		this.vertices_.forEach(function(vertex1, i) {
			vertex2 = this.vertices_[i++ === last ? 0 : i];
			edge = _Vector2.substract(vertex2, vertex1);
			tmp = edge.x; edge.x = -edge.y; edge.y = tmp;
			this.normals_.push(edge.normalize());
		}, this);
	};

	proto.equals = function(polygon) {
		var i, vertices = this.vertices_;
		for (i = 0; i < vertices.length; i++) {
			if (!vertices[i].equals(polygon.vertices_[i])) {
				return false;
			}
		}
		return true;
	};

	proto.offset = function(vec) {
		_Object.base.offset.call(this, vec);
		this.vertices_.forEach(function(vertex) {
			vertex.add(vec);
		});
	};

	proto.clone = function() {
		var points = [];
		this.vertices_.forEach(function(vertex, i) {
			// Ignore the origin which will be added by the constructor
			if (i > 0) { points.push(vertex.clone()); }
		});
		return new _Object(this.origin_.x, this.origin_.y, points);
	};

	// @see http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	proto.pointInShape = function(x, y) {
		var i, j,
			vertices = this.vertices_,
			length = vertices.length,
			inside = false;
		
		for (i = 0, j = length - 1; i < length; j = i++) {
			var xi = vertices.x[i],
				yi = vertices.y[i],
				xj = vertices.x[j],
				yj = vertices.y[j];

			if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
				inside = !inside;
			}
		}
		return inside;
	};

	Object.defineProperties(proto, {
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
					this.origin_ = value[0].clone();
				}
				this.compute_();
			}
		}
	});


})();
