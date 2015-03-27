/*
 * Gamalto.Color
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
	 * @constructor
	 */
	G.Color = function(r, g, b, a) {
		var u;	// = undefined
	
		this.r = Math.fmin(Math.fmax(r || 0, 0), 255);
		this.g = Math.fmin(Math.fmax(g || 0, 0), 255);
		this.b = Math.fmin(Math.fmax(b || 0, 0), 255);
		this.a = Math.fmin(Math.fmax((a === u) ? 255 : (a || 0), 0), 255);
	}

	/* Inheritance and shortcut */
	var proto = G.Color.inherits(G.Object);

	/* Instance methods */
	proto.__toCanvasStyle = function() {
		return "rgba("	+  this.r + ","
						+  this.g + ","
						+  this.b + ","
						+ (this.a / 255) + ")";
	}

	var constant = G.Color;

	constant.BLACK	= new G.Color(0, 0, 0);
	constant.GREY	= new G.Color(128, 128, 128);
	constant.WHITE	= new G.Color(255, 255, 255);
})();
