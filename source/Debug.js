/*
 * Gamalto Debug Tools
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

/** @define {boolean} */
var GAMALTO_DEBUG = true;
if (GAMALTO_DEBUG) (function() {

/* Private */
	var _using = {},
		 debug = {};

	debug.using = function(name) {
		_using["D__" + name] = 1;
	}
	
	debug.require = function(name) {
		debug.assert(Gamalto[name], 'Gamalto dependency error ["' + name + '"].');
	}
	
	debug.checkDependencies = function() {
		for (var use in _using) {
			if (use.substr(0, 3) == "D__") {
				var module = use.substr(3);
				debug.assert(G[module], 'Gamalto cannot find module ["' + module + '"].');
			}
		}	
	}

	debug.assert = function(cond, message) {
		if (!cond) {
			throw message || "Assertion failed";
		}
	}

	debug.log = function() {
		console.log.apply(console, arguments);
	}

	window.gamalto = debug;

})();
