/*
 * Gamalto.ArrayReader
 *
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	var _Object = G.ArrayReader = function(buffer) {
		this.buffer = buffer;
		this.byteLength = buffer.length;
	},
	_proto = _Object.inherits(G.Object);

	_proto._readByte = function(byteOffset) {
		return this.buffer[byteOffset] & 0xff;
	};

	_proto.getUint8 = function(byteOffset) {
		return this._readByte(byteOffset);
	};

	_proto.getUint16 = function(byteOffset, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 2;
			inc = -1;
		}
		var a = this._readByte(byteOffset += inc),
			b = this._readByte(byteOffset += inc);
		return (b << 8) | a;
	};

	_proto.getUint32 = function(byteOffset, littleEndian) {
		return this.getInt32(byteOffset, littleEndian) >>> 0;
	};

	_proto.getInt8 = function(byteOffset) {
		return this.getUint8(byteOffset) << 24 >> 24;
	};

	_proto.getInt16 = function(byteOffset, littleEndian) {
		return this.getUint16(byteOffset, littleEndian) << 16 >> 16;
	};

	_proto.getInt32 = function(byteOffset, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 4;
			inc = -1;
		}
		var a = this._readByte(byteOffset += inc),
			b = this._readByte(byteOffset += inc),
			c = this._readByte(byteOffset += inc),
			d = this._readByte(byteOffset += inc);
		return (d << 24) | (c << 16) | (b << 8) | a;
	};

})();
