/*
 * Gamalto Global Environement
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

/* Initial execution environement */
var ENV = window;

/* Gamalto base object and initializer */
(function(env) {
	/* Dependencies */
	gamalto.using("Promise");

	var Gamalto = (function() {
	
/* Private */
		var _container;   
		
/* Public */  
		return {
			
			init: function(/*debug*/) { // TODO: debug level
				var promise = new G.Promise();

				// Check for dependencies
				gamalto.checkDependencies();

				// Run the application
				var loader = function() { promise.resolve(); };
				if (document.readyState == 'complete') {
					setTimeout(loader, 0);
				} else {
					document.addEventListener('DOMContentLoaded', loader, false);
				}

				return promise;
			},
		
			setContainer: function(container) {
				container = (typeof container == "string") ?
					document.getElementById(container) : container;
				_container = container;
				
				/* For scanlines positioning and some other stuff... */
				container.style.position = "relative";
			},
			
			getContainer: function() {
				return (_container || document.body);
			},

			defined: function(/* vargs... */) {
				var i,
					a = arguments,
					u; // undefined

				for (i = 0; i < a.length; i++) {
					if (a[i] !== u) { return a[i]; }
				}
				return u;
			},
			
			N: function(name) {
				return "G__" + name;
			},
			
			H: function(name) {
				return "_" + name + "Handler";
			},
			
			_isName: function(name) {
				return name && name.indexOf("G__") == 0;
			},

/* Internal */
			_isObj: function(v) {
				return (typeof v == "object");
			},

			_xywh: function(elem, parent, unit) {
				var x = 0,
					y = 0,
					w = elem.offsetWidth,
					h = elem.offsetHeight;
	
				while (elem && elem != parent) {
					x += elem.offsetLeft;
					y += elem.offsetTop;
					elem = elem.offsetParent;
				}

				unit = unit || 0;
				return { x: x + unit, y: y + unit, w: w + unit, h: h + unit };			
			}
		}
	})();

	/* Globalization */
	env.G  = env.Gamalto = Gamalto;

	/* Global contants */
	Gamalto.NONE			= undefined;
	
	Gamalto.ALIGN_LEFT		= 1 << 0;
	Gamalto.ALIGN_RIGHT		= 1 << 1;
	Gamalto.ALIGN_TOP		= 1 << 2;
	Gamalto.ALIGN_BOTTOM	= 1 << 3;

	Gamalto.ALIGN_CENTER	= (1 << 0 | 1 << 1); 	// LEFT+RIGHT
	Gamalto.ALIGN_MIDDLE	= (1 << 2 | 1 << 3);	// TOP+BOTTOM

	/* Namespace for special effects objects */
	env.GE = G.Effects = {};

})(ENV);
