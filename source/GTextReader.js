/*
 * Gamalto.TextReader
 *
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	var _Object = G.TextReader = function(buffer) {
		Object.base(this, buffer);
	},
	_proto = _Object.inherits(G.ArrayReader);

	_proto._readByte = function(byteOffset) {
		return this.buffer.charCodeAt(byteOffset) & 0xff;
	};

})();
