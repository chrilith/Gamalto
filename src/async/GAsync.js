/*********************************************************************************
 #################################################################################

 Gamalto.Async
 _____________

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 #################################################################################
 #################################################################################
  _________   _________   _________   _________   _        _________   _________
 |  _______| |_______  | |  _   _  | |_________| | |      |___   ___| |  _____  |
 | |  _____   _______| | | | | | | |  _________  | |          | |     | |     | |
 | | |____ | |  _____  | | | | | | | |_________| | |          | |     | |     | |
 | |_____| | | |_____| | | | | | | |  _________  | |_______   | |     | |_____| |
 |_________| |_________| |_| |_| |_| |_________| |_________|  |_|     |_________|

                       «< javascript development framework >»                    

 #################################################################################
 *********************************************************************************/

(function() {

	gamalto.devel.require("Promise");

	/**
	 * Simple object to asynchonously loop a function call.
	 *
	 * @constructor
	 * @ignore
	 * 
	 * @param {function} func
	 *        Function to loop.
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
	},
	_Promise = G.Promise,
	proto = Loop.prototype;

	/**
	 * Asynchonously loop the function until the returned value is true.
	 *
	 * @ignore
	 * 
	 * @param  {Gamalto.Promise} promise
	 *         Promise to resolve when the value is true.
	 * @param  {object} context
	 *         Calling context when calling the function.
	 */
	proto.iterator = function(promise, context) {
		var that = this;

		setImmediate(function() {
			var value = that.func_.call(context);

			if (!value) {
				that.iterator(promise, context);
			} else {
				if (!value.is(_Promise)) {
					promise.resolve();
				} else {
					value.then(function(value) {
						if (value) {
							promise.resolve();
						} else {
							that.iterator(promise, context);
						}
					});
				}
			}
		});
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
	 * @return {Gamalto.Promise}
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
		var promise = new _Promise();
		new Loop(func).iterator(promise, this);
		return promise;
	};

	/**
	 * Utility method to handle function execution as soon as possible.
	 * It is the counterpart of [loop()]{@link Gamalto.Async.loop} when no loop is required but a promise is.
	 * 
	 * @static
	 * 
	 * @return {Gamalto.Promise}
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
		var promise = new _Promise();

		setImmediate(function() {
			promise.resolve();
		});

		return promise;
	};

	/**
	 * Wait until the specified time elapses.
	 * 
	 * @static
	 * 
	 * @param  {number} msecs
	 *         Time to wait in millseconds.
	 * 
	 * @return {Gamalto.Promise}
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
		var promise = new _Promise();

		setTimeout(function() {
			promise.resolve();
		}, msecs);

		return promise;
	};

})();
