/*
 * Gamalto.State
 * -------------
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
	 * @memberof Gamalto
	 * @constructor Gamalto.State
	 * @augments Gamalto.Object
	 */
	var _Object = G.State = function() {
		Object.base(this);

		this.list_ = [];
		this.curr_ = null;
	};

	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.Object);

	/* Instance methods */
	proto.register = function(name, object) {
		this.list_[name] = object;
		return this;
	};

	proto.update = function(timer) {
		return this.call_("update", timer);
	};

	proto.call_ = function(method, data) {
		var object;
		if ((object = this.list_[this.curr_]) && object[method]) {
			return object[method](data);
		}
	};

	Object.defineProperty(proto, "active", {
		get: function() {
			return this.curr_;
		},
		set: function(name) {
			this.call_("exiting");
			this.curr_ = name;
			this.call_("entering");
		}
	});

})();
