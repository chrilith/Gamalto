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
	var _Object = G.Palette = function(colors, transparent) {
		this._list = colors || [];
		this._animators = [];
		this._changed = false;	// Whether the palette has been changed, should be in the parent object??
		this._trans = -1;
		this.length = this._list.length;
	};

	/* Inheritance */
	var proto = _Object.inherits(G.Object);

	/* Instance methods */
	proto.addColor = function(color) {
		this._list.push(color);
		this.length++;
	};

	proto.setColor = function(index, color) {
		if (index < this.length) {
			this._list[index] = color;
			this._changed = true;
		}
	};

	proto.getColor = function(index) {
		return this._list[index];
	};

	proto.setTransparency = function(index) {
		if (index < this.length) {
			if (this._trans != -1) { this._list[this._trans].a = 255; }
			this._list[index].a = 0;
			this._trans = index;
			this._changed = true;
		}
	};

	proto.getTransparency = function(index) {
		return this._trans;
	};

	proto.addAnimator = function(from, to, delay) {
		var step = from < to ? 1 : -1;

		this._animators.push({
			speed:	1 / delay,
			step:	step,
			from:	from,
			to:		to,
			curr:	0
		});
	};

	proto.update = function(timer) {
		var n, r, changed;
		var anim = this._animators;

		for (n = 0; n < anim.length; n++) {

			// Compute number of required iterations based on elapsed time
			if ((r = (anim[n].curr += timer.elapsedTime * anim[n].speed) | 0)) {
				changed = true;
				anim[n].curr -= r; // Save fractional part
				this.cycle_(n, r);

			}
		}

		// Whether the palette has been updated
		return Boolean(changed);
	};

	proto.cycle_ = function(index, shift) {
		// Quite faster that using array methods...
		while (shift-- > 0) {
			this.swap_(index);
		}
	};

	proto.swap_ = function(index) {
		var anim = this._animators[index];
		var list = this._list;
		var step = anim.step;
		var from = anim.from;
		var to = anim.to;
		var col	= list[from];

		len = (to - from) * step;
		while (len--) {
			list[from] = list[(from += step)];
		}
		list[to] = col;
	};

})();
