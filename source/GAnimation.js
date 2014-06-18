/*
 * Gamalto.Animation
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
	/* Shortcut */
	var core = gamalto;

	/* Dependencies */
	gamalto.require_("SpriteSheet");
	gamalto.using_("Rect");
	gamalto.using_("Timer");

	/**
	 * @constructor
	 */
	var _Object = G.Animation = function(sheet) {
		this.sheet = sheet;

		this._list = [];
		this._offs = [];
		this._time = [];
		this.length = 0;

		Object.base(this);
		this.setLoop(true);
	}

	/* Inheritance and shortcut */
	var proto = G.Animation.inherits(G.Animator);

	proto.useSectionsRange = function(start, length) {
		this.length += length;
		while (length--) {
			this._list.push(start++);
			this._time.push(0);
		}
		return this;
	}

	proto.useSections = function(list) {
		var arr = this._list,
			len = list.length;

		this.length += len;
		arr.push.apply(arr, list);
		while (len--) {
			this._time.push(0);
		}
		return this;
	}

	proto.getSection = function(frame) {
		return this.sheet.getSection(this._list[frame]);
	}

	proto.setDuration = function(time) {
		var len = this.length,
			slice = time / len;
		while (len--) {
			this._time[len] = slice;
		}
		return this;
	}

	proto.setFrameDuration = function(frame, time) {
		gamalto.assert_(frame < this._list.length);
		this._time[frame] = time;
		return this;
	}

	proto.setFrameOffset = function(frame, x, y) {
		gamalto.assert_(frame < this._list.length);
		this._offs[frame] = new G.Vector(x, y);
		return this;
	}

	proto.getFrameOffset = function(frame) {
		return this._offs[frame] || G.Vector.ZERO;
	}

	proto.duplicateFrame = function(index, dest) {
		gamalto.assert_(dest <= this._list.length);

		var copy = this._list[index],
			offs = this._offs[index],
			time = this._time[index];

		this._list.splice(dest, 0, copy);
		this._offs.splice(dest, 0, offs);
		this._time.splice(dest, 0, time);

		return this;
	}

	proto.setLoop = function(isOn) {
		this._loop = !!isOn;
		return this;
	}

	proto.getLoop = function() {
		return this._loop;
	}

	proto.update = function(timer) {
		return _Object.base
			.update.call(this, timer, this._loop, this._time);
	}

	proto.draw = function(renderer, x, y, frame) {
		frame = core.defined(frame, this.progress, 0) | 0;

		var offs = this._offs[frame],
			invX = renderer.getFlipX() ? -1 : +1,
			invY = renderer.getFlipY() ? -1 : +1;
		if (offs) {
			x += offs.x * invX | 0;
			y += offs.y * invY | 0;
		}
		this.sheet.draw(renderer, x, y, this._list[frame]);
		return frame;
	}

	proto.clone = function() {
		var clone = new _Object(this.sheet);
		clone._list = this._list.slice();
		clone._offs = this._offs.slice();
		clone._time = this._time.slice();
		_Object.base.clone.call(this);
	}

})();
