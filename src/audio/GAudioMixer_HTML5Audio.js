/*
 * Gamalto.AudioMixer HTML5 Audio Element Module
 * ---------------------------------------------
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

	/* Dependencies */
	gamalto.devel.require("AudioMixer");
	gamalto.devel.using("HTML5Sound");

	/* Aliases */
	var _AudioMixer = G.AudioMixer;

	/**
	 * Creates a new audio mixer using HTML5 Audio Element.
	 */
	var _Object = function() {
		Object.base(this);
	};

	/* Object prototype */
	var proto = _Object.inherits(_AudioMixer);

	/**
	 * Creates a new HTML5 Audio sound.
	 *
	 * @return {Gamalto.HTML5Sound}
	 */
	proto.createSound = function(src) {
		return new G.HTML5Sound(src);
	};

	/**
	 * Checks whether this audio driver can be used.
	 *
	 * @return {boolean}
	 */
	_Object.canUse = function() {
		return Boolean(global.Audio);
	};

	/**
	 * Defines a mixer which use the HTML5 Audio Element.
	 *
	 * @see  {@link http://www.w3.org/html/wg/drafts/html/master/semantics.html#the-audio-element|W3C HTML Audio Element page}
	 *
	 * @constant MIX_HTML5AUDIO
	 * @memberof Gamalto.AudioMixer
	 */
	_AudioMixer.addObject_("MIX_HTML5AUDIO", _Object);

})(this);
