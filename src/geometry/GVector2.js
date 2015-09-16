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
	 * Creates a a vector with two components.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Vector2
	 * @augments Gamalto.Object
	 * @implements {Gamalto.IPoint}
	 *
	 * @param {number} x
	 *        X component of the vector.
	 * @param {number} y
	 *        Y component of the vector.
	 */
	var _Object = G.Vector2 = function(x, y) {
		/**
		 * X component of the vector.
		 *
		 * @member {number}
		 * @alias Gamalto.Vector2#x
		 */
		this.x = Number(x) || 0;
		/**
		 * Y component of the vector.
		 *
		 * @member {number}
		 * @alias Gamalto.Vector2#y
		 */
		this.y = Number(y) || 0;
	};

	/** @alias Gamalto.Vector2.prototype */
	var proto = _Object.inherits(G.Object);


	/**
	 * Determines if a vector is equal to the current vector.
	 *
	 * @param  {Gamalto.Vector2} that
	 *         Object to test.
	 *
	 * @return {boolean} True if the two vectors are equal.
	 */
	proto.equals = function(that) {
		return _Object.equals(this, that);
	};

	/**
	 * Determines if a vector is a zero vector.
	 *
	 * @return {boolean}
	 */
	proto.isZero = function() {
		return (this.x === 0 && this.y === 0);
	};

	/**
	 * Gets the length of the vector.
	 *
	 * @return {number}
	 */
	proto.getLength = function() {
		var x = this.x;
		var y = this.y;
		return Math.sqrt(x * x + y * y);
	};

	/**
	 * Calculates the distance from the specified vector.
	 *
	 * @param  {Gamalto.Vector2} from
	 *         Source vector.
	 *
	 * @return {number} Distance between the two vectors.
	 */
	proto.getDistance = function(from) {
		return _Object.getDistance(from, this);
	};

	/**
	 * Adds a vector to the current vector.
	 *
	 * @param {Gamalto.Vector2} vec
	 *        Vector to add.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.add = function(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	};

	/**
	 * Substracts a vector from the current vector.
	 *
	 * @param {Gamalto.Vector2} vec
	 *        Vector to substract.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.sub = function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	};

	/**
	 * Multiplies a vector by the current vector.
	 *
	 * @param {Gamalto.Vector2} vec
	 *        Vector to multiply.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.mul = function(vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		return this;
	};

	/**
	 * Divides the current vector by a vector.
	 *
	 * @param {Gamalto.Vector2} vec
	 *        Divisor vector.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.div = function(vec) {
		this.x /= vec.x;
		this.y /= vec.y;
		return this;
	};

	/**
	 * Adds a scalar value to the current vector.
	 *
	 * @param {number} num
	 *        Scalar value.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.addNum = function(num) {
		this.x += num;
		this.y += num;
		return this;
	};

	/**
	 * Substracts a scalar value from the current vector.
	 *
	 * @param {number} num
	 *        Vector to substract.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.subNum = function(num) {
		this.x -= num;
		this.y -= num;
		return this;
	};

	/**
	 * Multiplies the current vector by a scalar value.
	 *
	 * @param {number} num
	 *        Scalar factor.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.mulNum = function(num) {
		this.x *= num;
		this.y *= num;
		return this;
	};

	/**
	 * Divides the current vector by a scalar value.
	 *
	 * @param {number} num
	 *        Scalar divisor.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.divNum = function(num) {
		this.x /= num;
		this.y /= num;
		return this;
	};

	/**
	 * Turns the current vector into a unit vector.
	 * The result is a vector one unit in length pointing
	 * in the same direction as the original vector.
	 *
	 * @return {Gamalto.Vector2} Current vector.
	 */
	proto.normalize = function() {
		var length = this.getLength();
		if (length === 0) {
			return this;
		}
		return this.divNum(length);
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Vector2} Copy of the object.
	 */
	proto.clone = function() {
		return new _Object(this.x, this.y);
	};

	/**
	 * Determines if two vectors are equal.
	 *
	 * @function equal
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Vector to test.
	 * @param  {Gamalto.IPoint} p2
	 *         Vector to test.
	 *
	 * @return {boolean} True if the two vectors are equal.
	 */
	_Object.equal = function(p1, p2) {
		return (p1.x === p2.x) && (p1.y === p2.y);
	};

	/**
	 * Calculates the distance between two vectors.
	 *
	 * @function getDistance
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} from
	 *         Source vector.
	 * @param  {Gamalto.IPoint} to
	 *         Source vector.
	 *
	 * @return {number} Distance between the two vectors.
	 */
	_Object.getDistance = function(from, to) {
		var x = (from.x - to.x);
		var y = (from.y - to.y);
		return Math.sqrt(x * x + y * y);
	};

	/**
	 * Adds two vectors.
	 *
	 * @function add
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Source vector.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.add = function(p1, p2) {
		return new _Object(p1.x + p2.x, p1.y + p2.y);
	};

	/**
	 * Substracts two vectors.
	 *
	 * @function sub
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Source vector.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.sub = function(p1, p2) {
		return new _Object(p1.x - p2.x, p1.y - p2.y);
	};

	/**
	 * Multiplies two vectors.
	 *
	 * @function mul
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Source vector.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.mul = function(p1, p2) {
		return new _Object(p1.x * p2.x, p1.y * p2.y);
	};

	/**
	 * Divides two vectors.
	 *
	 * @function div
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Divisor vector.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.div = function(p1, p2) {
		return new _Object(p1.x / p2.x, p1.y / p2.y);
	};

	/**
	 * Adds a scalar value to a vector.
	 *
	 * @function addNum
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} pt
	 *         Source vector.
	 * @param  {number} num
	 *         Scalar value.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.addNum = function(pt, num) {
		return new _Object(pt.x + num, pt.y + num);
	};

	/**
	 * Substracts a scalar value from a vector.
	 *
	 * @function subNum
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} pt
	 *         Source vector.
	 * @param  {number} num
	 *         Scalar value.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.subNum = function(pt, num) {
		return new _Object(pt.x - num, pt.y - num);
	};

	/**
	 * Multiplies a vector by a scalar value.
	 *
	 * @function mulNum
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} pt
	 *         Source vector.
	 * @param  {number} num
	 *         Scalar factor.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.mulNum = function(pt, num) {
		return new _Object(pt.x * num, pt.y * num);
	};

	/**
	 * Divides a vector by a scalar value.
	 *
	 * @function divNum
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} pt
	 *         Source vector.
	 * @param  {number} num
	 *         Scalar divisor.
	 *
	 * @return {Gamalto.Vector2} Resulting vector.
	 */
	_Object.divNum = function(pt, num) {
		return new _Object(pt.x / num, pt.y / num);
	};

	/**
	 * Calculates the dot product of two vectors. If the two vectors
	 * are unit vectors, the dot product returns a floating point value
	 * between -1 and 1 that can be used to determine some properties of
	 * the angle between two vectors. For example, it can show whether
	 * the vectors are orthogonal, parallel, or have an acute or
	 * obtuse angle between them.
	 *
	 * @function dot
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Source vector.
	 *
	 * @return {number} Dot product of the two vectors.
	 */
	_Object.dot = function(p1, p2) {
		return p1.x * p2.x + p1.y * p2.y;
	};

	/**
	 * Performs a linear interpolation between two vectors.
	 *
	 * @function lerp
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Source vector.
	 * @param  {number} amount
	 *         Value between 0 and 1 indicating the weight of the second vector.
	 *
	 * @return {Gamalto.Vector2} Linear interpolation of the two vectors.
	 */
	_Object.lerp = function(p1, p2, amount) {
		var t1 = 1 - amount;
		var x = p1.x * t1 + p2.x * amount;
		var y = p1.y * t1 + p2.y * amount;

		return new _Object(x, y);
	};

	/**
	 * Performs a Hermite spline interpolation.
	 *
	 * @function hermite
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @see {@link http://www.cubic.org/docs/hermite.htm|Cubic Team & $eeN website}
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         Source position vector.
	 * @param  {Gamalto.IPoint} t1
	 *         Source tangent vector.
	 * @param  {Gamalto.IPoint} p2
	 *         Source position vector.
	 * @param  {Gamalto.IPoint} t2
	 *         Source tangent vector.
	 * @param  {number} amount
	 *         Weighting factor.
	 *
	 * @return {Gamalto.Vector2} Result of the interpolation.
	 */
	_Object.hermite = function(v1, t1, v2, t2, amount) {
		var s2 = amount * amount;	// For amount^2
		var s3 = amount * s2;		// For amount^3

		// Calculate basis functions
		var h0 =  2 * s3 - 3 * s2 + 1;
		var h1 =      s3 - 2 * s2 + amount;
		var h2 = -2 * s3 + 3 * s2;
		var h3 =      s3 -     s2;

		return _Object.mulNum(p1, h0)
				.add(_Object.mulNum(t1, h1))
				.add(_Object.mulNum(p2, h2))
				.add(_Object.mulNum(t2, h3));
	};

	/**
	 * Performs a Catmull-Rom interpolation.
	 *
	 * @function catmullRom
	 * @memberof Gamalto.Vector2
	 * @static
	 *
	 * @see {@link http://www.cubic.org/docs/hermite.htm|Cubic Team & $eeN website}
	 *
	 * @param  {Gamalto.IPoint} p1
	 *         First position in the interpolation.
	 * @param  {Gamalto.IPoint} p2
	 *         Second position in the interpolation.
	 * @param  {Gamalto.IPoint} p3
	 *         Third position in the interpolation.
	 * @param  {Gamalto.IPoint} p4
	 *         Fourth position in the interpolation.
	 * @param  {number} amount
	 *         Weighting factor.
	 *
	 * @return {Gamalto.Vector2} Result of the interpolation.
	 */
	_Object.catmullRom = function(p1, p2, p3, p4, amount) {
		/* Tangent calculation:
			Ti = a * (P(i+1) - P(i-1))

		   For:
			p1 = i-1
			p2 = i-0
			p3 = i+1
			p4 = i+2
		*/
		var t1 = _Object.sub(p3, p1).mulNum(0.5);
		var t2 = _Object.sub(p4, p2).mulNum(0.5);

		return _Object.hermite(p2, t1, p3, t2, amount);
	};

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
