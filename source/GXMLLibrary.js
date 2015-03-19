/*
 * Gamalto.XMLLibrary
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

(function(global) {
	/* Dependencies */
	gamalto.require_("BaseLibrary");

	/**
	 * Creates an XML resource manager.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.XMLLibrary
	 * @augments Gamalto.BaseLibrary
	 */
	var _Object = G.XMLLibrary = function() {
		Object.base(this);
	},
	
	/** @alias Gamalto.XMLLibrary.prototype */
	proto = _Object.inherits(G.BaseLibrary);

	/**
	 * Tries to load a new resource into the library.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 * @param {string} src
	 *     The location of the item to load.
	 * @param {string} [data]
	 *     Data to send with the request. If set, the request will use POST instead of GET.
	 * @returns {Gamalto.Promise} A promise to handle the loading states.
	 */
	proto.loadItem = function(name, src, data) {
		var promise = _Object.base.loadItem.call(this),
		
			/* See: API_CORS.js */
			x = new (global._XDomainRequest || XMLHttpRequest),
			that = this;

		x.onreadystatechange = function() {
			var e, exception, success;
			switch (x.readyState) {
				case x.LOADING:
					data = true;
					break;
				case x.DONE:
					if (data && (success = (x.status || 200)) == 200) {
						try {
							data = that.toData_(x);
						} catch(e) {
							exception = e;
						}
						success = success && !!data;
					}
	
					if (!success) {
						promise.reject(that.failed_(name, src, exception));
					} else {
						that.list_[G.N(name)] = data;
						promise.resolve({
							source: that,
							item: name
						});
					}
					break;
			}
		}

		try {
			x.open(data ? "POST" : "GET", src);
			x.send(data || null);
		} catch(exception) {
			promise.reject(this.failed_(name, src, exception));
		}
		return promise;
	};
	
	/**
	 * Transforms data before sorting the resource.
	 *
	 * @virtual
	 * @protected
	 * @ignore
	 */
	proto.toData_ = function(x) {
		return x.responseXML;
	};

})(this);
