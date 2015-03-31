/*
 * Gamalto.ScrollingRegion
 * -----------------------
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
	gamalto.devel.using("Canvas2D");
	gamalto.devel.using("Box");

	/**
	 * @constructor
	 */
	var _Object = G.ScrollingRegion = function(x, y, width, height, loop) {
		this._prev = new _Vector2(0, 0);
		this._curr = new _Vector2(0, 0);
		this._speed = new _Vector2(0, 0);
	
		this._setBounds(x, y, width, height);
		this.setLoop(loop);
	},
	_Vector2 = G.Vector2,
	
	/* Shortcut */
	proto = _Object.inherits(G.Object);
	
	/* Instance methods */
	proto.setLoop = function(isOn) {
		this._loop = !!isOn;
	};
	
	proto._setBounds = function(x, y, width, height) {
		this._bounds = new G.Box(x, y, width, height);
		// TODO: alloc buffer only if setLoop(true), else free the buffer if any
		// or if alhpa channel?
		// Double buffer seems to be always faster...
		this._buffer = new G.Canvas2D(width, height);
	};
	
	proto.setSpeed = function(px, py) {
		var s = this._speed;
		s.x = px / 1000;
		s.y = py / 1000;
	};

	proto.reset = function() {
		var p = this._prev,
			c = this._curr;
		p.x = 0;
		p.y = 0;
		c.x = 0;
		c.y = 0;
	};
	
	// To be overloaded to add acceleration....
	proto.getDisplacement = function(timer, dx, dy) {
		var s = this._speed;
		return new _Vector2(s.x * dx, s.y * dy);	
	};
	
	proto.update = function(timer, dx, dy) {
		var o = this,
			p = o._prev,
			c = o._curr,
			d = o.getDisplacement(timer, dx, dy),
			t = timer.elapsedTime;
	
		c.x = t * d.x;	// Step
		c.y = t * d.y;
	
		p.x += c.x;
		p.y += c.y;
	
		c.x = p.x | 0;	// Round
		c.y = p.y | 0;
	
		p.x -= c.x;
		p.y -= c.y;

		return c;
	};

})();
