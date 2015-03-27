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
	proto = _Object.inherits(G.ArrayReader);

	proto.readByte_ = function(byteOffset) {
		return this.buffer.charCodeAt(byteOffset) & 0xff;
	};

})();
