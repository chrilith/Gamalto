/*
 * Gamalto.Palette
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
	G.using("Color");
	G.using("Timer");

	/**
	 * @constructor
	 */
	G.Palette = function(colors) {
		this._list = colors || [];
		this._animators = [];
		this._animated = [];
		this.length = 0;
	}

	/* Inheritance */
	var proto = G.Palette.inherits(G.Object);
	
	/* Instance methods */
	proto.addColor = function(color) {
		this._list.push(color);
		this.length++;
	}

	proto.setColor = function(index, color) {
		if (index < this.length) {
			this._list[index] = color;
		}
	}

	proto.getColor = function(index) {
		return this._list[index];
	}

	proto.addAnimator = function(from, to, delay) {
		var step = from < to ? +1 : -1,
			iter = (to - from) * step;

		this._animators.push({
			speed	 : 1 / delay,
			step	 : step,
			from	 : from,
			to		 : to,
			curr	 : 0
		});

		// Cache cycling color indices
		do {
			this._animated[from] = true;
			from += step;
		} while(iter--);
	}
	
	proto.isAnimated = function(index) {
		return this._animated[index];
	}

	proto.update = function(timer) {
		var n, r, anim = this._animators, changed;

		for (var n = 0; n < anim.length; n++) {

			// Compute number of required iterations based on elapsed time
			if ((r = (anim[n].curr += timer.elapsedTime * anim[n].speed) | 0)) {
				changed = r;
				anim[n].curr -= r; // Save fractional part
				while (r--) { this.swap(n); }

			}
		}
		// Whether the palette has been updated
		return !!changed;
	}

	proto.swap = function(index) {
			var anim = this._animators[index],
				list = this._list,
				step = anim.step,
				from = anim.from,
				to	 = anim.to,
				col	 = list[from];
				i	 = 0,

		len = (anim.to - anim.from) * step;
		while (i < len) {
			var n = from + i * step;
			list[n] = list[n + step];
			i++;
		}
		list[to] = col;		
	}
	
})();
