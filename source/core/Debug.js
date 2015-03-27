/*
 * Gamalto Debug Tools
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

/** @define {boolean} */
var GAMALTO_DEBUG = true;
if (GAMALTO_DEBUG) (function() {

/* Private */
	var _using = {},
		 debug = gamalto;

	debug.using_ = function(name) {
		_using["D__" + name] = 1;
	}
	
	debug.require_ = function(name) {
		debug.assert_(G[name], 'Gamalto dependency error ["' + name + '"].');
	}
	
	debug.checkDependencies__ = function() {
		for (var use in _using) {
			if (use.substr(0, 3) == "D__") {
				var module = use.substr(3);
				debug.assert_(G[module], 'Gamalto cannot find module ["' + module + '"].');
			}
		}	
	}

	debug.assert_ = function(cond, message) {
		if (!cond) {
			var err = new Error();
			message  = "Assertion failed" + (message ? " : " + message : "");
			if (err.stack) {
				message += ", " + err.stack.split("\n")[2].replace(/\s*(.+?)\s*/, "$1");
			}
			err.message = message;
			throw err;
		}
	}

	debug.error_ = function() {
		console.error.apply(console, arguments);
	}

	debug.log_ = function() {
		console.log.apply(console, arguments);
	}

	debug.warn_ = function() {
		console.warn.apply(console, arguments);
	}

	// TODO: move to ReadableStream
	debug.mem_ = function(stream, addr, len) {
		if (stream.is(G.ReadableStream)) {
			var i, val, str = "",
				ptr = stream.ptr(addr),
				unit = (stream._unit << 1 || 1),
				pad = Array(16).join(0);

			for (i = 0; i < 16 >> (unit >> 1); i++) {
				str += (pad + (i * unit).toString(16)).substr(-unit << 1) + "  ";
			}
			str += "\n";

			for (i = 0; i < len; i++) {
				if (unit == 1) {
					val = ptr.readUInt8(i);
				} else if (unit == 2) {
					val = ptr.readUInt16LE(i);
				} else if (unit == 4) {
					val = ptr.readUInt32LE(i);
				}

				if (i % (16 >> (unit >> 1)) == 0) { str += "\n" + (pad + (addr + i * unit).toString(16)).substr(-8) + "   "; }
				str += ((pad + val.toString(16)).substr(-unit << 1) + "  ");
			}
			debug.log_("Offset(h)  " + str.toUpperCase());
		}
	}

	// Dirty hack to prepare code migration
	var temp = gamalto.dev = {};
	temp.using = debug.using_;
	temp.require = debug.require_;
	temp.assert = debug.assert_;
	temp.error = debug.error_;
	temp.log = debug.log_;
	temp.warn = debug.warn_;
	temp.mem = debug.mem_;

})();
