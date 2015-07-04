/*
 * Gamalto.Transform
 * -----------------
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
	 * Transformation information object.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Transform
	 * @augments Gamalto.Object
	 */
	var _Object = G.Transform = function() {
		this.reset();
	};

	/** @alias Gamalto.Transform.prototype */
	var proto = _Object.inherits(G.Object);

	proto.copy = function(transform) {
		this.flipX = transform.flipX;
		this.flipY = transform.flipY;
		this.alpha = transform.alpha;
	};

	proto.save = function() {
		this.state_ = this.clone();
	};

	proto.restore = function() {
		this.state_ = this.copy(this.state_);
	};

	proto.reset = function() {
		this.flipX = false;
		this.flipY = false;
		this.alpha = 1;
	};

	proto.clone = function() {
		var clone = new _Object();
		clone.copy(this);
		return clone;
	};

})();
