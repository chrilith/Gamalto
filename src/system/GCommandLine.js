/*
 * Gamalto.CommandLine
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
	
	G.CommandLine = function() {
		this._list = {};
		this._readParams();
	}

	var proto = G.CommandLine.prototype;

	proto.getParam = function(name) {
		return this._list[G.N(name)];
	}

	proto.setParam = function(name, value) {
		var u; // = undefined
		// always have a defined value when setting
		this._list[G.N(name)] = (value === u) ? null : decodeURIComponent(value);
	}

	proto.hasParam = function(name) {
		var u; // = undefined
		return (this._list[G.N(name)] !== u);
	}
	
	proto._readParams = function() {
		var i, all,
			hash = location.hash;

		if (hash.substr(0, 3) == "#!/") {
			all = hash.substr(3).split('/');
			for (i = 0; i < all.length; i++) {
				if (all[i]) { this.setParam.apply(this, all[i].split(/[:=]/)); }
			}
		}
	}

})();
