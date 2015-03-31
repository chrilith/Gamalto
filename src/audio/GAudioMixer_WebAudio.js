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

	/**
	 * Dependencies
	 */
	gamalto.devel.require("AudioMixer");
	gamalto.devel.require("BaseAudioMixer");
	gamalto.devel.using("WebAudioSound");

	var _Base = G.AudioMixer,

	_Object = function() {
		Object.base(this);
	},

	proto = _Object.inherits(G.BaseAudioMixer);

	_Object.canUse = function() {
		// FIXME
		return !!global.AudioContext && !global.ontouchstart;
	};

	// TODO: change name to MIX_WEBAUDIO as this is not used has bit
	_Base.addMixer_("BIT_WEBAUDIO", _Object);
	
	proto.init = function(channels) {
		this.ctx_ = new AudioContext();
		return _Object.base.init.call(this, channels);
	};

	proto.createSound = function(src) {
		return new G.WebAudioSound(src, this.ctx_);
	};

})(this);
