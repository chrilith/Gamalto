/*
 * Gamalto Extensions to Standard Objects
 * --------------------------------------
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

	/* Extra Math methods */

	/**
	 * Extensions to the Math native object. 
	 * @namespace Math
	 */

	/**
	 * Gets the sign of a number.
	 *
	 * @kind function
	 * @name sign
	 * @memberof Math
	 *
	 * @param  {number} n
	 *         Number to test.
	 *
	 * @return {number} 0 if the value is zero, -1 if negative, +1 if positive
	 *                  or NaN if the value is not a number.
	 */
	Object.defineMethod(Math, "sign", function(n) {
		n = Number(n);

		if (n === 0 || isNaN(n)) {
			return n;
		}

		return n > 0 ? 1 : -1;
	});

	/* Faster versions */

	/**
	 * Faster version of the original Math.abs() method which returns the absolute value of a number.
	 *
	 * @kind function
	 * @name fabs
	 * @memberof Math
	 *
	 * @param  {number} n
	 *         A number.
	 *
	 * @return {number} The absolute value of the number.
	 */
	Object.defineMethod(Math, "fabs", function(n) {
		return n > 0 ? n : -n;
	});

	/**
	 * Determines the smallest number of the two parameters.
	 *
	 * @kind function
	 * @name fmin
	 * @memberof Math
	 *
	 * @param  {number} x
	 *         Number to compare.
	 * @param  {number} y
	 *         Another number to compare.
	 *
	 * @return {number} The smallest number.
	 */
	Object.defineMethod(Math, "fmin", function(x, y) {
		return x < y ? x : y;
	});

	/**
	 * Determines the largest number of the two parameters.
	 *
	 * @kind function
	 * @name fmax
	 * @memberof Math
	 *
	 * @param  {number} x
	 *         Number to compare.
	 * @param  {number} y
	 *         Another number to compare.
	 *
	 * @return {number} The largest number.
	 */
	Object.defineMethod(Math, "fmax", function(x, y) {
		return x > y ? x : y;
	});

})();
