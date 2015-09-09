/*
 * Gamalto.Color
 * -------------
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
	 * Creates a RGBA color object.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Color
	 * @augments Gamalto.Object
	 *
	 * @param {number} [r]
	 *        Red component of the color.
	 * @param {number} [g]
	 *        Green component of the color.
	 * @param {number} [b]
	 *        Blue component of the color.
	 * @param {number} [a]
	 *        Alpha component of the color.
	 */
	var _Object = G.Color = function(r, g, b, a) {
		var undef;

		/**
		 * Gets or sets the red component of the color.
		 *
		 * @member {number}
		 * @alias Gamalto.Color#r
		 */
		this.r = Math.fmin(Math.fmax(Number(r) | 0, 0), 255);
		/**
		 * Gets or sets the green component of the color.
		 *
		 * @member {number}
		 * @alias Gamalto.Color#g
		 */
		this.g = Math.fmin(Math.fmax(Number(g) | 0, 0), 255);
		/**
		 * Gets or sets the blue component of the color.
		 *
		 * @member {number}
		 * @alias Gamalto.Color#b
		 */
		this.b = Math.fmin(Math.fmax(Number(b) | 0, 0), 255);
		/**
		 * Gets or sets the alpha component of the color.
		 *
		 * @member {number}
		 * @alias Gamalto.Color#a
		 */
		this.a = Math.fmin(Math.fmax((a === undef) ? 255 : (Number(a) | 0), 0), 255);
	};

	/** @alias Gamalto.Color.prototype */
	var proto = _Object.inherits(G.Object);

	/* Instance methods */
	proto.__toCanvasStyle = function() {
		return "rgba("	+	this.r + "," +
							this.g + "," +
							this.b + "," +
						(this.a / 255) + ")";
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Color} Copy of the object.
	 */
	proto.clone = function() {
		return new _Object(this.r, this.g, this.b, this.a);
	};

	/**
	 * Alpha-blends two colors.
	 *
	 * @function blend
	 * @memberof Gamalto.Color
	 * @static
	 *
	 * @param  {Gamalto.Color} c1
	 *         Source color.
	 * @param  {Gamalto.Color} c2
	 *         Destination color.
	 * @param  {number} factor
	 *         Blending factor. A value of 1 means 100% of the destination color.
	 *
	 * @return {Gamalto.Color} Resulting color.
	 */
	_Object.blend = function(c1, c2, factor) {
		var f1 = 1 - factor;
		var r = c1.r * f1 + c2.r * factor;
		var g = c1.g * f1 + c2.g * factor;
		var b = c1.b * f1 + c2.b * factor;
		var a = c1.a * f1 + c2.a * factor;

		return new _Object(r, g, b, a);
	};

})();
