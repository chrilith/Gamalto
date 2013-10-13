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
		Object.base(this, bitmap, tw, th, count, r);
		this._speed = 0;
		this._offs = [];
		this.setLoop(true);
		this.reset();
	}

	/* Inheritance and shortcut */
	var proto = G.Animation.inherits(G.SpriteSheet);

	proto.setDuration = function(time) {
		this._speed = 1 / (time / this.length);
	}

	proto.setOffset = function(frame, x, y) {
		this._offs[frame] = new G.Vector(x, y);
	}

	proto.setLoop = function(isOn) {
		this._loop = !!isOn;
	}

	proto.duplicateFrame = function(index, dest) {
		var copy = this.getSection(index).clone(),
			offs = this._offs[index];
		this.insertSection(dest, copy);
		this._offs[dest] = offs;
	}

	proto.update = function(timer, frame) {
		var length = this.length;

		// INternal or external frame counter
		frame = core.defined(frame, this.frame, 0);

		// Handle playing state
		if (!this.playing && frame < length) {
			this.playing = true;
		}

		// Loop or end
		if ((frame += timer.elapsedTime * this._speed) >= length) {
			if (this._loop) {
				frame -= length;
			} else {
				frame = length - 1;
				this.playing = false;
			}
		}

		// Do not round to keep the fractionnal part to stay in sync
		return (this.frame = frame);
	}

	proto.reset = function() {
		this.playing = false;
		this.frame = 0;
	}

	proto.draw = function(renderer, x, y, frame) {
		frame = core.defined(frame, this.frame, 0);
		var offs = this._offs[frame | 0],
			invX = renderer.getFlipX() ? -1 : +1,
			invY = renderer.getFlipY() ? -1 : +1;
		if (offs) {
			x += offs.x * invX | 0;
			y += offs.y * invY | 0;
		}
		G.Animation.base.draw.call(this, renderer, x, y, frame);
	}

})();
