/*
 * Gamalto.BitmapLibrary
 * 
 * This file is part of the Gamalto framework
 * http://www.gamalto.com/
 *

Copyright (C)2012-2014 Chris Apers and The Gamalto Project, all rights reserved.

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
made using this Software.

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
	gamalto.using_("Bitmap");

	/**
	 * Creates a bitmap resource manager.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BitmapLibrary
	 * @augments Gamalto.BaseLibrary
	 */
	var _Object = G.BitmapLibrary = function() {
		Object.base(this);
	}
	
	/** @alias Gamalto.BitmapLibrary.prototype */
	var proto = _Object.inherits(G.BaseLibrary);
	
	/**
	 * Tries to load a new resource into the library.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 * @param {string} src
	 *     The location of the item to load.
	 * @param {Gamalto.Bitmap} [type]
	 *     The type of the bitmap object to be instanciated.
	 * @returns {Gamalto.Promise} A promise to handle the loading states.
	 */
	 proto.loadItem = function(name, src, type) {
		var promise = _Object.base.loadItem.call(this),
			bitmap = new (type || G.Bitmap),

			i = new (bitmap._getSourceType()),
			that = this;


		i.onabort = i.onerror = function(e) {
			promise.reject(that._failed(name, src));
		}

		i.onload = function() {
			bitmap.setSource(i);
			that.list_[G.N(name)] = bitmap;
			promise.resolve({
				source: that,
				item: name
			});
		}

		i.src = src;
		return promise;
	}

})();