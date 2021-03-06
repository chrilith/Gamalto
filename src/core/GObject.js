/*
 * Gamalto.Object
 * --------------
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
	 * Base object of all Gamalto objects.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Object
	 */
	G.Object = function() {
		/**
		 * Utility property to exchange data between objects.
		 * 
		 * @member {object}
		 * @alias Gamalto.Object#tag
		 */
		this.tag = undefined;
	};
	
	/** @alias Gamalto.Object.prototype */
	var proto = G.Object.prototype;

	/**
	 * Converts the object into a string.
	 * 
	 * @virtual
	 * 
	 * @return {string}
	 */
	proto.toString = function() {
		return "[Gamalto Object]";
	};

	/**
	 * Clones the object. It will be shallow copy unless otherwise specfied.
	 * 
	 * @virtual
	 * 
	 * @return {object} New instance of the object. Defaults to null.
	 */
	proto.clone = function() {
		return null;
	};

})();
