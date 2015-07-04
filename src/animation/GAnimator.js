/*
 * Gamalto.Animator
 * ----------------
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
	 * Base object to create time-based multiframe animation objects.
	 * It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Animator
	 * @augments Gamalto.Object
	 */
	var _Object = G.Animator = function() {
		Object.base(this);
		this.reset();
	};

	/** @alias Gamalto.Animator.prototype */
	var proto = _Object.inherits(G.Object);

	/* Instance methods */

	/**
	 * Resets the animation.
	 */
	proto.reset = function() {
		/**
		 * Position in the duration array.
		 *
		 * @member {number}
		 * @readonly
		 * @alias Gamalto.Animator#progress
		 */
		this.progress = 0;
		/**
		 * Whether the animation is playing.
		 *
		 * @member {boolean}
		 * @readonly
		 * @alias Gamalto.Animator#playing
		 */
		this.playing = false;
		/**
		 * The fractional time of the last iteration.
		 *
		 * @private
		 *
		 * @member {number}
		 */
		this.lastTime_ = 0;
	};

	/**
	 * Updates the animator state.
	 *
	 * @protected
	 * @ignore
	 *
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@linkcode Gamalto.ITiming} object from which
	 *         the elpased time will be read.
	 * @param  {boolean} loop
	 *         Whether to loop the animation.
	 * @param  {array.<number>} duration
	 *         List of durations to handle frames time.
	 *
	 * @return {boolean} The playing state.
	 */
	proto.update_ = function(timer, loop, duration) {
		// Where do we start
		var index = this.progress | 0;
		var length = duration.length;

		// Elapsted time to consider
		var time = (this.lastTime_ += timer.elapsedTime);

		// Nothing to animate
		if (length <= 1 && !duration[0]) {
			return false;
		}

		// Handle playing state
		if (!this.playing) {
			// Animation seems to have ended
			if (this.progress == length) {
				return false;
			}
			this.playing = true;
		}

		// Starting at 'index'
		while (index < length) {
			var iter = duration[index];

			// Does the elapsed time fits the current duration
			if (time < iter) {
				break;
			}

			// No, remove the curent duration and move to the next one
			this.lastTime_ = (time -= iter);

			// Reached the end? should we loop?
			if (++index === length && loop) {
				index = 0;
			}
		}

		// Save progression and check for ended animation
		if ((this.progress = index) >= length && !loop) {
			this.progress = length - 1;
			this.playing = false;
		} else {
			this.progress += this.lastTime_ / duration[index];
		}
		return this.playing;
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Animator} Deep copy of the object.
	 */
	proto.clone = function() {
		var clone = new _Object();

		clone.progress = this.progress;
		clone.playing = this.playing;

		return clone;
	};

})();
