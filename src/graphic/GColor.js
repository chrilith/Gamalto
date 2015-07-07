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
	 * @constructor
	 */
	var _Object = G.Color = function(r, g, b, a) {
		var undef;
		this.r = Math.fmin(Math.fmax(r | 0, 0), 255);
		this.g = Math.fmin(Math.fmax(g | 0, 0), 255);
		this.b = Math.fmin(Math.fmax(b | 0, 0), 255);
		this.a = Math.fmin(Math.fmax((a === undef) ? 255 : (a | 0), 0), 255);
	};

	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.Object);

	/* Instance methods */
	proto.__toCanvasStyle = function() {
		return "rgba("	+	this.r + "," +
							this.g + "," +
							this.b + "," +
						(this.a / 255) + ")";
	};

	proto.clone = function() {
		return new _Object(this.r, this.g, this.b, this.a);
	};

	_Object.blend = function(c1, c2, t) {
		var t1 = 1 - t;
		var r = c1.r * t1 + c2.r * t;
		var g = c1.g * t1 + c2.g * t;
		var b = c1.b * t1 + c2.b * t;
		var a = c1.a * t1 + c2.a * t;

		return new _Object(r, g, b, a);
	};

	_Object.BLACK	= new _Object(0, 0, 0);
	_Object.GREY	= new _Object(128, 128, 128);
	_Object.WHITE	= new _Object(255, 255, 255);

})();
