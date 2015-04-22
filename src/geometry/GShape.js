/*
 * Gamalto.Shape
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

	gamalto.devel.require("Vector2");

	/**
	 * @memberof Gamalto
	 * @constructor Gamalto.Shape
	 * @augments Gamalto.Object
	 */
	G.Shape = function(x, y){
		this.origin_ = new G.Vector2(x, y);
	},
	_Vector2 = G.Vector2,

	proto = G.Shape.inherits(G.Object);

	proto.vectorInShape = function(v) {
		return this.pointInShape(v.x, v.y);
	}

	proto.compute_ = function() { };

	proto.offset = function(vec) {
		this.origin_.add(vec);
	};

	Object.defineProperty(proto, "origin", {
		get: function() {
			return this.origin_;
		},
		set: function(value) {
			var vec = _Vector2.substract(value, this.origin_);
			this.offset(vec);
		}
	});
	
})();
