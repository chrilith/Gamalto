/*
 * Gamalto.Animator
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012-2013 Chris Apers and The Gamalto Project, all rights reserved.

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
	// ...

	/**
	 * @constructor
	 */
	G.Animator = function() {
		this.reset();
	}

	/* Inheritance and shortcut */
	var proto = G.Animator.inherits(G.Object);

	/* Instance methods */
	proto.reset = function() {
		this.progress = 0;
		this.playing = false;
		this._lastTime = 0;
	}

	proto.update = function(timer, loop, duration) {
		var // Where do we start
			pos = this.progress,
			index = pos | 0,
			length = duration.length,
			// Elpasted time to consider
			time = (this._lastTime += timer.elapsedTime);

		// Nothing to animate
		if (length <= 1 && !duration[0]) {
			return false;
		}

		// Handle playing state
		if (!this.playing && this.progress < length) {
			this.playing = true;
		}

		// Starting at 'index'
		while (index < length) {
			var iter = duration[index] | 0;

			// Does the elapsed time fits the current duration
			if (time < iter) {
				break;
			}
			// No, remove the curent duration move to the next 
			this._lastTime = (time -= iter);

			// Reached the end? should we loop?
			if (++index == length && loop) {
				index = 0;
			}
		};
		// Save progression and check for end
		if ((this.progress = index) == length && !loop) {
			this.playing = false;
		}
		// TODO: this.progress + lastTime / duration pour la partie fractionnelle
		return this.playing;
	}

	proto.clone = function() {
		var clone = new G.Animator();

		clone.progress = this.progress;
		clone.playing = this.playing;

		return clone;
	}

})();
