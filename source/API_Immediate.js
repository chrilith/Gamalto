/*
 *  Implementation: setImmediate()
 *  Implementation: clearImmediate()
 *  See: https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
 * 
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {
	var global = this;

	/* Enable standard version of the methods */
	Object.defineMethod(global, "setImmediate", implSetImmediate);
	Object.defineMethod(global, "clearImmediate", implClearImmediate);

	/* If it is not native, it requires an initialization */
	if (!~("" + setImmediate).indexOf("native code")) {
		init();
	}

	// API IMPLETENTATION //
	// For a similar implementation see: https://github.com/YuzuJS/setImmediate */

	var _magic = "com.gamalto.impl.immediate" + Math.random();
		_tasks = {},
		_taskHandle = 1;

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
			_tasks[_taskHandle] = handler;
		}
		/* Always returns a new handle */
		return _taskHandle++;
	}

	function tryRunTask(handle) {
		var task;
		if ((task = _tasks[handle])) {
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
			if (event.source == global && typeof data == "string" && data.indexOf(_magic) == 0) {
				event.stopPropagation();
				/* + instead of |0 can return NaN */
				tryRunTask(+data.substr(_magic.length));
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
		global.postMessage(_magic + handle, "*");
		return handle;
	}

	function implClearImmediate(handle) {
		delete _tasks[handle];
	}

})();