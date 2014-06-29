/*
 * Gamalto Global Environement
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

/* Initial execution environement */
var ENV = self;

/* Gamalto base object and initializer */
(function() {

	var _Object = {

		/**
		 * This is the first function to call before using the Gamalto framework.
		 *
		 * @memberof Gamalto
		 * @param {function} loader
		 *     The function to call after the initialization is complete.
		 *
		 * @example
		 * // Startup code
		 * Gamalto.init(function() {
		 *     // ... Your code here
		 * });
		 */
		init: function(loader/*, debug*/) { // TODO: debug level
			// Check for dependencies
			gamalto.checkDependencies__();

			// Run the application
			if (document.readyState == 'complete') {
				setTimeout(loader, 0);
			} else {
				document.addEventListener('DOMContentLoaded', loader, false);
			}
		},

		N: function(name) {
			return "G__" + name;
		},
		
		H: function(name) {
			return "_" + name + "Handler";
		}

	};

	/* #defines */
	var constant = _Object;

	/* Global contants */

	/**
	 * Common value for undefined propertes.
	 * @constant NONE
	 * @memberof Gamalto
	 */
	constant.NONE			= undefined;
	
	constant.ALIGN_LEFT		= 1 << 0;
	constant.ALIGN_RIGHT	= 1 << 1;
	constant.ALIGN_TOP		= 1 << 2;
	constant.ALIGN_BOTTOM	= 1 << 3;

	constant.ALIGN_CENTER	= (1 << 0 | 1 << 1); 	// LEFT+RIGHT
	constant.ALIGN_MIDDLE	= (1 << 2 | 1 << 3);	// TOP+BOTTOM

	/** @namespace Gamalto
	 *
	 * @description
	 * <p>Gamalto is a JavaScript framework with no external libraries dependency. It provides small base objects, including complete source code, that can be easily extended to meet your needs.
	 *
	 * <p>It is lightweight, customiazable and take advantage of the HTML5 Canvas API specification widely available in all modern browsers.
	 *
	 * <p>It is the perfect companion for retrogaming style game developers with support for tile-based games, palettized graphics and much more!
	 */
	ENV.G = ENV.Gamalto = _Object;

	/* Namespace for special effects objects */
	ENV.GE = G.Effects = {};

})();
