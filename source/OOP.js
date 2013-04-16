/*
 * Gamalto Extensions for OOP
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

	var object	= Object.prototype,
		func	= Function.prototype;

	/* Allows call of the base object constructor */
	if (!("base" in Object)) {
		Object.base = function (that) {
			var base = arguments.callee.caller.__base;
			if (base) {
				return base.apply(that, Array.prototype.slice.call(arguments, 1));
			} else {
				throw "Attempt to call a base method/constructor on a first level object.";
			}
		}
	}

	/* Tests if an object implements an given object definition */
	if (!("is" in object)) {
		Object.defineProperty(object, "is", {
			enumerable: false,
			value: function(o) {
				return this instanceof o;
			}
		});
	}
	
	/* Object inheritance */
	if (!("inherits" in func)) {
		func.inherits = function(baseObject) {
			baseObject = (baseObject._generic || baseObject);
			this.__base = baseObject;

			function ctor() {};
			this.base = ctor.prototype = baseObject.prototype;
			(this.prototype = new ctor()).constructor = this;

			return this.prototype;
		}
	}

})();
