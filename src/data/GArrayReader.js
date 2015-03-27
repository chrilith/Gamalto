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
	proto = _Object.inherits(G.Object);

	proto.readByte_ = function(byteOffset) {
		return this.buffer[byteOffset] & 0xff;
	};

	proto.getUint8 = function(byteOffset) {
		return this.readByte_(byteOffset);
	};

	proto.getUint16 = function(byteOffset, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 2;
			inc = -1;
		}
		var a = this.readByte_(byteOffset += inc),
			b = this.readByte_(byteOffset += inc);
		return (b << 8) | a;
	};

	proto.getUint32 = function(byteOffset, littleEndian) {
		return this.getInt32(byteOffset, littleEndian) >>> 0;
	};

	proto.getInt8 = function(byteOffset) {
		return this.getUint8(byteOffset) << 24 >> 24;
	};

	proto.getInt16 = function(byteOffset, littleEndian) {
		return this.getUint16(byteOffset, littleEndian) << 16 >> 16;
	};

	proto.getInt32 = function(byteOffset, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 4;
			inc = -1;
		}
		var a = this.readByte_(byteOffset += inc),
			b = this.readByte_(byteOffset += inc),
			c = this.readByte_(byteOffset += inc),
			d = this.readByte_(byteOffset += inc);
		return (d << 24) | (c << 16) | (b << 8) | a;
	};

})();
