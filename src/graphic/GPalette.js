/*
 * Gamalto.Palette
 * ---------------
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
	 * @memberof Gamalto
	 * @constructor Gamalto.Palette
	 * @augments Gamalto.Object
	 */
	G.Palette = function(colors) {
		this._list = colors || [];
		this._animators = [];
		this._animated = [];
		this._changed = false;	// Whether the palette has been changed
		this._trans = -1;
		this.length = this._list.length;
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
			this._changed = true;
		}
	}

	proto.getColor = function(index) {
		return this._list[index];
	}

	proto.setTransparency = function(index) {
		if (index < this.length) {
			if (this._trans != -1) { this._list[this._trans].a = 255; }
			this._list[index].a = 0;
			this._trans = index;
			this._changed = true;
		}
	}

	proto.getTransparency = function(index) {
		return this._trans;
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
