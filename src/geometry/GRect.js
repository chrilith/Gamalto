/*
 * Gamalto.Rect
 * ------------
 * 

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 *
 */

(function() {

	/* Dependencies */
	gamalto.devel.require("Shape");
	gamalto.devel.using("Box");
	gamalto.devel.using("Size");
	gamalto.devel.using("Vector2");

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
