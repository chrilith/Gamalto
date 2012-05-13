/*
 * Gamalto.ScrollingRegion
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
	G.using("Rect");
	G.using("Surface");
	G.using("Timer");
	G.using("Vector");

	/**
	 * @constructor
	 */
	G.ScrollingRegion = function(x, y, width, height, loop) {
		this._bounds = new G.Rect(0, 0, 0, 0);
		this._prev = new G.Vector(0, 0);
		this._curr = new G.Vector(0, 0);
		this._speed = new G.Vector(0, 0);
	
		this.setBounds(x, y, width, height);
		this.setLoop(loop);
	};
	
	/* Shortcut */
	var proto = G.ScrollingRegion.inherits(G.Object);
	
	/* Instance methods */
	proto.setLoop = function(isOn) {
		this._loop = !!isOn;
	}
	
	proto.setBounds = function(x, y, width, height) {
		var r = this._bounds;	
		r.tL.x = x;
		r.tL.y = y;
		r.bR.x = x + width - 1;
		r.bR.y = y + height - 1;
		this._allocBuffer();
	}
	
	proto.setSpeed = function(tx, ty) {
		var s = this._speed;
		s.x = tx;
		s.y = ty;
	}
	
	proto.reset = function() {
		var p = this._prev,
			c = this._curr;
		p.x = 0;
		p.y = 0;
		c.x = 0;
		c.y = 0;
	}
	
	// To be overloaded to add acceleration....
	proto.getDisplacement = function(timer, dx, dy) {
		var s = this._speed;
		return new G.Vector(s.x * dx, s.y * dy);	
	}
	
	proto._update = function(timer, dx, dy) {
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
	}
	
	// TODO: alloc buffer only is setLoop(true), else free the buffer if any
	// or if alhpa channel?
	// Double buffer seems to be always faster...
	proto._allocBuffer = function() {
		var b = this._bounds.getSize();
		if (!(b.width && b.height)) {
			this._buffer = null;
		} else {
			if (this._buffer) {
				this._buffer.setDimensions(b.width, b.height);
			} else {
				this._buffer = new G.Surface(b.width, b.height);
			}
		}
	}

})();
