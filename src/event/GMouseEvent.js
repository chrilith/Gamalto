/*
 * Gamalto.MouseEvent
 * ------------------
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

(function() {

	/**
	 * Dependencies
	 */
	gamalto.devel.require("Event");

	/**
	 * @constructor
	 */
	G.MouseEvent = function(type) {
		Object.base(this, type);
	};

	/* Inheritance and shortcut */
	var proto = G.MouseEvent.inherits(G.Event);

	proto.equals = function(b) {
		var a = this;
		return (a.type		== b.type &&
				a.absX		== b.absX &&
				a.absY		== b.absY &&
				a.buttons	== b.buttons &&
				a.modifiers	== b.modifiers);
	};

	proto.onSurface = function(surface) {
		return (this.target == surface.getCanvas_());
	};

	/* Constants */
	var constant = G.Event;

	constant.MOUSEMOVE	= "mousemove";
	constant.MOUSEDOWN	= "mousedown";
	constant.MOUSEUP	= "mouseup";

	constant.KBUT_LEFT		= 0x0001;
	constant.KBUT_MIDDLE	= 0x0002;
	constant.KBUT_RIGHT		= 0x0004;

})();
