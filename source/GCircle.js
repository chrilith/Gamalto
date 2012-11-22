/*
 * Gamalto.Circle
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

	/* Dependencies */
	gamalto.require("Shape");
	gamalto.using("Vector");

	/**
	 * @constructor
	 */
	G.Circle = function(p1, p2, radius) {
		var u, // undefined
			c = this;

		if (radius === u) {
			c.origin = p1.clone();
			c.radius = p2;			
		} else {
			c.origin = new G.Vector(p1, p2);
			c.radius = radius;
		}
	}

	/* Inheritance and shortcut */
	var proto = G.Circle.inherits(G.Shape);

	proto.intersects = function(c2) {
		var c1 = this,
			o  = c2.origin,
			r  = c1.radius + c2.radius;
		return this._compute(o.x, o.y, r);
	}

	proto.equals = function(c2) {
		var c1 = this;
		return (c1.origin.equals(c2.origin) &&
				c1.radius == c2.radius);
	}

	proto.clone = function() {
		return new G.Circle(this.origin, this.radius);
	}

	proto.pointInShape = function(x, y) {
		return this._compute(x, y, this.radius);
	}
	
	proto._compute = function(x, y, r) {
		var c  = this,
			o  = c.origin,
			cx = (x - o.x),
			cy = (y - o.y);

		return (cx * cx + cy * cy <= r * r);
	}
	
	proto.getBoundingBox = function() {
		return new G.Rect(
			this.origin.x - this.radius,
			this.origin.y - this.radius,
			this.radius * 2,
			this.radius * 2
		);
	}
	
})();
