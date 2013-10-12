/*
 * Gamalto.SoundPool
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

	/* Dependencies */
	gamalto.require_("BaseLibrary");
	gamalto.using_("Sound");

	/**
	 * @constructor
	 */
	var stat = G.SoundPool = function() {
		Object.base(this);
	}

	var proto = G.SoundPool.inherits(G.BaseLibrary);

	proto.loadItem = function(name, src) {
		var promise = G.SoundPool.base.loadItem.call(this),
			event = "loadedmetadata",	// Supported in CocoonJS 1.4
			audio = new Audio(),
			that = this;

		audio.onabort = audio.onerror = function(e) {
			promise.reject(that._failed(name, src, e));
		}

		audio.addEventListener(event, function(e) {
			audio.removeEventListener(event, arguments.callee, false);
			that._add(name, new G.Sound(audio));

			promise.resolve({
				source: that,
				item: name
			});
		}, false);

		audio.preload = "auto";
		audio.src = src;
		audio.load();

		return promise;
	}

	/* Constants */
	var constant = stat;

	constant.MP3	= ["audio/mpeg", "audio/mpg3"];
	constant.MP4	= ["audio/mpg4"];
	constant.OGG	= ["audio/ogg"];
	constant.WAVE	= ["audio/wav", "audio/x-wav"];

	/* Static */
	var test = new Audio();

	stat.isSupported = function(mime) {
		if (typeof mime == "string") { mime = [mime]; }

		var supported;
		mime.forEach(function(item) {
			if (test.canPlayType(item) != "") {
				supported = 1;
			}
		});
		return !!supported;
	}

})();
