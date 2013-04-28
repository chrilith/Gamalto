/*
 * Gamalto.Async
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2011-2013 Chris Apers and The Gamalto Project, all rights reserved.

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
	gamalto.require("Promise");

	/**
	 * @constructor
	 */
	var loop = function(func) {
		this._func = func;
	}

	/* Inheritance and shortcut */
	var proto = loop.prototype;

	proto._iter = function(promise) {
		var that = this;

		setTimeout(function() {
			var value = that._func.call(that);

			if (!value) {
				that._iter(promise);
			} else {
				if (!value.is(G.Promise)) {
					promise.resolve();
				} else {
					value.then(function(value) {
						if (value) {
							promise.resolve();
						} else {
							that._iter(promise);
						}
					});
				}
			}

		}, 0);
	}

	/* Helper */
	var stat = G.Async = {};

	stat.loop = function(func) {
		var promise = new G.Promise();
		new loop(func)._iter(promise);
		return promise;
	}

	stat.immediate = function() {
		var promise = new G.Promise();

		setTimeout(function() {
			promise.resolve();
		}, 0);

		return promise;
	}

	stat.delay = function(msecs) {
		var promise = new G.Promise();

		setTimeout(function() {
			promise.resolve();
		}, msecs);

		return promise;
	};


})();