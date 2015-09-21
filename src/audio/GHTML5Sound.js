/*
 * Gamalto.HTML5Sound
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
	gamalto.devel.require("BaseSound");

	/**
	 * Creates a sound based on the HTML5 Audio Element.
	 *
	 * @see  {@link http://www.w3.org/html/wg/drafts/html/master/semantics.html#the-audio-element|W3C HTML Audio Element page}
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.HTML5Sound
	 * @augments Gamalto.BaseSound
	 */
	var _Object = G.HTML5Sound = function(src) {
		Object.base(this, src);
	};

	/** @alias Gamalto.HTML5Sound.prototype */
	var proto = _Object.inherits(G.BaseSound);

	/**
	 * Loads the sound data.
	 *
	 * @return {Promise} Promise to handle loading states.
	 */
	proto.load = function() {
		return new Promise(function(resolve, reject) {
			var audio = new Audio();

			// CocoonJS has a limited number of events
			audio.addEventListener("canplaythrough", function() {
				audio.removeEventListener("canplaythrough", arguments.callee, false);
				resolve();
			}, false);

			audio.onabort = audio.onerror = reject;

			/**
			 * Internal sound data.
			 *
			 * @private
			 *
			 * @member {HtmlAudioElement}
			 */
			this.source_ = audio;
			audio.preload = "auto";
			audio.src = this.src_;
			audio.load();

		}.bind(this));
	};

	/**
	 * Plays the sound.
	 *
	 * @param  {number} [repeat=0]
	 *         How many times to repeat the sound.
	 */
	proto.play = function(repeat) {
		var audio = this.source_;

		_Object.base.play.call(this, repeat);

		// Loop handling
		audio.onended = audio.onended || this.onEnded_.bind(this);

		// Try to play the sound from the beginning
		audio.currentTime = 0;
		audio.play();
	};

	/**
	 * Stops the sound if playing.
	 */
	proto.stop = function() {
		if (this.playing) {
			this.source_.pause();
		}
		_Object.base.stop.call(this);
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.HTML5Sound} Copy of the object.
	 */
	proto.clone = function() {
		var clone = new _Object(this.src_);
		clone.source_ = this.source_.cloneNode(true);

		return clone;
	};

	/**
	 * Releases resources related to this object.
	 */
	proto.dispose = function() {
		this.stop();
		this.source_ = null;
	};

})();
