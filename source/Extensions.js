/*
 * Gamalto Extensions to Standard Objects
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

/* To work with objects */

Object.defineMethod(Object.prototype, "is", function(o) {
	return this instanceof o;
});

Object.defineMethod(Object.prototype, "implements", function(o) {
	return this == o || this.prototype instanceof o;
});

Object.defineMethod(Function.prototype, "inherits", function(baseClass) {
	baseClass = (baseClass._generic || baseClass);

	this.__base__  = baseClass;
	this.__super__ = baseClass.prototype;

	function ctor() {};
	this.base = ctor.prototype = this.__super__;

	(this.prototype = new ctor()).constructor = this;

	return this.prototype;
});

(function() {
	var types = [];
		
	function create(type, base) {
		if (!type) {
			throw TypeError();
		}

		for (var i = 0; i < types.length; i++) {
			if (types[i].base == base && types[i].T == type) {
				return types[i].ctor;
			}
		}
	
		var generic = function() {
			this._T = type;
			base.apply(this, Array.prototype.slice.call(arguments, 0));
		};
		generic.inherits(base);
		types.push({ base: base, T: type, ctor: generic });

		return generic;
	}

	Object.defineMethod(Function.prototype, "genericize", function(base) {
		var that = this,
			master = function(T) {
				return create(T, that);
			};
		master._generic = that;
		return master;
	});

})();

/* Extra Math methods */

Object.defineMethod(Math, "sign", function(n) {
	return n > 0 ? +1 : n < 0 ? -1 : 0;
});

/* Faster versions */

Object.defineMethod(Math, "fabs", function(n) {
	return n > 0 ? n : -n;
});

Object.defineMethod(Math, "fmin", function(x, y) {
	return x < y ? x : y;
});

Object.defineMethod(Math, "fmax", function(x, y) {
	return x > y ? x : y;
});
