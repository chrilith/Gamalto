/*
 * Gamalto Core Object
 * -------------------
 * 
 * This file is part of the GAMALTO JavaScript Development Framework.
 * http://www.gamalto.com/
 *

Copyright (C)2012-20XX Chris Apers and The GAMALTO Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 *
 */

(function(global) {

	var container;

	/**
	 * Core object of the Gamalto framework.
	 *
	 * @memberof Gamalto
	 * @constructor Core
	 * @protected
	 */
	var Core = function() { };

	/** @alias Core.prototype */
	var core = Core.prototype;

	/**
	 * Sets the container of the canvas element.
	 *
	 * @param  {(string|object)} element
	 *         Name or the HTMLElement which will receive the main canvas object.
	 */
	core.setContainer = function(element) {
		container = (typeof element === "string") ?
			document.getElementById(element) : element;
	};
	
	/**
	 * Gets the container of the canvas element defined by {@linkcode Core#setContainer}.
	 *
	 * @return {object}
	 *         HTMLElement containing the canvas element or the document body by default.
	 */
	core.getContainer = function() {
		return (container || document.body);
	};

	/**
	 * Sets the window icon.
	 *
	 * @param  {string} url
	 *         Location of the icon.
	 */
	core.setIcon = function(href) {
		var head = document.getElementsByTagName("head")[0];
		if (head) {
			var link = document.createElement("link");
			link.rel = "icon";
			link.href = href;
			head.appendChild(link);
		}
	};

	/**
	 * Sets the window title.
	 *
	 * @param  {string} title
	 *         New window title.
	 */
	core.setTitle = function(title) {
		document.title = title;
	};

	/**
	 * Finds the first defined element in the parameters list.
	 *
	 * @param  {...object} vargs
	 *         List of parameters.
	 *
	 * @returns  {object}
	 *           First defined element or `undefined` by default.
	 */
	core.defined = function(/* vargs... */) {
		var i, undef;
		var args = arguments;

		for (i = 0; i < args.length; i++) {
			if (args[i] !== undef) { return args[i]; }
		}
		return undef;
	};

	core.createEvent = function(type) {
		var e = document.createEvent("Event");
		e.type = type;
		return e;
	};

	/* Pseudo-Private methods */

	core.getBox_ = function(elem, parent, unit) {
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
	 * Main object to access the Gamalto core members.
	 *
	 * @global
	 * @type {Gamalto.Core}
	 */
	global.gamalto = new Core();

})(this);
