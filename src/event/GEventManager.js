/*
 * Gamalto.EventManager
 * --------------------
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

	var managers = [],
		bit = 1;		/* For extra manager bit */	
	
	/**
	 * @constructor
	 */
	G.EventManager = function(listen) {
//->	this._isPolling = false;
		this._q = [];			// Event queue
		this._man = [];			// Active managers
		
		for (var i = 0; i < managers.length; i++) {
			if (listen & (1 << i)) {
				var man = new managers[i](this);
					man.init();
				this._man.push(man);
			}
		}
	};

	var stat = G.EventManager;
	
	stat._addManager = function(name, manager) {
		stat[name] = bit;
		bit <<= 1;				// For next manager registration
		managers.push(manager);
	};

	/* Inheritance and shortcut */
	var proto = G.EventManager.inherits(G.Object);
	
	proto.poll = function() {
		var i, o = this,
			man = this._man;
	
		if (!o._isPolling) {
			o._isPolling = true;
			for (i = 0; i < man.length; i++) {
				man[i].listen();
			}
		}

		// Prevent useless events registration
		clearTimeout(o._timerID);
		// Polling is reset here, but set again if _isPolling == false
		o._timerID = setTimeout(this._release.bind(this), 10000);
	
		var q = this._q;
		if (!q.length) {
			return null;
		}
		return q.shift();
	};
	
	proto._release = function() {
		var i, man = this._man;
		for (i = 0; i < man.length; i++) {
			man[i].release();
		}

		this._q = []; // clear Q
		this._isPolling = false;
	};

})();
