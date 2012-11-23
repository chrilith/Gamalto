/*
 * Gamalto.SoundPool
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

	/* Dependencies */
	gamalto.require("BaseLibrary");

	/**
	 * @constructor
	 */
	G.SoundPool = function(complete) {
		Object.base(this, complete);
	}

	var proto = G.SoundPool.inherits(G.BaseLibrary);

	proto.loadItem = function(name, src) {
		var promise = G.SoundPool.base.loadItem.call(this),
			a = document.createElement("audio"),
			that = this;
	
		a.onabort = a.onerror = function(e) {
			promise.reject(that._failed(name, src));
		}
		
		a.addEventListener("loadedmetadata", function(e) {
			a.removeEventListener("loadedmetadata", arguments.callee, false);
			that._list[G.N(name)] = new G.Sound(a);
			promise.resolve({
				source: that,
				item: name
			});
		}, false);

		// FIXME: this seems to help loading of sound files in Chrome...
		a.preload = "metadata";
		a.src = src;
		a.load();

		return promise;
	}

})();
