/*
 * Gamalto.Path
 * ------------
 * 

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 *
 */

(function() {

	gamalto.devel.require("Shape");

	/**
	 * @constructor
	 */
	var _Object = G.Path = function(x, y, points) {
		Object.base(this, x, y);
		this.distances_ = [];

		points = (points || []).slice();
		points.unshift(this.origin_.clone());
		this.vertices_ = points;
		this.compute_();
	},

	/* Inheritance and shortcut */
	proto = _Object.inherits(G.Shape);

	proto.compute_ = function() {
		var dist,
			vertices = this.vertices_;
		this.distances_.length = this.length = 0;

		vertices.forEach(function(vertex, i) {
			if (i === 0) {
				return;
			}
			this.length += (dist = vertex.getDistance(vertices[i-1]));
			this.distances_.push(dist);
		}, this);
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

	proto.pointInShape = function(x, y) {
		var i, a, b, p1, p2,
			tolerance = 0.0001;
			vertices = this.vertices_;

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
