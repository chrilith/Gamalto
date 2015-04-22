/*
 * Gamalto.BaseSound
 * -----------------
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
	 * Abstract object to create an audio mixer compatible sound. It is not meant to be used directly by the client code.
	 * 
	 * @abstract
	 * 
	 * @memberof Gamalto
	 * @constructor Gamalto.BaseSound
	 * @augments Gamalto.Object
	 */
	var _Object = G.BaseSound = function(src) {
		this.src_ = src;

		this.playing_ = false;

		this.toPlay_ = 0;
	},

	proto = _Object.inherits(G.Object);

	proto.init = function() {};

	proto.load = function() {};

	proto.play = function(repeat) {
		this.stop();
		// Should be playing now
		this.playing_ = true;
		// Loop the sound
		this.toPlay_ = (+repeat | 0);
	};

	proto.stop = function() {
		this.toPlay_ = 0;
		this.playing_ = false;
	};

	proto.isPlaying = function() {
		return this.playing_;
	};

	proto.onEnded_ = function() {
		if (this.playing_ && this.toPlay_-- > 0) {
			this.play(this.toPlay_);
		} else {
			this.stop();
		}		
	};

})();
