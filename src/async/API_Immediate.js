/*
 * API Efficient Script Yielding
 * -----------------------------
 * Implementation: setImmediate()
 * Implementation: clearImmediate()
 *
 * See: https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
 * -----------------------------
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

(function(global) {

	// FIXME: postMessage() is defined in CocoonJS Canvas+ but does nothing
	// and so this code doesn't work as expected and breaks Promise and Async.

	/* Enable standard version of the methods */
	Object.defineMethod(global, "setImmediate", implSetImmediate);
	Object.defineMethod(global, "clearImmediate", implClearImmediate);

	/* If it is not native, it requires an initialization */
	if (!~("" + setImmediate).indexOf("native code")) {
		init();
	}

	// API IMPLETENTATION //
	// For a similar implementation see: https://github.com/YuzuJS/setImmediate

	var magic = "com.gamalto.impl.immediate" + Math.random();
		tasks = {},
		taskHandle = 1;

	function processHandler(vargs) {
		var handler = vargs[0];
		if (handler) {
			if (typeof handler == "function") {
				return handler.bind.apply(handler, vargs);
			} else {
				/* specs says: apply ToString() */
				return new Function("" + handler);
			}
		}
		return null;
	}

	function registerTask(vargs) {
		var handler;
		if ((handler = processHandler(vargs))) {
			tasks[taskHandle] = handler;
		}
		/* Always returns a new handle */
		return taskHandle++;
	}

	function tryRunTask(handle) {
		var task;
		if ((task = tasks[handle])) {
			try {
				task();
			} finally {
				clearImmediate(handle);
			}
		}
	}

	function init() {
		var handler = function(event) {
			var data = event.data;
			if (event.source == global && typeof data == "string" && data.indexOf(magic) == 0) {
				event.stopPropagation();
				/* + instead of |0 can return NaN */
				tryRunTask(+data.substr(magic.length));
			}
		}
		/* Using W3C Messaging API
		 * See: http://www.nonblocking.io/2011/06/windownexttick.html
		 */
		global.addEventListener("message", handler, false);
	}

	// EXTENSION FUNCTIONS //

	function implSetImmediate(/*handler, vargs*/) {
		var handle = registerTask(arguments);
		global.postMessage(magic + handle, "*");
		return handle;
	}

	function implClearImmediate(handle) {
		delete tasks[handle];
	}

})(this);
