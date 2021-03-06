/*
 * Gamalto.Async
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

	/* Aliases */
	var _Promise = Promise;

	/**
	 * Simple object to asynchonously loop a function call.
	 *
	 * @constructor
	 * @ignore
	 *
	 * @param  {function} func
	 *         Function to loop.
	 */
	var Loop = function(func) {
		/**
		 * Function to loop.
		 *
		 * @ignore
		 * @private
		 *
		 * @member {function}
		 */
		this.func_ = func;
	};

	var proto = Loop.inherits(G.Object);

	/**
	 * Asynchonously loop the function until the returned value is true.
	 *
	 * @ignore
	 *
	 * @param  {Promise} promise
	 *         Promise to resolve when the value is true.
	 * @param  {object} context
	 *         Calling context when calling the function.
	 */
	proto.iterator = function(resolve, context) {
		setImmediate(function() {
			var value = this.func_.call(context);

			if (!value) {
				this.iterator(resolve, context);
			} else {
				if (!value.is(_Promise)) {
					resolve();
				} else {
					value.then(function(value) {
						if (value) {
							resolve();
						} else {
							this.iterator(resolve, context);
						}
					});
				}
			}
		}.bind(this));
	};

	/**
	 * Helper object to handle asynchronous execution.
	 *
	 * @namespace
	 * @memberof Gamalto
	 * @augments Gamalto.Object
	 *
	 * @alias Gamalto.Async
	 */
	var _Object = G.Async = new G.Object();

	/**
	 * Asynchonously loop a function call.
	 * Equivalent to a <code>do {...} until(...)</code> statement.
	 *
	 * @static
	 *
	 * @param  {function} func
	 *         Function to loop.
	 *
	 * @return {Promise}
	 *         Promise to handle loop completion.
	 *
	 * @example
	 * var i = 1;
	 *
	 * Gamalto.Async.loop(function() { // do
	 *     gamalto.devel.log("Async.loop()", i);
	 *     return (i++ == 5); // until
	 *
	 * }).then(function() {
	 *     gamalto.devel.log("Done!");
	 * });
	 */
	_Object.loop = function(func) {
		return new _Promise(function(resolve) {
			new Loop(func).iterator(resolve, this);
		}.bind(this));
	};

	/**
	 * Utility method to handle function execution as soon as possible.
	 * It is the counterpart of [loop()]{@link Gamalto.Async.loop} when no loop
	 * is required but a promise is.
	 *
	 * @static
	 *
	 * @return {Promise}
	 *         Promise to handle function execution.
	 *
	 * @example
	 * process([]).then(function() {
	 *     gamalto.devel.log("Done!");
	 * });
	 *
	 * function process(data) {
	 *     if (data.length) {
	 *         return Gamalto.Async.loop(function() {
	 *             gamalto.devel.log("Popping:", data.pop());
	 *             return (data.length == 0);
	 *         });
	 *     }
	 *     return Gamalto.Async.immediate();
	 * }
	 */
	_Object.immediate = function() {
		return new _Promise(function(resolve) {
			setImmediate(resolve);
		});
	};

	/**
	 * Wait until the specified time has elasped.
	 *
	 * @static
	 *
	 * @param  {number} msecs
	 *         Time to wait in millseconds.
	 *
	 * @return {Promise}
	 *         Promise to handle wait completion.
	 *
	 * @example
	 * var i = 1;
	 *
	 * Gamalto.Async.loop(function() {
	 *     gamalto.devel.log("Async.loop()", i);
	 *     if (i++ == 5) {
	 *          return this.delay(2000);
	 *     }
	 *     return (i > 10);
	 *
	 * }).then(function() {
	 *     gamalto.devel.log("Done!");
	 * });
	 */
	_Object.delay = function(msecs) {
		return new _Promise(function() {
			setTimeout(resolve, msecs);
		});
	};

})();
