/*
 * Gamalto.Rect
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

For production software, the copyright notice only is required. You must also
display a splash screen showing the Gamalto logo in your game of other software
made using this middleware.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 *
 */

(function() {

	/* Dependencies */
	gamalto.dev.require("Shape");
	gamalto.dev.using("Size");
	gamalto.dev.using("Vector2");

	/**
	 * @constructor
	 */
	var _Object = G.Rect = function(x, y, width, height) {
		var bottomRight = new _Vector2(x + width - 1, y + height - 1),
			points = [
				// Origin will be added by the base constructor
				new _Vector2(bottomRight.x, y),
				bottomRight,
				new _Vector2(x, bottomRight.y)
			];
		Object.base(this, x, y, points);
		this.extent_ = new _Vector2(width, height);
	},
	_Vector2 = G.Vector2,
	
	/* Inheritance and shortcut */
	proto = _Object.inherits(G.Polygon);
	
	/* Instance methods */
	proto.intersects = function(r2) {
		var r1 = _Object.getBox_(this);
			r2 = _Object.getBox_(r2);

		return !(
				 r1.tL.x > r2.bR.x ||
				 r1.bR.x < r2.tL.x ||
				 r1.tL.y > r2.bR.y ||
				 r1.bR.y < r2.tL.y);
	};
	
	proto.getIntersecting = function(r2) {
		var r1 = _Object.getBox_(this);
			r2 = _Object.getBox_(r2);

		return !r1.intersects(r2) ? null :	
			new _Object(
				new _Vector2(
					(r1.tL.x > r2.tL.x ? r1.tL.x : r2.tL.x),
					(r1.tL.y > r2.tL.y ? r1.tL.y : r2.tL.y)),
				new _Vector2(
					(r1.bR.x < r2.bR.x ? r1.bR.x : r2.bR.x),
					(r1.bR.y < r2.bR.y ? r1.bR.y : r2.bR.y))
			);
	};
	
	proto.containts = function(r2) {
		return (this.vectorInShape(r2.origin_) &&
				this.vectorInShape(r2.vertices_[2]));
	};

	proto.equals = function(r2) {
		var r1 = this;
		return (r1.origin_.x == r2.origin_.x &&
				r1.origin_.y == r2.origin_.y &&
				r1.extent_.x == r2.extent_.x &&
				r1.extent_.y == r2.extent_.y);
	};

	proto.offset = function(vec) {
		_Object.base.offset.call(this, vec);
		var bR = this.vertices_[2];
		this.extent_.x = bR.x - this.origin_.x + 1;
		this.extent_.y = bR.y - this.origin_.y + 1;
	};

	proto.clone = function() {
		var origin = this.origin_,
			extent = this.extent_;
		return new _Object(origin.x, origin.y, extent.x, extent.y);
	};

	proto.pointInShape = function(x, y) {
		var tL = this.origin_,
			bR = this.vertices_[2];

		return (x >= tL.x &&
				x <= bR.x &&
				y >= tL.y &&
				y <= bR.y);
	};

	proto.toBox = function() {
		new G.Box(origin.x, origin.y, extent.x, extent.y);
	};

	proto.getBoundingBox = proto.clone;

	Object.defineProperties(proto, {
		"extent": {
			get: function() {
				return this.extent_;
			},
			set: function(value) {
				var vertices = this.vertices_,
					tL = this.origin_;

				vertices[1].x = tL.x + value.x - 1;
				vertices[2].x = vertices[1].x;
				vertices[2].y = tL.y + value.y - 1;
				vertices[3].x = tL.x;
				vertices[3].y = vertices[2].y;

				this.extent_ = value;
				this.compute_();
			}
		},
		"vertices": {
			get: function() {
				return this.vertices_;
			}
		}
	});

	_Object.getBox_ = function(r) {
		return { tL: r.origin_, bR: r.vertices_[2] };
	};

})();
