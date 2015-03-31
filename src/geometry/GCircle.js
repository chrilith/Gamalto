/*
 * Gamalto.Circle
 * --------------
 * 

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 *
 */

(function() {

	gamalto.devel.require("Shape");
	gamalto.devel.using("Rect");
	gamalto.devel.using("Vector2");

	/**
	 * Defines a circle shape.
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
		/**
		 * Origin of the circle.
		 * @member {Gamalto.Vector2}
		 */
		Object.base(this, x, y);
		/**
		 * Radius of the circle.
		 * @member {number}
		 */
		this.radius = radius;
	},

	/** @alias Gamalto.Circle.prototype */
	proto = _Object.inherits(G.Shape);

	proto.intersects = function(c2) {
		var c1 = this,
			o  = c2.origin,
			r  = c1.radius + c2.radius;
		return this.intersect_(o.x, o.y, r);
	};

	proto.equals = function(c2) {
		var c1 = this;
		return (c1.origin.equals(c2.origin) &&
				c1.radius == c2.radius);
	};

	proto.clone = function() {
		return new _Object(this.origin.x, this.origin.y, this.radius);
	};

	proto.pointInShape = function(x, y) {
		return this.intersect_(x, y, this.radius);
	};
	
	proto.intersect_ = function(x, y, r) {
		var c  = this,
			o  = c.origin,
			cx = (x - o.x),
			cy = (y - o.y);

		return (cx * cx + cy * cy <= r * r);
	};
	
	proto.getBoundingBox = function() {
		var radius = this.radius;
		return new G.Rect(
			this.origin.x - radius,
			this.origin.y - radius,
			radius + radius,
			radius + radius
		);
	};
	
})();
