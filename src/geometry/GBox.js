/*
 * Gamalto.Box
 * -----------
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

	/* Dependencies */
	gamalto.devel.require("Vector2");

	/**
	 * Creates a simple box object.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Box
	 * @augments Gamalto.Object
	 * @implements {Gamalto.IBox}
	 */
	var _Object = G.Box = function(x, y, width, height) {
		this.origin = new _Vector2(x, y);
		this.extent = new _Vector2(width, height);
	},
	_Vector2 = G.Vector2,
	
	/* Inheritance and shortcut */
	proto = _Object.inherits(G.Object);

	proto.equals = function(b2) {
		var b1 = this;
		return (b1.origin.x == b2.origin.x &&
				b1.origin.y == b2.origin.y &&
				b1.extent.x == b2.extent.x &&
				b1.extent.y == b2.extent.y);
	};

	proto.clone = function() {
		return new _Object(this.origin.x, this.origin.y, this.extent.x, this.extent.y);
	};


	/**
	 * Defines a simple box object.
	 * 
	 * @memberof Gamalto
	 * @interface IBox
	 */

	/**
	 * Gets or sets the top left corner of the box.
	 *
	 * @member {Gamalto.Vector2} Gamalto.IBox#origin
	 */

	/**
	 * Gets or sets the box extent.
	 *
	 * @member {Gamalto.Vector2} Gamalto.IBox#extent
	 */

})();
