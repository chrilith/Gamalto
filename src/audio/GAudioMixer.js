/*
 * Gamalto.AudioMixer
 * ------------------
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
	gamalto.devel.using("AudioChannel");
	gamalto.devel.using("AudioState");

	/**
	 * List of registered mixers.
	 *
	 * @type {array.<Gamalto.BaseAudioMixer>}
	 */
	var mixers = [];

	/**
	 * Abstract object to create an audio mixer.
	 * It is not meant to be used directly by the client code.
	 *
	 * @abstract
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.AudioMixer
	 * @augments Gamalto.Object
	 */
	var _Object = G.AudioMixer = function() {
		/**
		 * Mixer audio channels.
		 *
		 * @readonly
		 *
		 * @member {array.<Gamalto.AudioChannel>}
		 * @alias Gamalto.AudioMixer#channels
		 */
		this.channels = [];
	};

	/** @alias Gamalto.AudioMixer.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Initializes the mixer.
	 *
	 * @param  {number} channels
	 *         Number of channels to be used by the mixer.
	 */
	proto.init = function(channels) {
		var all = this.channels;
		all.length = 0;

		for (var i = 0; i < channels; i++) {
			all.push(new G.AudioChannel());
		}
	};

	/**
	 * Creates a sound for the current mixer type.
	 *
	 * @function createSound
	 * @memberof Gamalto.AudioMixer.prototype
	 * @abstract
	 *
	 * @param {string} src
	 *        Source URL of the sound.
	 *
	 * @return {Gamalto.BaseSound} Object instance implementing
	 *         {@link Gamalto.BaseSound}.
	 */

	/**
	 * Searches for a free channel.
	 *
	 * @private
	 *
	 * @param  {number} priority
	 *         Priority to consider.
	 *
	 * @return {Gamalto.AudioChannel} Found channel or null.
	 */
	proto.findChannel_ = function(priority) {
		var i;
		var all = this.channels;

		// Find a non playing channel
		for (i = 0; i < all.length; i++) {
			if (!all[i].playing) {
				return all[i];
			}
		}

		// Then try to find a playing channel with same priority
		for (i = 0; i < all.length; i++) {
			if (all[i].priority <= priority) {
				return all[i];
			}
		}

		return null;
	};

	/**
	 * Plays a sound.
	 *
	 * @param  {Gamalto.BaseSound} sound
	 *         Sound to play.
	 * @param  {number} [repeat=0]
	 *         How many times to repeat the sound.
	 * @param  {number} [priority=0]
	 *         Playback priority.
	 */
	proto.play = function(sound, repeat, priority) {
		var context = new G.AudioState(sound);
		var channel = this.findChannel_(priority);

		if (!channel) {
			gamalto.devel.warn("Unable to allocate channel to play sound.");
		} else {
			context.priority = priority;
			context.repeat = repeat;
			channel.play(context);
		}
	};

	/**
	 * Stops all playing channels.
	 */
	proto.stopAll = function() {
		this.channels.forEach(function(channel) {
			channel.stop();
		});
	};

	/**
	 * Creates an audio mixer.
	 *
	 * @function create
	 * @memberof Gamalto.AudioMixer
	 * @static
	 *
	 * @param  {number} channels
	 *         Number of channels to use with the audio mixer.
	 * @param  {...number} preferedMode
	 *         One or more types of mixer in order of preference.
	 *         The manager will create the first available mixer
	 *         type for the current system.
	 *
	 * @return {Gamalto.BaseAudioMixer} Mixer instance or null
	 *                                  if sound isn't supported by the system.
	 */
	_Object.create = function(channels/*, ...preferedMode*/) {
		var i, current, mixer;
		var preferedMode = Array.prototype.slice.call(arguments, 1);

		for (i = 0; i < preferedMode.length; i++) {
			current = mixers[preferedMode[i]];

			if (current.canUse()) {
				// jscs:disable
				mixer = new (current)();
				// jscs:enable
				mixer.init(channels);

				return mixer;
			}
		}

		gamalto.devel.assert(mixer, "Failed to initialize audio mixer.");
		return null;
	};

	/**
	 * Adds a mixer object to the factory.
	 *
	 * @internal
	 * @ignore
	 *
	 * @param {string} name
	 *        name of the property to add.
	 * @param {Gamalto.BaseMixer} mixer
	 *        Object inheriting from Gamalto.BaseMixer.
	 */
	_Object.addObject_ = function(name, mixer) {
		_Object[name] = mixers.length;
		mixers.push(mixer);
	};

})();
