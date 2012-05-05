/*
 * Gamalto.State
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

(function() {
	
	/**
	 * @constructor
	 */
	G.State = function() {
		this._list = [];
	//-	this._curr = null;
	}
	
	/* Inheritance and shortcut */
	var proto = G.State.inherits(G.Object);
	
	/* Instance methods */
	proto.register = function(name, object) {
		this._list[name] = object;
		return this;
	}
	
	proto.set = function(name) {
		var s = this;
		s._exit();
		s._curr = name;
		s._enter();
	}
	
	proto.update = function(timer) {
		return this._call("update", timer);
	}
	
	proto._enter = function() {
		this._call("entering");
	}
	
	proto._exit = function() {
		this._call("exiting");
	}
	
	proto._call = function(method, data) {
		var u, o, s = this;
		if ((o = s._list[s._curr]) && o[method]) { return o[method](data); }
		return u;
	}

})();
