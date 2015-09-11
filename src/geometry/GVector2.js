/*
 * Gamalto.Vector2
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

	/**
	 * @memberof Gamalto
	 * @constructor Gamalto.Vector2
	 * @augments Gamalto.Object
	 * @implements {Gamalto.IPoint}
	 */
	var _Object = G.Vector2 = function(x, y) {
		this.set(x, y);
	};

	var pool = [];

	var proto = _Object.inherits(G.Object);

	_Object.create = function(x, y) {
		var vec = pool.pop();
		if (vec) { vec.set(x, y); }
		return vec || new _Object(x, y);
	};

	/* Instance methods */

	proto.set = function(x, y) {
		this.x = Number(x) || 0;
		this.y = Number(y) || 0;
	};

	proto.recycle = function() {
		pool.push(this);
	};

	proto.equals = function(vec) {
		return _Object.equals(this, vec);
	};

	proto.isZero = function() {
		return (this.x === 0 && this.y === 0);
	};

	proto.getLength = function() {
		var x = this.x;
		var y = this.y;
		return Math.sqrt(x * x + y * y);
	};

	proto.getAngle = function() {
		return (2.0 * Math.atan2(this.y + this.getLength(), this.x));
	};

	proto.getDistance = function(from) {
		return _Object.distance(from, this);
	};

	proto.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};

	proto.substract = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	};

	proto.multiply = function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	};

	proto.divide = function(v) {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	};

	proto.addFloat = function(num) {
		this.x += num;
		this.y += num;
		return this;
	};

	proto.substractFloat = function(num) {
		this.x -= num;
		this.y -= num;
		return this;
	};

	proto.multiplyFloat = function(num) {
		this.x *= num;
		this.y *= num;
		return this;
	};

	proto.divideFloat = function(num) {
		this.x /= num;
		this.y /= num;
		return this;
	};

	proto.normalize = function() {
		var length = this.getLength();
		if (length === 0) {
			return this;
		}
		return this.divideFloat(length);
	};

	proto.clone = function() {
		return new _Object(this.x, this.y);
	};

	_Object.equals = function(p1, p2) {
		return (p1.x === p2.x) && (p1.y === p2.y);
	};

	_Object.add = function(v1, v2) {
		return new _Object(v1.x + v2.x, v1.y + v2.y);
	};

	_Object.substract = function(v1, v2) {
		return new _Object(v1.x - v2.x, v1.y - v2.y);
	};

	_Object.multiply = function(v1, v2) {
		return new _Object(v1.x * v2.x, v1.y * v2.y);
	};

	_Object.divide = function(v1, v2) {
		return new _Object(v1.x / v2.x, v1.y / v2.y);
	};

	_Object.addFloat = function(v, num) {
		return new _Object(v.x + num, v.y + num);
	};

	_Object.substractFloat = function(v, num) {
		return new _Object(v.x - num, v.y - num);
	};

	_Object.multiplyFloat = function(v, num) {
		return new _Object(v.x * num, v.y * num);
	};

	_Object.divideFloat = function(v, num) {
		return new _Object(v.x / num, v.y / num);
	};

	_Object.lerp = function(v1, v2, t) {
		var t1 = 1 - t;
		var x = v1.x * t1 + v2.x * t;
		var y = v1.y * t1 + v2.y * t;

		return new _Object(x, y);
	};

	_Object.dot = function(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	};

	_Object.distance = function(from, to) {
		var x = (from.x - to.x);
		var y = (from.y - to.y);
		return Math.sqrt(x * x + y * y);
	};

	_Object.hermite = function(v1, t1, v2, t2, amount) {
		var s2 = amount * amount;	// For amount^2
		var s3 = amount * s2;		// For amount^3

		var h0 =  2 * s3 - 3 * s2 + 1;
		var h1 =      s3 - 2 * s2 + amount;
		var h2 = -2 * s3 + 3 * s2;
		var h3 =      s3 -     s2;

		return       _Object.multiplyFloat(v1, h0)
				.add(_Object.multiplyFloat(t1, h1))
				.add(_Object.multiplyFloat(v2, h2))
				.add(_Object.multiplyFloat(t2, h3));
	};

	_Object.catmullRom = function(v1, v2, v3, v4, amount) {
		/* With:
			i  = start point
			v1 = i - 1
			v2 = i - 0
			v3 = i + 1
			v4 = i + 2
		*/
		var t1 = _Object.substract(v3, v1).multiply(0.5);
		var t2 = _Object.substract(v4, v2).multiply(0.5);
		var p1 = v2;
		var p2 = v3;

		return _Object.hermite(p1, t1, p2, t2, amount);
	};

	_Object.zero = function() {
		return new _Object(0, 0);
	};

	_Object.ZERO = _Object.zero();

	/**
	 * Defines a simple point with read only components.
	 *
	 * @memberof Gamalto
	 * @interface IPoint
	 */

	/**
	 * Gets the horizontal component.
	 *
	 * @readonly
	 *
	 * @member {number} Gamalto.IPoint#x
	 */

	/**
	 * Gets the vertical component.
	 *
	 * @readonly
	 *
	 * @member {number} Gamalto.IPoint#y
	 */

})();
