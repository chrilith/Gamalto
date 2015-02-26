/*
 * Gamalto.Promise
 * 
 * This file is part of the Gamalto framework
 * http://www.gamalto.com/
 *

Copyright (C)2011-2014 Chris Apers and The Gamalto Project, all rights reserved.

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
	
	var STATE_PENDING	= 0,
		STATE_PROGRESS	= 1,
		STATE_RESOLVED	= 2,
		STATE_REJECTED	= 3,
		STATE_CANCELED	= 4;

	/**
	 * Creates a new promise object to handle the completion of asynchronous actions.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Promise
	 * @augments Gamalto.Object
	 */
	var _Object = G.Promise = function() {
		this._resolve = [];
		this._reject = [];
		this._progress = [];
		this._state = STATE_PENDING;
	}
	
	/** @alias Gamalto.Promise.prototype */
	var proto = _Object.inherits(G.Object);
	
	/**
	 * Resolves the promise and call the completion callbacks if any.
	 *
	 * @param {object} [value]
	 *     The resulting value of the action.
	 */
	proto.resolve = function(value) {
		this._complete(STATE_RESOLVED, value);
	}
	
	/**
	 * Rejects the promise and call the completion callbacks if any.
	 *
	 * @param {string} reason
	 *     The reason of the rejection. Usually the raised exception message which has lead to the rejection.
	 */
	proto.reject = function(reason) {
		this._complete(STATE_REJECTED, reason);
	}

	/**
	 * Calls the progress callbacks if any.
	 */
	proto.progress = function(value) {
		var progress = this._progress;
		for (var i = 0; i < progress.length; i++) {
			setImmediate(progress[i], value);
		}
	}

	/**
	 * Cancels the promise and calls the reject completion callbacks if any.
	 * The method has the same behavior of the {@linkcode Gamalto.Promise#reject} method. The reason is implicit and will be an exception with the message: *Canceled*.
	 */
	proto.cancel = function() {
		this._complete(STATE_CANCELED, new Error("Canceled"));
	}

	proto._complete = function(state, value) {
		if (this._state <= STATE_PROGRESS) {
			this._state = state;
		}
		this._completed(value);
	}

	proto._completed = function(value) {
		var func;

		switch (this._state) {
			case STATE_RESOLVED:
				func = this._resolve;
				break;
			case STATE_CANCELED:
			case STATE_REJECTED:
				func = this._reject;
				break;
		}

		if (func) { this._exec(func, value); }
		this.value = value;
	}

	proto._exec = function(func, value) {
		while (func.length) {
			setImmediate(func.shift(), value);
		}
	}

	proto._prepare = function(resolver) {
		var that = this;
		return function(value) {
			return that._resolver(value, resolver);
		}
	}

	proto._resolver = function(value, resolver) {
		try {
			value = (resolver || this.resolve)(value);
		} catch(e) {
			gamalto.warn_("Promise rejected", e);
			this.reject(e);
		}
		return value;		
	}

	/**
	 * Defines the callbacks to be used upon action completion or error.
	 * The sucess callback can return a new promise, this is why a promise is always returned by `then()`. This allows actions pipelining and eases code readability.
	 *
	 * @param {CompletionFunc} [resolve]
	 *     A callback to be called upon action success.
	 * @param {CompletionFunc} [reject]
	 *     A callback to be called upon action error.
	 * @param {CompletionFunc} [progress]
	 *     A callback to be called to handle action progression notification.
	 *
	 * @returns {Gamalto.Promise} A new promise to handle the completion of another action.
	 */
	proto.then = function(resolve, reject, progress) {
		var undef, promise = new G.Promise();

		// Set the "resolve" callback
		this._resolve.push(function(value) {
			value = promise._resolver(value, resolve);

			// Prepare internal callback
			var complete = promise._prepare(function(value) {
				promise.resolve(value);
			});

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
		});

		// Set the "reject" callback, this one cuts the pipeline
		this._reject.push(promise._prepare(function(value) {
			value = !reject ? undef : reject(value);
			promise.resolve(value);

		}));

		if (this._state > STATE_PROGRESS) {
			this._completed(this.value);
		} else {
			// Progression callback if any
			if (progress) {
				this._progress.push(progress);
			}
		}

		// Return the new promise for pipelining
		return promise;
	}
	
	/**
	 * Waits for all the promises.
	 *
	 * @kind function
	 * @name all
	 * @memberof Gamalto.Promise
	 *
	 * @param {...Gamalto.Promise} vargs
	 *     A list of promises to wait for.
	 * @returns {Gamalto.Promise} A new promise to handle completions.
	 */
	_Object.all = function(/* vargs */) {
		// Get all promises to be completed
		var all = Array.prototype.slice.call(arguments, 0),
			count = 0,
			results = [],
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

	/* Callbacks */

	/**
	 * Completion callback.
	 * @callback CompletionFunc
	 * @param {object} [value]
	 *     A result object.
	 */

})();
