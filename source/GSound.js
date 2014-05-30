/*
 * Gamalto.Sound
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
	
	G.Sound = function(audio, priority) {
		var that = this,
			handler = this.handleEvent.bind(this); // passing "this" is not supported by CocoonJS
		this._audio = audio;
		this.priority = priority | 0;				// May be use on signle channel platform
		this._canPlay = false;

		// When data is available try to play the sound if needed
		audio.addEventListener("canplaythrough", handler, false);

		// Loop handling
		audio.addEventListener("ended", handler, false);
	}

	var proto = G.Sound.inherits(G.Object);
	
	proto.play = function(loop) {
		var audio = this._audio;

		// Loop the sound
		this._loop = loop || 1;

		// Save start time if the sound cannot be played immediately
		this._startTime = Date.now();

		// Try to play the sound from the beginning
		try { audio.currentTime = 0; } catch(e) {}		// Expection if metadata are not available
		audio.play();

		// Should be playing now
		this._playing = true;
	}

	proto.pause = function() {
		this._playing = false;
		this._audio.pause();
	}

	proto.stop = function() {
		this._loop = 0;
		this.pause();
	}

	proto.equals = function(snd) {
		return this._audio.src == snd._audio.src &&
			this.priority == snd.priority;
	}
	
	proto.clone = function() {
		var audio = new Audio();
		audio.src = this._audio.src;
		return new G.Sound(audio, this.priority);
	}

	/* Events handling */

	proto.handleEvent = function(e) {
		if (e.type == "canplaythrough") {
			this._canplaythrough();
		} else if (e.type == "ended") {
			if (--this._loop) {
				this.play(this._loop);
			} else {
				this.stop();
			}
		}
	}

	proto._canplaythrough = function() {
		if (this._playing && !this._canPlay) {
			var elapsed		= (Date.now() - this._startTime) / 1000,
				audio		= this._audio,
				duration	= audio.duration,
				// Adjust
				loop		= elapsed / duration | 0,
				played		= elapsed % duration;

				if ((this._loop -= loop) > 0) {
					this._audio.currentTime = played;
					this._audio.play();
				} else {
					this.stop();
				}
		}
		this._canPlay = true;
	}
	
})();
