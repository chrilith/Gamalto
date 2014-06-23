/*
 * Gamalto Global Environement
 * 
 * This file is part of the Gamalto middleware
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
var ENV = self;

/* Gamalto base object and initializer */
(function() {

	// This is a singleton
	var core = { env: {} },

	/* Private */
	_container;

	// This is supposed to be always accessible
	core.env.isHttpRangesSupported = false;	// false as of v1.4.1 of CocoonJS
	core.env.isMobile = false;				// TODO
	core.env.hasAudio = false;				// Will be iniitalized by the audio lib

	// Object methods
	var init = function(loader/*, debug*/) { // TODO: debug level
		// Check for dependencies
		gamalto.checkDependencies__();

		// Run the application
		if (document.readyState == 'complete') {
			setTimeout(loader, 0);
		} else {
			document.addEventListener('DOMContentLoaded', loader, false);
		}
	};

	core.setContainer = function(container) {
		_container = (typeof container == "string") ?
			document.getElementById(container) : container;
		
		/* For scanlines positioning and some other stuff... */
		_container.style.position = "relative";	// FIXME, bad way to do this
	};
	
	core.getContainer = function() {
		return (_container || document.body);
	};

	core.setIcon = function(href) {
		var head = document.getElementsByTagName("head")[0];
		if (head) {
			var link = document.createElement("link");
			link.rel = "icon";
			link.href = href;
			head.appendChild(link);
		}
	};

	core.setTitle = function(title) {
		document.title = title;
	}

	core.defined = function(/* vargs... */) {
		var i,
			a = arguments,
			u; // undefined

		for (i = 0; i < a.length; i++) {
			if (a[i] !== u) { return a[i]; }
		}
		return u;
	};

	/* Private methods */

	core._isName = function(name) {
		return name && name.indexOf("G__") == 0;
	};

	core._isObject = function(v) {
		return (typeof v == "object");
	};

	core._xywh = function(elem, parent, unit) {
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
	};

	/* #defines */
	var constant = {

		N: function(name) {
			return "G__" + name;
		},
		
		H: function(name) {
			return "_" + name + "Handler";
		}
	};

	/* Global contants */
	constant.NONE			= undefined;
	
	constant.ALIGN_LEFT		= 1 << 0;
	constant.ALIGN_RIGHT		= 1 << 1;
	constant.ALIGN_TOP		= 1 << 2;
	constant.ALIGN_BOTTOM	= 1 << 3;

	constant.ALIGN_CENTER	= (1 << 0 | 1 << 1); 	// LEFT+RIGHT
	constant.ALIGN_MIDDLE	= (1 << 2 | 1 << 3);	// TOP+BOTTOM

	/* Initiamization */
	constant.init = init;

	/* Register the singleton */
	ENV.gamalto = core;

	/* Globalization */
	ENV.G = ENV.Gamalto = constant;

	/* Namespace for special effects objects */
	ENV.GE = G.Effects = {};
})();
