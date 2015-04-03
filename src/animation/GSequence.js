/*
 * Gamalto.Sequence
 * ----------------
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
	gamalto.devel.require("Animator");

	/**
	 * Creates a new events sequence.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Sequence
	 * @augments Gamalto.Animator
	 *
	 * @example
	 * var seq = new Gamalto.Sequence();
	 */
	var _Object = G.Sequence = function() {
		this.list_ = [];
		this.time_ = [];
		Object.base(this);
	},
	
	/** @alias Gamalto.Sequence.prototype */
	proto = _Object.inherits(G.Animator);
	
	/**
	 * Adds a new event to the sequence.
	 * 
	 * @param  {ISequence} inst
	 *         Instance of a {@link ISequence} object.
	 * @param  {number} duration
	 *         Event duration.
	 *
	 * @return {Gamalto.Sequence} Current object for chaining.
	 */
	proto.add = function(inst, duration) {
		this.list_.push(inst);
		this.time_.push(duration);
		return this;
	};

	/**
	 * Updates the sequence state.
	 * 
	 * @param  {Gamalto.Timing} timer
	 *         [Timer]{@link Gamalto.Timing} object from which the elpased time will be read.

	 * @return {number} Current playing event.
	 */
	proto.update = function(timer) {
		var p = this.progress | 0,	// remove fractional part for comparison
			was = this.playing,
			now = _Object.base.update_.call(this, timer, false, this.time_),
			i = this.progress | 0;	// changed but update_() call

		// TODO: an action may be skipped upon slowdown. Add a strict parameter
		// to for complete sequence execution? Important if an action has some
		// dependance with a previous one...
		if (!was || p !== i) {
			if (was) { this.call_("exiting", p, timer); }
			if (now) { this.call_("entering", i, timer); }
		}
		if (now) { this.call_("update", i, timer); }

		return now;
	};

	/**
	 * Calls the given event method if it exists.
	 *
	 * @private
	 * @ignore
	 * 
	 * @param  {string} method
	 *         Method name.
	 * @param  {number} exec
	 *         Event index.
	 * @param  {object} data
	 *         Extra data. Usually the timer object.
	 */
	proto.call_ = function(method, exec, data) {
		if ((exec = this.list_[exec]) && exec[method]) {
			exec[method](data);
		}
	};

	/**
	 * Defines methods to handle sequencial events execution.
	 * 
	 * @memberof Gamalto
	 * @interface ISequence
	 *
	 * @example
	 * // Interface members
	 * var seq = {
	 *     entering: function(timer) { ... },
	 *     update  : function(timer) { ... },
	 *     exiting : function(timer) { ... }
	 * };
	 */

	/**
	 * Initializes the sequence.
	 *
	 * @function
	 * @name Gamalto.ISequence#entering
	 *
	 * @param {Gamalto.Timing} timer
	 *        {@link Gamalto.Timing} object from which the elpased time will be read.
	 */

	/**
	 * Updates the sequence state.
	 *
	 * @function
	 * @name Gamalto.ISequence#update
	 *
	 * @param {Gamalto.Timing} timer
	 *        {@link Gamalto.Timing} object from which the elpased time will be read.
	 */

	/**
	 * Cleans up the sequence.
	 *
	 * @function
	 * @name Gamalto.ISequence#exiting
	 *
	 * @param {Gamalto.Timing} timer
	 *        [Timer]{@link Gamalto.Timing} object from which the elpased time will be read.
	 */

})();
