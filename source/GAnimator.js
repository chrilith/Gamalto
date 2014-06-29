/*
 * Gamalto.Animator
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012-2014 Chris Apers and The Gamalto Project, all rights reserved.

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
	 * Base object to create time-based multiframe animation objects. It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Animator
	 * @augments Gamalto.Object
	 */
	var _Object = G.Animator = function() {
		Object.base(this);
		this.reset();
	};

	/* Inheritance and shortcut */

	/** @alias Gamalto.Animator.prototype */
	var proto = G.Animator.inherits(G.Object);

	/* Instance methods */

	/**
	 * Resets the animation.
	 */
	proto.reset = function() {
		/**
		 * Position in the duration array.
		 * @member {number}
		 */
		this.progress = 0;
		/**
		 * Whether the animation is playing.
		 * @member {boolean}
		 */
		this.playing = false;
		/**
		 * The fractional time of the last iteration.
		 * @private
		 * @member {number}
		 */
		this._lastTime = 0;
	};

	/**
	 * Updates the animator state.
	 *
	 * @protected
	 * @param {Gamalto.Timer} timer
	 *     The {@linkcode Gamalto.Timer} object from which the elpased time will be read.
	 * @param {boolean} loop
	 *     Whether to loop the animation.
	 * @param {Number[]} duration
	 *     A list of durations to handle frames time.
	 * @returns {boolean} The playing state.
	 */
	proto._update = function(timer, loop, duration) {
		var // Where do we start
			index = this.progress | 0,
			length = duration.length,
			// Elapsted time to consider
			time = (this._lastTime += timer.elapsedTime);

		// Nothing to animate
		if (length <= 1 && !duration[0]) {
			return false;
		}

		// Handle playing state
		if (!this.playing) {
			// animation seems to have ended
			if (this.progress == length - 1) {
				return false;
			}
			this.playing = true;
		}

		// Starting at 'index'
		while (index < length) {
			var iter = duration[index] | 0;

			// Does the elapsed time fits the current duration
			if (time < iter) {
				break;
			}
			// No, remove the curent duration and move to the next one
			this._lastTime = (time -= iter);

			// Reached the end? should we loop?
			if (++index == length && loop) {
				index = 0;
			}
		};
		// Save progression and check for ended animation
		if ((this.progress = index) == length && !loop) {
			this.progress = --length; // faster (length - 1)???
			this.playing = false;
		}
		// TODO: this.progress + lastTime / duration pour la partie fractionnelle
		return this.playing;
	};

	/**
	 * Creates a clone of the current object.
	 * @returns {Gamalto.Animator} A deep copy of the object.
	 */
	proto.clone = function() {
		var clone = new _Object();

		clone.progress = this.progress;
		clone.playing = this.playing;

		return clone;
	};

})();
