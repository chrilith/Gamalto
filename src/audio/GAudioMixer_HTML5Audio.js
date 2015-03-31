/*
 * Gamalto.AudioMixer HTML5 Audio API Module
 * -----------------------------------------
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

	/**
	 * Dependencies
	 */
	gamalto.devel.require("AudioMixer");
	gamalto.devel.require("BaseAudioMixer");
	gamalto.devel.using("HTML5Sound");

	var _Base = G.AudioMixer,

	_Object = function() {
		Object.base(this);
		this.duplicateSource_ = true;
	},

	proto = _Object.inherits(G.BaseAudioMixer);

	_Object.canUse = function() {
		// FIXME
		return !!global.Audio && !global.ontouchstart;
	};

	// TODO: change name to MIX_WEBAUDIO as this is not used has bit
	_Base.addMixer_("BIT_HTML5AUDIO", _Object);

	proto.createSound = function(src) {
		return new G.HTML5Sound(src);
	};

})(this);
