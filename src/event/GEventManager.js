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

	/**
	 * List of registered event managers.
	 *
	 * @type {array.<Gamalto.IEventHandler>}
	 */
	var handlers = [];

	/**
	 * Creates a synchronous event manager.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.EventManager
	 * @augments Gamalto.Object
	 *
	 * @param {number} listeners
	 *        Bitmask of events to listen to.
	 */
	var _Object = G.EventManager = function(listeners) {
		/**
		 * Whether event handlers have been initialized.
		 *
		 * @private
		 *
		 * @member {boolean}
		 */
		this.polling_ = false;

		/**
		 * Event queue.
		 *
		 * @internal
		 * @ignore
		 *
		 * @member {array.<Gamalto.Event>}
		 */
		this.q_ = [];

		/**
		 * List of active event handlers.
		 *
		 * @private
		 *
		 * @member {array.<Gamalto.IEventHandler>}
		 */
		this.hdr_ = [];

		/**
		 * Timer to automatically stop polling when idle.
		 *
		 * @private
		 *
		 * @member {mumber}
		 */
		this.timerID_ = 0;

		for (var i = 0; i < handlers.length; i++) {
			if (listeners & (1 << i)) {
				// Instanciate the event handler
				var handler = new handlers[i](this);

				// Initialize it
				handler.init();

				// And same the instance
				this.hdr_.push(handler);
			}
		}
	};

	/** @alias Gamalto.EventManager.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Polls for events.
	 *
	 * @return {Gamalto.Event} Next event in the queue if any or null.
	 */
	proto.poll = function() {
		var q = this.q_;
		var handlers = this.hdr_;

		// Start to listen for event if not already started
		if (!this.polling_) {
			this.polling_ = true;

			for (var i = 0; i < handlers.length; i++) {
				handlers[i].listen();
			}
		}

		// Prevent useless events registration
		clearTimeout(this.timerID_);

		// Polling is reset here (but will be set again if polling_ == false)
		this.timerID_ = setTimeout(this.release_.bind(this), 10000);

		return (q.length) ? q.shift() : null;
	};

	/**
	 * Gets a registered event handler.
	 *
	 * @param  {number} bit
	 *         Defined bit of the wanted handler.
	 *
	 * @return {Gamalto.IEventHandler} Requested handler or null if not found.
	 */
	proto.getHandler = function(x) {
		// As defined in malloc.c in the GNU C Library (glibc)
		gamalto.devel.assert(((x !== 0) && !(x & (x - 1))),
			"Parameter is not a power of 2.");

		return this.hdr_[x >> 1] || null;
	};

	/**
	 * Stops event listening.
	 *
	 * @private
	 */
	proto.release_ = function() {
		this.hdr_.forEach(function(handler) {
			handler.release();
		});

		this.q_.length = 0;
		this.polling_ = false;
	};

	/**
	 * Miximum queue size.
	 *
	 * @internal
	 * @ignore
	 *
	 * @constant {mumber}
	 */
	_Object.LIMIT = 128;

	/**
	 * Adds an event handler object to the factory.
	 *
	 * @internal
	 * @ignore
	 *
	 * @param {string} name
	 *        name of the property to add.
	 * @param {Gamalto.IEventHandler} handler
	 *        Object implementing Gamalto.IEventHandler.
	 */
	_Object.addObject_ = function(name, handler) {
		_Object[name] = 1 << handlers.length;
		handlers.push(handler);
	};

	/**
	 * Defines an event handler.
	 *
	 * @memberof Gamalto
	 * @interface IEventHandler
	 */

	/**
	 * Initializes the event handler.
	 *
	 * @function
	 * @name Gamalto.IEventHandler#init
	 */

	/**
	 * Starts listening to events.
	 *
	 * @function
	 * @name Gamalto.IEventHandler#listen
	 */

	/**
	 * Stops listening to events.
	 *
	 * @function
	 * @name Gamalto.IEventHandler#release
	 */

})();
