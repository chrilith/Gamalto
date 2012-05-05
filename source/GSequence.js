/*
 * Gamalto.Sequence
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
	G.Sequence = function(callback) {
		this._list = [];
		this.reset();
	
		this.callback = callback;
	}
	
	/* Inheritance and shortcut */
	var proto = G.Sequence.inherits(G.Object);
	
	proto.add = function(inst, duration) {
		this._list.push({ object: inst, duration: duration });
		return this;
	}
	
	proto.reset = function() {
		var u;	// = undefined
		this._curr = u;
		this._lastTime = 0;
	}
	
	proto.update = function(timer) {
		var u,	// = undefined
			s = this,
			p = s._curr,
			i = p || 0,
			l = s._list,
			t = (s._lastTime += timer.elapsedTime),
			c = s.callback,
			ended;
	
		// TODO: an action may be skipped upon slowdown. Add a strict parameter
		// to for complete sequence execution? Important if an action has some
		// dependance with a previous one...
		while (i < l.length) {
			if (t < l[i].duration) {
				break;
			}
			s._lastTime = (t -= l[i++].duration);
		};

		if (p !== i) { s._call("exiting", timer); }
		if (!(ended = ((s._curr = i) == l.length)) &&
			p !== i) { s._call("entering", timer); }
		if (!ended)  { s._call("update", timer); }
		else if (c) { c(timer); }
	
		return ended;
	}
	
	proto._call = function(method, data) {
		var o, c = this._curr;
	
		if (c !== o /* undefined */
			&& (o = this._list[c].object)
			&& o[method]) {
			
			o[method](data);
		}
	}

})();
