/*
 * Gamalto.Size
 * ------------
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
	 * Creates a simple size object from the specified dimensions.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Size
	 * @augments Gamalto.Object
	 * 
	 * @param  {number} width
	 *         Horizontal component of the size object.
	 * 
	 * @param  {number} height
	 *         Vertical component of the size object.
	 *
	 * @example
	 * // Getting an object instance
	 * var size = new Gamalto.Size(320, 240);
	 */
	var _Object = G.Size = function(width, height) {
		/**
		 * Horizontal component of the size object.
		 * @member {number}
		 */
		this.width = Number(width) || 0;

		/**
		 * Vertical component of the size object.
		 * @member {number}
		 */
		this.height = Number(height) || 0;
	},

	/** @alias Gamalto.Size.prototype */
	proto = _Object.inherits(G.Object);

	/**
	 * Tests whether the object has width and height of 0.
	 * 
	 * @return {boolean}
	 */
	proto.isEmpty = function() {
		return this.width === 0 && this.height === 0;
	};

})();
