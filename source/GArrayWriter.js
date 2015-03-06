/*
 * Gamalto.ArrayWriter
 *
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	var _Object = G.ArrayWriter = function(buffer) {
		this.buffer = buffer;
		this.byteLength = buffer.length;
	},
	_proto = _Object.inherits(G.Object);

	_proto._writeByte = function(byteOffset, value) {
		this.buffer[byteOffset] = value & 0xff;
	};

	_proto.setInt8 = _proto.setUint8 = function(byteOffset, value) {
		this._writeByte(byteOffset, value);
	};

	_proto.setInt16 = _proto.setUint16 = function(byteOffset, value, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 2;
			inc = -1;
		}
		this._writeByte(byteOffset += inc, (value     ));
		this._writeByte(byteOffset += inc, (value >> 8));
	};

	_proto.setInt32 = _proto.setUint32 = function(byteOffset, value, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 4;
			inc = -1;
		}
		this._writeByte(byteOffset += inc, (value      ));
		this._writeByte(byteOffset += inc, (value >>  8));
		this._writeByte(byteOffset += inc, (value >> 16));
		this._writeByte(byteOffset += inc, (value >> 24));
	};

})();
