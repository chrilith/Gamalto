/*
 * Gamalto.BaseRenderer
 * --------------------
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
	 * Dependencies
	 */
	gamalto.devel.using("Transform");
	gamalto.devel.using("Vector2");

	/**
	 * @constructor
	 */
	var _Object = G.BaseRenderer = function(canvas) {
		this.canvas = canvas;
		this.transform = new G.Transform();
		this.init_();
	};

	/** @alias Gamalto.BaseRenderer.prototype */
	var proto = _Object.inherits(G.Object);

	/* Instance methods */
	proto.init_ = function() {
		this.reset();
	};

	proto.reset = function() {
		this.transform.reset();
	};

	proto.setTransform = function(isOn) {
		var old = this.trans_;
		this.trans_ = Boolean(isOn);
		return old;
	};

	/* Used only when altering the canvas content */
	Object.defineProperty(proto, "context", {
		get: function() {
			return this.canvas.context;
		}
	});

})();
