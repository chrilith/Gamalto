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

	/* Dependencies */
	gamalto.require_("Promise");

	/**
	 * @constructor
	 */
	var Loop = function(func) {
		this.func_ = func;
	},

	/* Inheritance and shortcut */
	proto = Loop.prototype;

	proto.iterator_ = function(promise) {
		var that = this;

		setImmediate(function() {
			var value = that.func_.call(that);

			if (!value) {
				that.iterator_(promise);
			} else {
				if (!value.is(G.Promise)) {
					promise.resolve();
				} else {
					value.then(function(value) {
						if (value) {
							promise.resolve();
						} else {
							that.iterator_(promise);
						}
					});
				}
			}

		});
	};

	/* Helper */
	var _Object = G.Async = {};

	_Object.loop = function(func) {
		var promise = new G.Promise();
		new Loop(func).iterator_(promise);
		return promise;
	};

	_Object.immediate = function() {
		var promise = new G.Promise();

		setImmediate(function() {
			promise.resolve();
		});

		return promise;
	};

	_Object.delay = function(msecs) {
		var promise = new G.Promise();

		setTimeout(function() {
			promise.resolve();
		}, msecs);

		return promise;
	};

})();
