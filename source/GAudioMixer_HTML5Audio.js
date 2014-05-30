/*
 * Gamalto.AudioMixer_HTML5Audio
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

(function(window) {

	/**
	 * Dependencies
	 */
	gamalto.require_("AudioMixer");
	gamalto.using_("AudioChannel");

	var base = G.AudioMixer,
		mixer = function(parent) {
			this._parent = parent;
		}

	mixer.canUse = function() {
		return !!window.Audio && !window.ontouchstart;
	}

	base._addMixer("BIT_HTML5AUDIO", mixer);

	var proto = mixer.prototype;
	
	proto.init = function(channels) {
		var all = this._channels = [];
		for (var i = 0; i < channels; i++) {
			all.push(new G.AudioChannel(true));
		}
		return channels;
	}

	proto.release = function() {
		// TODO
	}

	proto._findChannel = function(priority) {
		var i, all = this._channels;

		// Find a non playing channel
		for (i = 0; i < all.length; i++) {
			if (!all[i].isPlaying()) {
				return all[i];
			}
		}
		// Then try to find a playing channel with same priority
		for (i = 0; i < all.length; i++) {
			if (all[i].getPriority() <= priority) {
				return all[i];
			}
		}
		return null;
	}

	proto.playSound = function(sound, loop) {
		var channel = this._findChannel(sound.priority);
		if (!channel) {
			gamalto.warn_("Unable to allocate channel to play sound.");
		} else {
			channel.push(sound);
			channel.play(loop);
		}
	}

	proto.playMusic = function(sound, loop) {
		this.playSound(sound, loop);
	}

	proto.stopAll = function() {
		var all = this._channels;
		for (var i = 0; i < all.length; i++) {
			all[i].stop();
		}
	}

})(ENV);
