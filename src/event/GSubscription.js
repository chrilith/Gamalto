/*
 * Gamalto.Subscription
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
	 * Creates a context to manage [broadcaster]{@link Gamalto.Broadcaster}
	 * subscriptions state. It is not meant to be use directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Subscription
	 * @augments Gamalto.Object
	 *
	 * @param  {Gamalto.Broadcaster}   owner
	 *         Parent subscription manager.
	 * @param  {string}   event
	 *         Name of the subscribed event.
	 * @param {function} callback
	 *        Function to be called when an event occurs.
	 */
	var _Object = G.Subscription = function(owner, event, callback) {
		/**
		 * Parent broadcaster.
		 *
		 * @readonly
		 *
		 * @member {Gamalto.Broadcaster}
		 * @alias Gamalto.Subscription#owner
		 */
		this.owner = owner;

		/**
		 * Related event.
		 *
		 * @readonly
		 *
		 * @member {string}
		 * @alias Gamalto.Subscription#event
		 */
		this.event = event;

		/**
		 * Function to be called when an event occurs.
		 *
		 * @protected
		 * @ignore
		 *
		 * @member {function}
		 */
		this.callback_ = callback;
	};

	/** @alias Gamalto.Subscription.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Notifies the subscriber that an event occured.
	 *
	 * @internal
	 * @ignore
	 *
	 * @param  {array.<object>} args
	 *         List of event related parameters.
	 */
	proto.notify_ = function(args) {
		this.callback_.apply(null, args);
	};

	/**
	 * Unsubscribes from the event and free related resources.
	 */
	proto.dispose = function() {
		// Make sure the reference has been removed
		this.owner.unsubscribe(this);
		this.owner = null;
		this.callback_ = null;
	};

})();
