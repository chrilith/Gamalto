/*
 * Gamalto.TextReader
 *
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	var _Object = G.TextReader = function(buffer) {
		Object.base(this,
			typeof buffer == "string"
				? buffer.split('')
				: buffer);
	},
	_proto = _Object.inherits(G.ArrayReader);

	_proto._readByte = function(byteOffset) {
		return this.buffer[byteOffset].charCodeAt(0) & 0xff;
	};

	_proto.valueOf = function() {
		return this.buffer.join('');
	};

})();
