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
	proto = _Object.inherits(G.Object);

	proto.writeByte_ = function(byteOffset, value) {
		this.buffer[byteOffset] = value & 0xff;
	};

	proto.setInt8 = proto.setUint8 = function(byteOffset, value) {
		this.writeByte_(byteOffset, value);
	};

	proto.setInt16 = proto.setUint16 = function(byteOffset, value, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 2;
			inc = -1;
		}
		this.writeByte_(byteOffset += inc, (value     ));
		this.writeByte_(byteOffset += inc, (value >> 8));
	};

	proto.setInt32 = proto.setUint32 = function(byteOffset, value, littleEndian) {
		var inc = +1;
		if (littleEndian) {
			byteOffset--;
		} else {
			byteOffset += 4;
			inc = -1;
		}
		this.writeByte_(byteOffset += inc, (value      ));
		this.writeByte_(byteOffset += inc, (value >>  8));
		this.writeByte_(byteOffset += inc, (value >> 16));
		this.writeByte_(byteOffset += inc, (value >> 24));
	};

})();
