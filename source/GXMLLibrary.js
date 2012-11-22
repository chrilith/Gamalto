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

(function() {
	/* Dependencies */
	gamalto.require("BaseLibrary");

	/**
	 * @constructor
	 */
	G.XMLLibrary = function(complete) {
		Object.base(this, complete);
	}
	
	var proto = G.XMLLibrary.inherits(G.BaseLibrary);
	
	proto.loadItem = function(name, src, data) {
		var promise = G.XMLLibrary.base.loadItem.call(this),
		
			x = new XMLHttpRequest(),
			that = this;

		x.onreadystatechange = function() {
			var e, exception, success, data, x = this;
			if (x.readyState == x.DONE) {
				if ((success = (x.status || 200)) == 200) {
					try {
						data = that._toData(x);
					} catch(e) {
						exception = e;
					}
					success = success && !!data;
				}

				if (!success) {
					promise.reject(that._failed(name, src, exception));
				} else {
					that._list[G.N(name)] = data;
					promise.resolve({
						source: that,
						item: name
					});
				}

// TODO: remove old fashion stuff
				that._done();
				if (that._cb) { that._cb(that, name, success); }
			}
		}
	
		x.open(data ? "POST" : "GET", src);
		x.send(data || null);
		return promise;
	}
	
	proto._toData = function(x) {
		return x.responseXML;
	}

})();
