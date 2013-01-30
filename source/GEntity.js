/*
 * Gamalto.Entity
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2011-2013 Chris Apers and The Gamalto Project, all rights reserved.

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
	G.Entity = function() {
		this.position = new G.Vector(0, 0);
		this._options = {};
		this._active = null;
	}
	
	/* Inheritance and shortcut */
	var proto = G.Entity.inherits(G.Object);
	
	// useful for ennemies duplication
	proto.clone = function() {
		var clone = new G.Entity(),
			name, options = this._options;
	
		for(name in options) {
			if (G.isName(name)) {
				clone._options[name] = {
					anim : to.anim,
					prev : to.prev.clone(),
					curr : to.prev.clone(),
					speed: to.speed.clone(),
					frame: to.frame
				}
			}
		}
		clone._active = this._active;
		clone.position = this.position.clone();
	}
	
	proto.addAnimation = function(name, anim, speed) {
		this._options[G.N(name)] = {
			anim : anim,
			prev : new G.Vector(0, 0),
			curr : new G.Vector(0, 0),
			speed: new G.Vector(0, 0),
			frame: 0
		};
	}
	
	// Displacement speed for the given animation
	proto.setSpeed = function(name, px, py) {
		var o = this._options[G.N(name)];
		o.speed.x = px / 1000;
		o.speed.y = py / 1000;
	}
	
	proto.reset = function(name) {
		var o = this._options[G.N(name)],
			p = o._prev,
			c = o._curr;
		p.x = 0;
		p.y = 0;
		c.x = 0;
		c.y = 0;
	}
	
	proto.setActive = function(name) {
		if (name != this._active) {
			var v = this._options[G.N(name)].prev;
			v.x = 0;
			v.y = 0;
			this._active = name;
		}
	}
	
	proto.setPosition = function(x, y) {
		var p = this.position;
		p.x = x;
		p.y = y;
		this.reset(this._active);
	}
	
	proto.moveBy = function(dx, dy) {
		var p = this.position;
		this.setPosition(p.x + dx, p.y + dy);
	}
	
	// To overload to add acceleration....
	proto.getDisplacement = function(timer, dx, dy) {
		var s = this._options[G.N(this._active)].speed;
		return new G.Vector(s.x * dx, s.y * dy);	
	}
	
	proto.update = function(timer, dx, dy) {
		var o = a._options[G.N(this._active)],
			p = o.prev,
			c = o.curr,
			d = this.getDisplacement(timer, dx, dy),
			t = timer.elapsedTime,
			position = this.position;
	
		c.x = t * d.x,	// Step
		c.y = t * d.y;
	
		p.x += cx;
		p.y += cy;
	
		c.x = p.x | 0;	// Round
		c.y = p.y | 0;
	
		p.x -= cx;
		p.y -= cy;
	
		position.x += c.x;	// Move
		position.y += c.y;
		
		// Always calculate the next frame to stay in sync
		o.frame = o.anim.update(timer, o.frame);
	
		return c;
	}
	
	proto.draw = function(renderer, x, y, i) {
		var o = a._options[G.N(this._active)],
			p = this.position;
	
		if (!isNaN(x) && !isNaN(y)) {
			// In that case, reset the current position
			this.setPosition(x, y);
		}

		o.anim.draw(renderer, p.x, p.y, G.defined(i, o.frame) );
	}

})();
