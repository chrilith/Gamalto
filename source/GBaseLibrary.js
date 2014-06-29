/*
 * Gamalto.BaseLibrary
 * 
 * This file is part of the Gamalto framework
 * http://www.gamalto.com/
 *

Copyright (C)2012-2014 Chris Apers and The Gamalto Project, all rights reserved.

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

	/* Dependencies */
	gamalto.using_("Promise");

	/**
	 * Base object to implement resources managers. It's not meant to be used directly in the client code.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BaseLibrary
	 * @augments Gamalto.Object
	 */
	 var _Object = G.BaseLibrary = function() {
		this._list = {};
		this._pending = [];
	}
	
	/** @alias Gamalto.BaseLibrary.prototype */
	var proto = _Object.inherits(G.Object);
	
	/**
	 * Gets a resource from the library.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 * @returns {object} The requested item if it exists.
	 */
	proto.getItem = function(name) {
		return this._list[G.N(name)];
	}
	
	/**
	 * Releases the resource.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 */
	proto.unloadItem = function(name) {
		delete this._list[G.N(name)];
	}

	/**
	 * Tries to load a new resource into the library.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 * @param {string} src
	 *     The location of the item to load.
	 * @returns {Gamalto.Promise} A promise to handle the loading states.
	 */
	proto.loadItem = function(name, src) {
		return new G.Promise();
	}

	/**
	 * Pushes a new resource into the list.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 * @param {string} src
	 *     The location of the item to load.
	 */
	proto.pushItem = function(name, src) {
		gamalto.assert_(!this._loading, "The libary is already loading items.");
		// Here we can have more than just 'src', save all parameters
		this._pending.push(Array.prototype.slice.call(arguments, 0));
	}
	
	/**
	 * Tries to load all the resources pushed into the library.
	 *
	 * @returns {Gamalto.Promise} A promise to handle the loading states.
	 */
	proto.load = function() {
		this._exception();
		this._loading = true;

		var that = this,
			args = [],
			promise = new G.Promise();

		this._pending.forEach(function(val, i) {
			args.push(that.loadItem.apply(that, val));
		});

		G.Promise.all.apply(null, args)
			.then(
				function(value) {
					that._loading = false;
					that._pending = [];
					promise.resolve(value);
				},
				function(error) {
					that._loading = false;
					promise.reject(error);
				},
				function(value) {
					promise.progress(value);
				}
			);

		return promise;
	}

	proto._add = function(name, item) {
		this._list[G.N(name)] = item;
	}
	
	proto._failed = function(name, src, e) {
		var err = new Error("Failed to load item '" + name + "' from '" + src + "'.");
		err.source	= this;
		err.item = name;
		err.innerException = e;
		return err;
	}
	
	/**
	 * Tests whether a resource is available.
	 *
	 * @param {string} name
	 *     The name of the resource.
	 * @returns {boolean} Returns true is the resource exists and has been properly loaded.
	 */
	proto.hasItem = function(name) {
		var u;	// undefined
		return this._list[G.N(name)] !== u;
	}

})();
