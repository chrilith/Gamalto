/*
 * Gamalto.Promise
 * ---------------
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

	// TODO: comply to Promise/A+ / ES6

	var STATE_PENDING	= 0;
	var STATE_PROGRESS	= 1;
	var STATE_RESOLVED	= 2;
	var STATE_REJECTED	= 3;
	var STATE_CANCELED	= 4;

	/**
	 * Creates a new promise object to handle the completion of
	 * asynchronous actions.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Promise
	 * @augments Gamalto.Object
	 */
	var _Object = G.Promise = function() {
		this.resolve_ = [];
		this.reject_ = [];
		this.progress_ = [];
		this.state_ = STATE_PENDING;
	};

	/** @alias Gamalto.Promise.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Resolves the promise and call the completion callbacks if any.
	 *
	 * @param  {object} [value]
	 *         Resulting value of the action.
	 */
	proto.resolve = function(value) {
		this.complete_(STATE_RESOLVED, value);
	};

	/**
	 * Rejects the promise and call the completion callbacks if any.
	 *
	 * @param  {string} reason
	 *         Reason of the rejection. Usually the raised exception message
	 *         which has lead to the rejection.
	 */
	proto.reject = function(reason) {
		this.complete_(STATE_REJECTED, reason);
	};

	/**
	 * Calls the progress callbacks if any.
	 */
	proto.progress = function(value) {
		this.progress_.forEach(function(progress) {
			setImmediate(progress, value);
		});
	};

	/**
	 * Cancels the promise and calls the reject completion callbacks if any.
	 * The method has the same behavior of the
	 * {@linkcode Gamalto.Promise#reject} method. The reason is implicit
	 * and will be an exception with the message: *Canceled*.
	 */
	proto.cancel = function() {
		this.complete_(STATE_CANCELED, new Error("Canceled"));
	};

	proto.complete_ = function(state, value) {
		if (this.state_ <= STATE_PROGRESS) {
			this.state_ = state;
		}
		this.completed_(value);
	};

	proto.completed_ = function(value) {
		var func;

		switch (this.state_) {
			case STATE_RESOLVED:
				func = this.resolve_;
				break;
			case STATE_CANCELED:
			case STATE_REJECTED:
				func = this.reject_;
				break;
		}

		if (func) { this.exec_(func, value); }
		this.value = value;
	};

	proto.exec_ = function(func, value) {
		while (func.length) {
			setImmediate(func.shift(), value);
		}
	};

	proto.prepare_ = function(resolver) {
		var that = this;
		return function(value) {
			return that.resolver_(value, resolver);
		};
	};

	proto.resolver_ = function(value, resolver) {
		try {
			value = (resolver || this.resolve)(value);
		} catch(e) {
			gamalto.devel.warn("Promise rejected", e);
			this.reject(e);
		}
		return value;
	};

	/**
	 * Defines the callbacks to be used upon action completion or error.
	 * The sucess callback can return a new promise, this is why a promise
	 * is always returned by `then()`. This allows actions pipelining and
	 * eases code readability.
	 *
	 * @param  {CompletionFunc} [resolve]
	 *         Callback to be called upon action success.
	 * @param  {CompletionFunc} [reject]
	 *         Callback to be called upon action error.
	 * @param  {CompletionFunc} [progress]
	 *         Callback to be called to handle action progression notification.
	 *
	 * @return {Gamalto.Promise} New promise to handle the completion
	 * of another action.
	 */
	proto.then = function(resolve, reject, progress) {
		var undef;
		var promise = new G.Promise();

		// Set the "resolve" callback
		this.resolve_.push(function(value) {
			value = promise.resolver_(value, resolve);

			// Prepare internal callback
			var complete = promise.prepare_(function(value) {
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
				);
			}
		});

		// Set the "reject" callback, this one cuts the pipeline
		this.reject_.push(promise.prepare_(function(value) {
			value = !reject ? undef : reject(value);
			promise.resolve(value);

		}));

		if (this.state_ > STATE_PROGRESS) {
			this.completed_(this.value);
		} else {
			// Progression callback if any
			if (progress) {
				this.progress_.push(progress);
			}
		}

		// Return the new promise for pipelining
		return promise;
	};

	/**
	 * Waits for all the promises.
	 *
	 * @kind function
	 * @name all
	 * @memberof Gamalto.Promise
	 *
	 * @param  {...Gamalto.Promise} vargs
	 *         A list of promises to wait for.
	 *
	 * @return {Gamalto.Promise} A new promise to handle completions.
	 */
	_Object.all = function(/*: vargs */) {
		// Get all promises to be completed
		var all = Array.prototype.slice.call(arguments, 0);
		var count = 0;
		var results = [];
		var promise = new G.Promise();

		// For each promise
		all.forEach(function(value, i) {
			// Add completions callbacks for the current promise...
			all[i].then(

				// ...for success
				function(value) {

					// Save the result
					results[i] = value;

					// Set progression
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
	};

	/* Callbacks */

	/**
	 * Completion callback.
	 * @callback CompletionFunc
	 * @param  {object} [value]
	 *         Result object.
	 */

})();
