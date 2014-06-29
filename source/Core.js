/*
 * Gamalto Core Object
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

(function() {

	var _container, undef;

	/**
	 * Core object of the Gamalto framework.
	 *
	 * @constructor
	 * @global
	 * @protected
	 */
	var Core = function() {
		this.debug = undef;
		this.env = undef;
	};

	/** @alias Core.prototype */
	var core = Core.prototype;

	/**
	 * Sets the container of the canvas element.
	 *
	 * @param {(string|object)} container
	 *     The name or the HTMLElement which will receive the main canvas object.
	 */
	core.setContainer = function(container) {
		_container = (typeof container == "string") ?
			document.getElementById(container) : container;
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
			a = arguments;

		for (i = 0; i < a.length; i++) {
			if (a[i] !== undef) { return a[i]; }
		}
		return undef;
	};

	/* Pseudo-Private methods */

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

	/* Register the singleton */

	/**
	 * Main object to access the Gamalto core properties.
	 *
	 * @global
	 * @type {Core}
	 */
	self.gamalto = new Core();

})();
