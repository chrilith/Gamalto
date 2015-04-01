/*
 * Gamalto Debug Tools
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

if (GAMALTO_DEBUG) (function(global) {

	var using = {},
		debug = {};

	gamalto.devel = debug;

	debug.using = function(name) {
		using["D__" + name] = 1;
	};
	
	debug.require = function(name) {
		debug.assert(G[name], 'Gamalto dependency error ["' + name + '"].');
	};

	debug.checkDependencies = function() {
		for (var use in using) {
			if (use.substr(0, 3) == "D__") {
				var module = use.substr(3);
				debug.assert(G[module], 'Gamalto cannot find module ["' + module + '"].');
			}
		}	
	};

	debug.assert = function(cond, message) {
		if (!cond) {
			var err = new Error();
			message  = "Assertion failed" + (message ? " : " + message : "");
			if (err.stack) {
				message += ", " + err.stack.split("\n")[2].replace(/\s*(.+?)\s*/, "$1");
			}
			err.message = message;
			throw err;
		}
	};

	debug.error = function() {
		if (global.console) {
			console.error.apply(console, arguments);
		}
	};

	debug.log = function() {
		if (global.console) {
			console.log.apply(console, arguments);
		}
	};

	debug.warn = function() {
		if (global.console) {
			console.warn.apply(console, arguments);
		}
	};

	// TODO: move to ReadableStream
	debug.memory = function(stream, addr, len) {
		if (stream.is(G.ReadableStream)) {
			var i, val, str = "",
				ptr = stream.ptr(addr),
				unit = (stream.unit_ << 1 || 1),
				pad = Array(16).join(0);

			for (i = 0; i < 16 >> (unit >> 1); i++) {
				str += (pad + (i * unit).toString(16)).substr(-unit << 1) + "  ";
			}
			str += "\n";

			for (i = 0; i < len; i++) {
				if (unit == 1) {
					val = ptr.readUint8(i);
				} else if (unit == 2) {
					val = ptr.readUint16(i);
				} else if (unit == 4) {
					val = ptr.readUint32(i);
				}

				if (i % (16 >> (unit >> 1)) == 0) { str += "\n" + (pad + (addr + i * unit).toString(16)).substr(-8) + "   "; }
				str += ((pad + val.toString(16)).substr(-unit << 1) + "  ");
			}
			debug.log("Offset(h)  " + str.toUpperCase());
		}
	};

})(this);
