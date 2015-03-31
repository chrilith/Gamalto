/*
 * Gamalto.BaseAudioMixer
 * ----------------------
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

	gamalto.devel.using("AudioChannel");

	var _Object = G.BaseAudioMixer = function() {
		this.duplicateSource_ = false;
	},

	proto = _Object.inherits(G.Object);
	
	proto.init = function(channels) {
		var all = this.channels_ = [];

		for (var i = 0; i < channels; i++) {
			all.push(new G.AudioChannel(this.duplicateSource_));
		}

		return channels;
	};

	proto.createChannel = function() { };

	proto.createSound = function(src) { };

	proto.findChannel_ = function(priority) {
		var i, all = this.channels_;

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
	};

	proto.playSound = function(sound, repeat, priority) {
		var channel = this.findChannel_(priority);
		if (!channel) {
			gamalto.devel.warn("Unable to allocate channel to play sound.");
		} else {
			channel.play(sound, repeat, priority);
		}
	};

	proto.playMusic = function(sound) {
		this.playSound(sound, 0xffff, 0xffff);
	};

	proto.stopAll = function() {
		this.channels_.forEach(function(chan) {
			chan.stop();
		});
	};

})();
