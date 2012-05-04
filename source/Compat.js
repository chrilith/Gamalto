/*
 * JavaScript Compatibility Helper
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

	/* Member prefixes */
	var prefix = [
		"moz",
		"Moz",		// Used with .style
		"webkit",
		"WebKit",	// For objects (WebKitCSSMatrix...)
		"o",
		"O",		// Used with .style
		"ms"		
	],

	/* CSS property prefixes */
	prop = [
		"",			// Standard property
		"-moz-",	// Mozilla
		"-webkit-",	// WebKit
		"-o-",		// Opera
		"-ms-"		// Internet Explorer
	],

	/* We are about to extent the base object of all JavaScript objects! */
	op = Object.prototype;

	/**
		@param {String} name  The name of the member for which you want the
							  browser specific name.
		@returns {String}	  The browser specific name if any or 'undefined'.
	*/
	op.getMemberName = function(name) {
		var n, i, u,		// = undefined
			owner = this;

		if (owner[name] !== u) {
			return name;
		}
		// Get the name to be extended
		name = name[0].toUpperCase() + name.substr(1);
		for (i = 0; i < prefix.length; i++) {
			n = prefix[i] + name;
			if (n in owner) {
				return n;
			}
		}
		return u;
	}

	/**
		@param {String} name  The name of the member you want to get the value.
		@returns {Object}	  The value of the member if any.
	*/
	op.getMember = function(name) {
		var u,				// = undefined
			owner = this,
			n = owner.getMemberName(name);
		return !n ? u : owner[n];
	}

	/**
		@param {String} name  The name of the member you want to set the value.
		@param {Object} value The value to be set.
		@returns {Boolean}	  Whether the value has been set.
	*/
	op.setMember = function(name, value) {
		var n, i, owner = this;

		// Get the correct member name if any
		if (!(name = owner.getMemberName(name))) {
			return false;	
		// Empty value or not a string? set it directly
		} else if (!value || typeof value != "string") {
			owner[name] = value;
			return true;
		}
		// Try to set the member value (mainly for CSS props...)
		for (var i = 0; i < prop.length; i++) {
			n = prop[i] + value;
			owner[name] = n;
			if (owner[name] == n) {
				return true;
			}
		}
		return false;
	}

	/**
		This method let you to defined an existing browser specific method
		with a standard name and use this standard version directly in your code.
		The 'fb' parameter is optional.

		@param {Object}   owner The target object of the method.
		@param {String}	  name  The name of the method to be defined.
		@param {Function} fb    The fallback function to be used.
		@returns {Boolean}	    Whether the method has been properly set.		
	*/
	Object.defineMethod = function(owner, name, fb) {
		return owner[name] ? true : !!(owner[name] = owner.getMember(name) || fb);
	}

})();
