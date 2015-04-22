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

(function(window) {

	/**
	 * @memberof Gamalto
	 * @constructor Gamalto.AudioChannel
	 * @augments Gamalto.Object
	 */
	G.AudioChannel = function(duplicateSource) {
		// Allows a same sound to be played on many channels
		this.ds_ = duplicateSource;
	},

	proto = G.AudioChannel.inherits(G.Object);

	proto.getPriority = function() {
		return this.priority_;
	};

	proto.isPlaying = function() {
		return this.sound_ ? this.sound_.isPlaying() : false;
	};

	proto.play = function(sound, repeat, priority) {
		this.stop();
		this.priority_ = (+priority | 0);
		if (!(this.sound_ && this.sound_ === sound)) {
			this.sound_ = (this.ds_) ? sound.clone() : sound;
		}
		this.sound_.play(repeat);
	};

	proto.stop = function() {
		if (this.sound_) {
			this.sound_.stop();
		}
	};
	
})();
