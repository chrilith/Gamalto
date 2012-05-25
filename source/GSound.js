/*
 * Gamalto.Sound
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

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
	
	G.Sound = function(audio) {
		var that = this;
		this._audio = audio;

		this._onError = this._handleError.bind(this);
		this._listenError("abort");
		this._listenError("error");
		this._listenError("emptied");
		this._listenError("stalled");
		
		// Read metadata
		if (audio.readyState >= audio.HAVE_METADATA) {
			this.duration = audio.duration * 1000;	// To msecs
		}
		this._canPlay = (audio.readyState >= audio.HAVE_CURRENT_DATA);

		// Always check for metadata update
		audio.addEventListener("loadedmetadata", function() {
			that.duration = audio.duration * 1000;	// To msecs
		}, false);

		// When data is available try to play the sound if needed
		audio.addEventListener("canplaythrought", this._handlePlayThrought.bind(this), false);

		// Loop handling
		audio.addEventListener("ended", this._handleEnded.bind(this), false);
	}

	var proto = G.Sound.inherits(G.Object);
	
	proto.play = function(loop) {
		var a = this._audio;
		a.loop = ((this._loop = loop | 1) > 1);

		// Save start time if the sound cannot be played immediately
		this._startTime = Date.now();
		
		// Sound not ready anymore?
		if (!this._canPlay) {
			a.load();

		// Try to play it
		} else {
			a.currentTime = 0;
			a.play();
		}
		
		// Should be playing...
		this._playing = true;
	}

	proto.pause = function() {
		this._playing = false;
		this._audio.pause();
	}

	proto.stop = function() {
		this._loop = 0;
		this._playing = false;
		this._audio.loop = false;
		this._audio.pause();
	}
	
	
	/* Events handling */
	
	proto._handleError = function(e) {
		switch (e.type) {
			case "abort":
			case "emptied":
			case "error":
			case "stalled":
				this._canPlay = false;
				break;
		}
	}

	proto._handleEnded = function() {
		if (--this._loop <= 0) {
			this.stop();
		}
	}

	proto._handlePlayThrought = function() {
		if (this._playing && !this._canPlay) {
			var elasped	= Date.now() - this._startTime;
				loop	= elasped / this.duration | 0;
				played	= elapsed % this.duration;

				if ((this._loop -= loop) > 0) {
					this._audio.currentTime = played / 1000;
					this._audio.play();
				} else {
					this.stop();
				}
		}
		this._canPlay = true;
	}

	proto._listenError = function(what) {
		this._audio.addEventListener(what, this._onError, false);
	}

})();
