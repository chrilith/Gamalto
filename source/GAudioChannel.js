/*
 * Gamalto.AudioChannel
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
	// ...

	/**
	 * @constructor
	 */
	G.AudioChannel = function(duplicateSource) {
		this._ds = duplicateSource;
	}

	var proto = G.AudioChannel.inherits(G.Object);
	
	proto.push = function(snd) {
		this.stop();

		// Allow the same sound to be played on many channels
		if (this._ds) {
			if (!this._sound ||
				!this._sound.equals(snd)) {
					this._sound = snd.clone();
			}
		// Mostly for single channel systems
		} else {
			this._sound = snd;
		}
	}

	proto.getPriority = function() {
		return this._sound ? this._sound.priority : 0;
	}

	proto.isPlaying = function() {
		return this._sound ? this._sound._playing : false;
	}

	proto.play = function(loop) {
		if (this._sound) { this._sound.play(loop);}
	}

	proto.pause = function() {
		if (this._sound) { this._sound.pause();}
	}

	proto.stop = function() {
		if (this._sound) { this._sound.stop();}
	}
	
})();
