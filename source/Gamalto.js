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
	
	var Gamalto = (function() {
	
/* Private */
		var _using = {},
			_container;   
		
/* Public */  
		return {
			
			init: function(run/*, debug*/) { // TODO: debug level

				// Check for dependencies
				for (var use in _using) {
					if (use.substr(0, 3) == "G__") {
						var module = use.substr(3);
						if (!G[module]) {
							throw 'Gamalto cannot find module ["' + module + '"].';
						}
					}
				}

				// Run the application
				document.addEventListener('DOMContentLoaded', run, false);
			},
	
			using: function(name) { _using["G__" + name] = 1; },
			require: function(name) {
				if (!G[name]) {
					throw 'Gamalto dependency error ["' + name + '"].';
				}
			},
	
			setMainContainer: function(container) {
				container = (typeof container == "string") ?
					document.getElementById(container) : container;
				_container = container;
				
				/* For scanlines positioning and some other stuff... */
				container.style.position = "relative";
			},
			
			getMainContainer: function() {
				return (_container || document.body);
			},

			getDef: function(v1, v2) {
				var u; // undefined
				return v1 !== u ? v1 : v2;
			},
			
			N: function(name) {
				return "G__" + name;
			},

/* Internal */
			_isObj: function(v) {
				return (typeof v == "object");
			},

			_xywh: function(e, p) {
				var x = 0,
					y = 0,
					w = e.offsetWidth,
					h = e.offsetHeight;
	
				while (e && e != p) {
					x += e.offsetLeft;
					y += e.offsetTop;
					e  = e.offsetParent;
				}

				return { x: x + "px", y: y + "px", w: w + "px", h: h + "px" };			
			}
		}
	})();

	/* Globalization */
	env.G  = env.Gamalto = Gamalto;

	/* Namespace for special effects objects */
	env.GE = G.Effects = {};

})(ENV);