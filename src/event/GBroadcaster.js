/*
 * Gamalto.Broadcaster
 * -------------------
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

	/* Dependencies */
	gamalto.devel.using("Subscription");

	/**
	 * Creates messages manager object.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Broadcaster
	 * @augments Gamalto.Object
	 */
	var _Object = G.Broadcaster = function() {
		/**
		 * Dictionary of observers sorted by events.
		 *
		 * @protected
		 * @ignore
		 *
		 * @member {object.<string, array.<Gamalto.Subscription>>}
		 */
		this.observers_ = {};
	};

	/** @alias Gamalto.Broadcaster.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Subscribes to an event.
	 *
	 * @param  {string}   event
	 *         Name of the event.
	 * @param  {function} callback
	 *         Function to be called when an event occurs.
	 *
	 * @return {Gamalto.Subscription} Context to handle the subscription state.
	 */
	proto.subscribe = function(event, callback) {
		// Gets a reference to the observers list for this event
		var obs = (this.observers_[event] = this.observers_[event] || []);

		// Creates a new subscription object to help unsubscription...
		// makes sense, no? :)
		var sub = new G.Subscription(this, event, callback);

		// Adds the new subscriber info (...)
		obs.push(sub);

		return sub;
	};

	proto.unsubscribe = function(sub) {
		if (sub.owner === this) {
			var list = this.observers_[sub.event];
			var position = list.indexOf(sub);

			if (position != -1) {
				list.splice(position, 1);

				// Free ressources
				sub.dispose();
			}
		}
	};

	/**
	 * Sends an event and related data to the subscribers if any.
	 *
	 * @param  {string} event
	 *         Name of the event.
	 * @param  {...object} [vargs]
	 *         Event related data.
	 */
	proto.publish = function(event/*, ...vargs */) {
		var observers = this.observers_;

		if (observers && (observers = observers[event])) {
			var vargs = Array.prototype.slice.call(arguments, 1);

			for (var n = 0; n < observers.length; n++) {
				observers[n].notify_(vargs);
			}
		}
	};

})();
