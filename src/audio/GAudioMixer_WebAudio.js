/*
 * Gamalto.AudioMixer Web Audio API Module
 * ---------------------------------------
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

(function(global) {

	/* Enable standard version of the method */
	Object.defineMethod(global, "AudioContext");

	/* Dependencies */
	gamalto.devel.require("AudioMixer");
	gamalto.devel.using("WebAudioSound");

	/* Aliases */
	var _AudioMixer = G.AudioMixer;

	/**
	 * Creates a new audio mixer using Web Audio API.
	 */
	var _Object = function() {
		Object.base(this);
	};

	/* Object prototype */
	var proto = _Object.inherits(_AudioMixer);

	/**
	 * Initializes the mixer with an extra AudioContext
	 *
	 * @param  {number} channels
	 *         Number of channels to be used by the mixer.
	 */
	proto.init = function(channels) {
		this.ctx_ = new AudioContext();
		return _Object.base.init.call(this, channels);
	};

	/**
	 * Creates a new Web Audio sound.
	 *
	 * @return {Gamalto.WebAudioSound}
	 */
	proto.createSound = function(src) {
		return new G.WebAudioSound(src, this.ctx_);
	};

	/**
	 * Checks whether this audio driver can be used.
	 *
	 * @return {boolean}
	 */
	_Object.canUse = function() {
		return Boolean(global.AudioContext);
	};

	/**
	 * Defines a mixer which use the Web Audio API.
	 *
	 * @see {@link http://www.w3.org/TR/webaudio/|W3C Web Audio API page}
	 *
	 * @constant MIX_WEBAUDIO
	 * @memberof Gamalto.AudioMixer
	 */
	_AudioMixer.addObject_("MIX_WEBAUDIO", _Object);

})(this);
