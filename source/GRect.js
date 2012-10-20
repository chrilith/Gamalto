/*
 * Gamalto.Rect
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
	G.require	("Shape");
	G.using		("Size");
	G.using		("Vector");

	/**
	 * @constructor
	 */
	G.Rect = function(x, y, width, height) {
		this._setRect(x, y, width, height);
	
		Object.defineProperty(this, "width", {
			get: function() { return (this.bR.x - this.tL.x + 1); },
			enumerable: true
		});
	
		Object.defineProperty(this, "height", {
			get: function() { return (this.bR.y - this.tL.y + 1); },
			enumerable: true
		});
	}
	
	/* Inheritance and shortcut */
	var proto = G.Rect.inherits(G.Shape);
	
	/* Instance methods */
	proto._setRect = function(x, y, width, height) {
		var u, // = undefined
			r = this;
	
		if (width === u && height === u) {
			r.tL = x.clone();
			r.bR = y.clone();
		} else {
			r.tL = new G.Vector(x, y);
			r.bR = new G.Vector(x + width - 1, y + height - 1);
		}
	}
	
	proto.getSize = function() {
		var r = this;
		return new G.Size(
			r.bR.x - r.tL.x + 1,
			r.bR.y - r.tL.y + 1);
	}
	
	proto.intersects = function(r2) {
		var r1 = this;
		return !(
				 r1.tL.x > r2.bR.x ||
				 r1.bR.x < r2.tL.x ||
				 r1.tL.y > r2.bR.y ||
				 r1.bR.y < r2.tL.y);
	}
	
	proto.intersecting = function(r2) {
		var r1 = this;
		return !r1.intersects(r2) ? null :	
			new G.Rect(
				new G.Vector(
					(r1.tL.x > r2.tL.x ? r1.tL.x : r2.tL.x),
					(r1.tL.y > r2.tL.y ? r1.tL.y : r2.tL.y)),
				new G.Vector(
					(r1.bR.x < r2.bR.x ? r1.bR.x : r2.bR.x),
					(r1.bR.y < r2.bR.y ? r1.bR.y : r2.bR.y))
			);
	}
	
	proto.containts = function(r2) {
		return (this.vectorInShape(r2.tL) &&
				this.vectorInShape(r2.bR));
	}
	
	proto.equals = function(r2) {
		var r1 = this;
		return (r1.tL.x == r2.tL.x &&
				r1.tL.y == r2.tL.y &&
				r1.bR.x == r2.bR.x &&
				r1.bR.y == r2.bR.y);
	}
	
	proto.offset = function(x, y) {
		return new G.Rect(
			this.tL.add(x, y),
			this.bR.add(x, y)
		);
	}
	
	proto.clone = function() {
		return new G.Rect(this.tL, this.bR);
	}

	proto.pointInShape = function(x, y) {
		var r = this;
		return (x >= r.tL.x &&
				x <= r.bR.x &&
				y >= r.tL.y &&
				y <= r.bR.y);
	}
	
	proto.getBoundingBox = function() {
		return this.clone();
	}

})();
