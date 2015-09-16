/*
 * Gamalto.AudioChannel
 * --------------------
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

	/* Dependencies */
	gamalto.devel.using("AudioState");

	/**
	 * Creates an audio channel that can be used by an audio mixer.
	 * It is not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.AudioChannel
	 * @augments Gamalto.Object
	 */
	var _Object = G.AudioChannel = function() {
		/**
		 * Whether to duplicate the sound source before playing a sound.
		 * This allows to play multiple instances of a same sound and
		 * to dispose resources when needed.
		 *
		 * @private
		 *
		 * @member {boolean}
		 */
		this.ds_ = false;

		/**
		 * Priority of the playing sound.
		 *
		 * @readonly
		 *
		 * @member {number}
		 * @alias Gamalto.AudioChannel#priority
		 */
		this.priority = 0;
	};

	/** @alias Gamalto.AudioChannel.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Plays a sound using the provided context.
	 *
	 * @param  {Gamalto.AudioState} context
	 *         Context holding the playback configuration.
	 */
	proto.play = function(context) {
		// Stop any playing sound and free related resources if needed.
		this.stop();

		this.priority = Number(context.priority) | 0;

		// Get the sound object...
		this.sound_ = (this.ds_ = context.duplicateSource) ?
			context.sound.clone() : context.sound;

		// ...and play
		this.sound_.play(context.repeat);
	};

	/**
	 * Stops the playing sound if any.
	 */
	proto.stop = function() {
		if (this.sound_) {
			this.sound_[this.ds_ ? "dispose" : "stop"]();
			this.sound_ = null;
		}
	};

	/**
	 * Whether the channel is playing a sound.
	 *
	 * @readonly
	 *
	 * @member {boolean}
	 * @alias Gamalto.AudioChannel#playing
	 */
	Object.defineProperty(proto, "playing", {
		get: function() {
			return this.sound_ && this.sound_.playing;
		}
	});

})();
