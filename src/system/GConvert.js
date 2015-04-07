/*
 * Gamalto.Convert
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
	 * Helper object to convert numbers.
	 *
	 * @namespace
	 * @memberof Gamalto
	 * @augments Gamalto.Object
	 *
	 * @alias Gamalto.Convert
	 */
	var _Object = G.Convert = new G.Object();
	
	/**
	 * Converts a number to an equivalent 8-bit unsigned integer.
	 *
	 * @static
	 * 
	 * @param  {number} value
	 *         Number to be converted.
	 * 
	 * @return {number} Unsgined integer.
	 */
	_Object.toUint8 = function(value) {
		return value & 0xff;
	};

	/**
	 * Converts a number to an equivalent 8-bit signed integer.
	 * 
	 * @static
	 * 
	 * @param  {number} value
	 *         Number to be converted.
	 * 
	 * @return {number} Signed integer.
	 */
	_Object.toInt8 = function(value) {
		return value << 24 >> 24;
	};

	/**
	 * Converts a number to an equivalent 16-bit unsigned integer.
	 * 
	 * @static
	 * 
	 * @param  {number} value
	 *         Number to be converted.
	 * 
	 * @return {number} Unsgined integer.
	 */
	_Object.toUint16 = function(value) {
		return value & 0xffff;
	};

	/**
	 * Converts a number to an equivalent 16-bit signed integer.
	 * 
	 * @static
	 * 
	 * @param  {number} value
	 *         Number to be converted.
	 * 
	 * @return {number} Signed integer.
	 */
	_Object.toInt16 = function(value) {
		return value << 16 >> 16;
	};

	/**
	 * Converts a number to an equivalent 32-bit unsigned integer.
	 * 
	 * @static
	 * 
	 * @param  {number} value
	 *         Number to be converted.
	 * 
	 * @return {number} Unsgined integer.
	 */
	_Object.toUint32 = function(value) {
		return value >>> 0;
	};

	/**
	 * Converts a number to an equivalent 32-bit signed integer.
	 * 
	 * @static
	 * 
	 * @param  {number} value
	 *         Number to be converted.
	 * 
	 * @return {number} Signed integer.
	 */
	_Object.toInt32 = function(value) {
		return value | 0;
	};

})();
