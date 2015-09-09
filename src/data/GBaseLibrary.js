/*
 * Gamalto.BaseLibrary
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

	/**
	 * Base object to implement resources managers. It's not meant to be used directly by the client code.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BaseLibrary
	 * @augments Gamalto.Object
	 */
	var _Object = G.BaseLibrary = function() {
		this.list_ = {};
		this.pending_ = [];
	};

	/** @alias Gamalto.BaseLibrary.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Gets a resource from the library.
	 *
	 * @param  {string} name
	 *         Name of the resource.
	 *
	 * @return {object} Requested item if it exists.
	 */
	proto.getItem = function(name) {
		return this.list_[G.N(name)];
	};

	/**
	 * Releases the resource.
	 *
	 * @param  {string} name
	 *         Name of the resource.
	 */
	proto.unloadItem = function(name) {
		delete this.list_[G.N(name)];
	};


	/**
	 * Tries to load a new resource into the library.
	 *
	 * @function
	 * @name Gamalto.BaseAnimation#draw_
	 *
	 * @protected
	 * @abstract
	 * @ignore
	 *
	 * @param  {string} name
	 *          Name of the resource.
	 * @param  {string} src
	 *          Location of the item to load.
	 * @param  {...object} [vargs]
	 *          Extra parameters.
	 *
	 * @return {Promise} Promise to handle the loading states.
	 */

	/**
	 * Pushes a new resource into the list.
	 *
	 * @param  {string} name
	 *         Name of the resource.
	 * @param  {string} src
	 *         Location of the item to load.
	 */
	proto.pushItem = function(name, src/*, vargs*/) {
		gamalto.devel.assert(!this.loading_, "The libary is already loading items.");
		// Here we can have more than just 'src', save all parameters
		this.pending_.push(Array.prototype.slice.call(arguments, 0));
	};

	/**
	 * Tries to load all the resources pushed into the library.
	 *
	 * @return {Promise} Promise to handle the loading states.
	 */
	proto.load = function() {
		gamalto.devel.assert(!this.loading_, "The libary is already loading items.");
		this.loading_ = true;

		return new Promise(function(resolve, reject) {

			var args = [];
			this.pending_.forEach(function(val) {
				args.push(this.loadItem.apply(this, val));
			}, this);

			var promise = Promise.all(args)
				.then(
					function(value) {
						this.loading_ = false;
						this.pending_.length = 0;
						resolve(value);
					}.bind(this),

					function(reason) {
						this.loading_ = false;
						reject(reason);
					}.bind(this));

		}.bind(this));
	};

	proto.add_ = function(name, item) {
		this.list_[G.N(name)] = item;
	};

	proto.failed_ = function(name, src, e) {
		var err = new Error("Failed to load item '" + name + "' from '" + src + "'.");
		err.source	= this;
		err.item = name;
		err.innerException = e;
		return err;
	};

	/**
	 * Tests whether a resource is available.
	 *
	 * @param  {string} name
	 *         Name of the resource.
	 *
	 * @return {boolean} True is the resource exists and has been properly loaded.
	 */
	proto.hasItem = function(name) {
		var undef;
		return this.list_[G.N(name)] !== undef;
	};

})();
