/*
 * Gamalto.TiledAnimation
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
	gamalto.using("TiledBlock");
	gamalto.using("Timer");

	/**
	 * @constructor
	 */
	G.TiledAnimation = function() {
		this._list = [];
		this.setDuration(0);
		this.length = 0;
	}
	
	var proto = G.TiledAnimation.inherits(G.Object);
	
	proto.add = function(block) {
		this._list.push(block);
		this.length = this._list.length;
		this.setDuration(this._duration);
	}
	
	proto.setDuration = function(time) {
		this._duration = time;	// Save it to recalculate when needed
		this._speed = (1 / (time / this.length)) || 0;
	}
	
	proto.update = function(timer, frame) {
		var u, o = this,
			l = o.length;
	
		frame = G.getDef(frame, o._curr) || 0;
		if ((frame += timer.elapsedTime * o._speed) >= l) {
			frame -= l;
		}
	
		// Do not round to keep the fractionnal part to stay in sync
		return (o._curr = frame); 
	}
	
	proto.draw = function(renderer, x, y, i) {
		i = G.getDef(i, this._curr) || 0;
		this._list[i].draw(renderer, x, y);
	}

})();
