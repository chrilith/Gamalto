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
	G.Animation = function(bitmap, tw, th, count, r) {
		this._offs = [];
		this._time = [];
		Object.base(this, bitmap, tw, th, count, r);
		this.animator = new G.Animator();
		this.setLoop(true);
	}

	/* Inheritance and shortcut */
	var proto = G.Animation.inherits(G.SpriteSheet);

	proto.setFrameDuration = function(frame, time) {
		gamalto.assert_(frame < this._list.length);
		this._time[frame] = time;
	}

	proto.setFrameOffset = function(frame, x, y) {
		gamalto.assert_(frame < this._list.length);
		this._offs[frame] = new G.Vector(x, y);
	}

	proto.duplicateFrame = function(index, dest) {
		var copy = this.getSection(index).clone(),
			offs = this._offs[index],
			time = this._time[index];
		this.insertSection(dest, copy);
		this._offs[dest] = offs;
		this.setFrameDuration(dest, time);
	}

	proto.setLoop = function(isOn) {
		this._loop = !!isOn;
	}

	proto.getLoop = function() {
		return this._loop;
	}

	proto.update = function(timer, animator) {
		return core.defined(animator, this.animator)
					.update(timer, this._loop, this._time);
	}

	proto._createSection = function(x, y, w, h) {
		this._time.push(0);
		return G.Animation.base._createSection.apply(this, arguments);
	}

	proto.draw = function(renderer, x, y, frame) {
		frame = core.defined(frame, this.animator.progress, 0);

		var offs = this._offs[frame | 0],
			invX = renderer.getFlipX() ? -1 : +1,
			invY = renderer.getFlipY() ? -1 : +1;
		if (offs) {
			x += offs.x * invX | 0;
			y += offs.y * invY | 0;
		}
		G.Animation.base.draw.apply(this, arguments);
	}

})();
