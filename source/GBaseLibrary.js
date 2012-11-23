/*
 * Gamalto.BaseLibrary
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

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
made using this middleware.

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
	gamalto.using("Promise");

	/**
	 * @constructor
	 */
	G.BaseLibrary = function() {
		this._list = {};
		this._pending = [];
	}
	
	/* Inheritance and shortcut */
	var proto = G.BaseLibrary.inherits(G.Object);
	
	proto.getItem = function(name) {
		return this._list[G.N(name)];
	}
	
	proto.unloadItem = function(name) {
		delete this._list[G.N(name)];
	}

	proto.loadItem = function(name, src) {
		return new G.Promise();
	}

	proto.pushItem = function(name, src) {
		this._exception();
		// Here we can have more than just 'src', save all parameters
		this._pending.push(Array.prototype.slice.call(arguments, 0));
	}
	
	proto.load = function() {
		this._exception();
		this._loading = true;

		var that = this,
			args = [];

		this._pending.forEach(function(val, i) {
			args.push(that.loadItem.apply(that, val));
		});

		return G.Promise.all.apply(null, args)
			.then(
				function(value) {
					that._loading = false;
					that._pending = [];
					return value;
				},
				function(error) {
					that._loading = false;
					return error;
				}
			);
	}
	
	proto._failed = function(name, src, e) {
		var err = new Error("Failed to load item '" + name + "' from '" + src + "'.");
		err.source	= this;
		err.item = name;
		err.innerException = e;
		return err;
	}
	
	proto._exception = function() {
		if (this._loading) {
			throw "The libary is already loading items.";		
		}
	}
	
	proto.hasItem = function(name) {
		var u;	// undefined
		return this._list[G.N(name)] !== u;
	}

})();
