/*
 * Gamalto.HTML5Sound
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
	
	var _Object = G.HTML5Sound = function(src) {
		Object.base(this, src);
		this.canPlay_ = false;
	},

	proto = _Object.inherits(G.BaseSound);

	proto.load = function() {
		var promise = new G.Promise(),
			audio = new Audio(),
			handler = this.handleEvent.bind(this); // passing "this" is not supported by CocoonJS

		// When data is available try to play the sound if needed
		audio.addEventListener("canplaythrough", handler, false);

		// Loop handling
		audio.addEventListener("ended", handler, false);

		audio.addEventListener("loadedmetadata", function() {
			audio.removeEventListener("loadedmetadata", arguments.callee, false);
			promise.resolve();
		}, false);

		audio.onabort = audio.onerror = promise.reject.bind(promise);

		this.audio_ = audio;
		audio.preload = "auto";
		audio.src = this.src_;
		audio.load();

		return promise;
	};

	proto.play = function(repeat) {
		_Object.base.play.call(this, repeat);

		// Save start time if the sound cannot be played immediately
		this.startTime_ = Date.now();

		// Try to play the sound from the beginning
		var audio = this.audio_;
		try {
			audio.currentTime = 0;
		// Expection if metadata is not available
		} finally {
			audio.play();
		}		
	};

	proto.stop = function() {
		_Object.base.stop.call(this);
		this.audio_.pause();
	};
	
	proto.clone = function() {
		var sound = new G.Sound(this.src_);
		sound.load();
		return sound;
	};

	/* Events handling */

	proto.handleEvent = function(e) {
		if (e.type == "canplaythrough") {
			this.onCanPlayThrough_();

		} else if (e.type == "ended") {
			this.onEnded_();
		}
	};

	proto.onCanPlayThrough_ = function() {
		if (this.playing_ && !this.canPlay_) {
			var elapsed		= (Date.now() - this.startTime_) / 1000,
				audio		= this.audio_,
				duration	= audio.duration,
				// Adjust
				loop		= elapsed / duration | 0,
				played		= elapsed % duration;

				if ((this.toPlay_ -= loop) >= 0) {
					audio.currentTime = played;
					audio.play();
				} else {
					this.stop();
				}
		}
		this.canPlay_ = true;
	};
	
})();
