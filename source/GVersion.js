/*
 * Gamalto.Version
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
	// ...

	/**
	 * @constructor
	 */
	var stat = G.Version = function(major, minor, build, revision) {
		this.major = +major;
		this.minor = +minor;
		this.build = +build;
		this.revision = +revision;
		this._mormalize();
	}

	/* Object methods */
	stat.parse = function(str) {
		str = str.replace(/[^0-9\.,]/g, "").split(/[\.,]/);
		return new G.Version(str[0], str[1], str[2], str[3]);
	}

	/* Inheritance and shortcut */
	var proto = G.Version.inherits(G.Object);

	/* Instance methods */
	proto._mormalize = function() {
		this.major = Math.fmax(0, this.major | 0);
		this.minor = Math.fmax(0, this.minor | 0);
		this.build = Math.fmax(0, this.build | 0);
		this.revision = Math.fmax(0, this.revision | 0);	
	}

	proto.valueOf = function() {
		this._mormalize();
		return  this.major * 1e12 +
				this.minor * 1e8 +
				this.build * 1e4 + 
				this.revision;
	}

	proto.toString = function() {
		this._mormalize();
		var b = this.build,
			r = this.revision;

		return  this.major + "." +
				this.minor +
				(b == 0 ? "" : ("." + b)) +
				(r == 0 ? "" : ("." + r));
	}

})();
