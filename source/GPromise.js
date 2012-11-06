/*
 * Gamalto.Promise
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
	
	var STATE_PENDING	= 0,
		STATE_PROGRESS	= 1,
		STATE_RESOLVED	= 2,
		STATE_REJECTED	= 3/*,
		STATE_CANCELED	= 4 TODO ?*/;

	/**
	 * @constructor
	 */
	G.Promise = function() {}
	
	/* Inheritance and shortcut */
	var proto = G.Promise.inherits(G.Object);
	
	proto.resolve = function(value) {
		this._complete(STATE_RESOLVED, value);
	}
		
	proto.reject = function(value) {
		this._complete(STATE_REJECTED, value);
	}

	proto.progress = function(value) {
		var func = this._progress;
		if (func) { func.apply(func, value); }
	}
	
	proto._complete = function(state, value) {
		var func;

		if (this._state > STATE_PROGRESS) {
			return;
		}
		this._state = state;
		this.value = value;

		switch (state) {
			case STATE_RESOLVED:
				func = this._resolve;
				break;
			case STATE_REJECTED:
				func = this._reject;
				break;
		}

		if (func) { func(value); }
	}

	proto.then = function(resolve, reject, progress) {
		var undef, promise = new G.Promise();

		// Set the "resolve" callback
		this._resolve = function(value) {
			value = !resolve ? undef : resolve(value);
			
			// Prepare internal callback
			var complete = function(value) {
				try {
					value = promise.resolve(value);
				 } catch(e) {
					promise.reject(e);
				 }
				return value;
			}
			
			// If the value is not a promise, call the callback immediately
			if (!(value && value.is(G.Promise))) {
				complete(value);
			
			// Else, wait for the new promise completion
			} else {
				value.then(
					function(value) {
						return complete(value);
					},
					function(e) {
						promise.reject(e);
					}
				)
			}
		}

		// Set the "reject" callback, this one cuts the pipeline
		this._reject = function(value) {
			value = !reject ? undef : reject(value);
			promise.reject(value);
		}

		// Progression callback if any
		this._progress = progress;

		// Return the new promise for pipelining
		return promise;
	}
	
	G.Promise.all = function(/* args */) {
		// Get all promises to be completed
		var all = Array.prototype.slice.call(arguments, 0),
			count = 0,
			results = [];
			promise = new G.Promise();

		// For each promise
		all.forEach(function(value, i) {
			// Add completions callbacks for the current promise...
			all[i].then(
				// ...for success
				function(value) {
					// save the result
					results[i] = value;
					// set progression
					promise.progress(count++ / all.length);
					
					// Completion
					if (count == all.length) {
						promise.resolve(results);
					}
				},
				// ...for errors
				function(error) {
					promise.reject(error);
				}
			);
		});
		
		return promise;
	}
	
})();