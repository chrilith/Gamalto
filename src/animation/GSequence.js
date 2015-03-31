/*
 * Gamalto.Sequence
 * ----------------
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

	/* Dependencies */
	gamalto.devel.require("Animator");

	/**
	 * @constructor
	 */
	var _Object = G.Sequence = function() {
		this._list = [];
		this._time = [];
		Object.base(this);
	};
	
	/* Inheritance and shortcut */
	var proto = G.Sequence.inherits(G.Animator);
	
	proto.add = function(inst, duration) {
		this._list.push(inst);
		this._time.push(duration);
		return this;
	};

	proto.update = function(timer) {
		var p = this.progress | 0,	// remove fractional part for comparison
			was = this.playing,
			now = _Object.base._update.call(this, timer, false, this._time),
			i = this.progress | 0;

		// TODO: an action may be skipped upon slowdown. Add a strict parameter
		// to for complete sequence execution? Important if an action has some
		// dependance with a previous one...
		if (!was || p !== i) {
			if (was) { this._call("exiting", p, timer); }
			if (now) { this._call("entering", i, timer); }
		}
		if (now) { this._call("update", i, timer); }

		return now;
	};

	proto._call = function(method, exec, data) {
		if ((exec = this._list[exec]) && exec[method]) {
			exec[method](data);
		}
	};

})();
