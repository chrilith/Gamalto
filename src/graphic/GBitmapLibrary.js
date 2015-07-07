/*
 * Gamalto.BitmapLibrary
 * ---------------------
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
	gamalto.devel.require("BaseLibrary");
	gamalto.devel.using("Bitmap");

	/**
	 * Creates a bitmap resource manager.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BitmapLibrary
	 * @augments Gamalto.BaseLibrary
	 */
	var _Object = G.BitmapLibrary = function() {
		Object.base(this);
	};

	/** @alias Gamalto.BitmapLibrary.prototype */
	var proto = _Object.inherits(G.BaseLibrary);

	/**
	 * Tries to load a new resource in the library.
	 *
	 * @param  {string} name
	 *         Name of the resource.
	 * @param  {string} src
	 *         Location of the item to load.
	 * @param  {Gamalto.Bitmap} [type]
	 *         Type of the bitmap object to be instanciated.
	 *
	 * @return {Gamalto.Promise} A promise to handle loading states.
	 */
	proto.loadItem = function(name, src, type) {
		var promise = _Object.base.loadItem.call(this);
		/*jshint -W056 */
		var bitmap = new (type || G.Bitmap)();

		var image = bitmap.createSource_();
		var that = this;

		image.onabort =
			image.onerror = function(e) {
				promise.reject(that.failed_(name, src));
			};

		image.onload = function() {
			that.list_[G.N(name)] = bitmap;
			promise.resolve({
				source: that,
				item: name
			});
		};

		image.src = src;

		return promise;
	};

})();
