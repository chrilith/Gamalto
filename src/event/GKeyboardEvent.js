/*
 * Gamalto.KeyboardEvent
 * ---------------------
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
	 * @memberof Gamalto
	 * @constructor Gamalto.KeyboardEvent
	 * @augments Gamalto.Event
	 */
	G.KeyboardEvent = function(type) {
		Object.base(this, type);
	//	this._repeat	// is repeating
	};

	/* Inheritance and shortcut */
	var proto = G.KeyboardEvent.inherits(G.Event);
	
	proto.equals = function(b) {
		var a = this;
		return (a.type		== b.type &&
				a.keyCode	== b.keyCode &&
				a.modifiers	== b.modifiers);
	};
	
	/* Constants */
	var constant = G.Event;

	constant.KEYDOWN		= "keydown";
	constant.KEYUP			= "keyup";
	
	constant.KMOD_NONE		= 0x0000;
	constant.KMOD_SHIFT		= 0x0001;	// | 0x0002
	constant.KMOD_CTRL		= 0x0004;	// | 0x0008
	constant.KMOD_ALT		= 0x0010;	// | 0x0020
	constant.KMOD_LMETA		= 0x0040;
	constant.KMOD_RMETA		= 0x0080;
	
	constant.KMOD_META		= 0x0040|0x0080;
	//constant.KMOD_ALT		= (0x0010|0x0020);
	//constant.KMOD_ALTGR	= (0x0020); // CTRL+ = META?

	constant.K_TAB			= 9;
	constant.K_ENTER		= 13;
	constant.K_SHIFT		= 16;
	constant.K_CONTROL		= 17;
	constant.K_ALT			= 18;
	constant.K_PAUSE		= 19;
	constant.K_CAPSLOCK		= 20;
	constant.K_ESCAPE		= 27;
	constant.K_SPACE		= 32;
	constant.K_PAGEUP		= 33;
	constant.K_PAGEDOWN		= 34;
	constant.K_END			= 35;
	constant.K_HOME			= 36;
	constant.K_LEFT			= 37;
	constant.K_UP			= 38;
	constant.K_RIGHT		= 39;
	constant.K_DOWN			= 40;
	constant.K_DEL			= 46;
	constant.K_LMETA		= 91;
	constant.K_RMETA		= 92;
	constant.K_MENU			= 93;
	constant.K_F1			= 112;
	constant.K_F2			= 113;
	constant.K_F3			= 114;
	constant.K_F4			= 115;
	constant.K_F5			= 116;
	constant.K_F6			= 117;
	constant.K_F7			= 118;
	constant.K_F8			= 119;
	constant.K_F9			= 120;
	constant.K_F10			= 121;
	constant.K_F11			= 122;	// For fullscreen detection
	constant.K_F12			= 123;
	constant.K_NUMLOCK		= 144;
	constant.K_SCROLLLOCK	= 145;

})();
