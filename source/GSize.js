/*
 * Gamalto.Size
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

	/**
	 * Creates a simple size object from the specified dimensions.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Size
	 * @augments Gamalto.Object
	 * 
	 * @param {number} width
	 *     Horizontal component of the size object.
	 * 
	 * @param {number} height
	 *     Vertical component of the size object.
	 *
	 * @example
	 * // Getting an object instance
	 * var size = new Gamalto.Size(320, 240);
	 */
	G.Size = function(width, height) {
		/**
		 * Horizontal component of the size object.
		 * @member {number}
		 */
		this.width = +width || 0;

		/**
		 * Vertical component of the size object.
		 * @member {number}
		 */
		this.height = +height || 0;
	},

	/** @alias Gamalto.Size.prototype */
	proto = G.Size.inherits(G.Object);

	/**
	 * Tests whether the object has width and height of 0.
	 * @return {boolean}
	 */
	proto.isEmpty = function() {
		return this.width === 0 && this.height === 0
	};

})();