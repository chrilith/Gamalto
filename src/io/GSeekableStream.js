/*********************************************************************************
 #################################################################################

 Gamalto.SeekableStream
 ______________________

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 #################################################################################
 #################################################################################
  _________   _________   _________   _________   _        _________   _________
 |  _______| |_______  | |  _   _  | |_________| | |      |___   ___| |  _____  |
 | |  _____   _______| | | | | | | |  _________  | |          | |     | |     | |
 | | |____ | |  _____  | | | | | | | |_________| | |          | |     | |     | |
 | |_____| | | |_____| | | | | | | |  _________  | |_______   | |     | |_____| |
 |_________| |_________| |_| |_| |_| |_________| |_________|  |_|     |_________|

                       «< javascript development framework >»                    

 #################################################################################
 *********************************************************************************/

(function() {

	gamalto.dev.require("Stream");

	/**
	 * Base object to create seekable streams. It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.SeekableStream
	 * @augments Gamalto.Stream
	 */
	var _Object = G.SeekableStream = function() {
		Object.base(this);
	},

	/** @alias Gamalto.SeekableStream.prototype */
	proto = _Object.inherits(G.Stream);

	/**
	 * Changes the position of the stream pointer.
	 *
	 * @param  {number}  offset
	 *     Offset to be applied to the stream pointer.
	 * 
	 * @param  {number} [origin]
	 *     Origin of the position change. Defaults to SEEK_CUR.	
	 *     @see #SEEK_SET
	 *     @see #SEEK_CUR
	 *     @see #SEEK_END
	 */
	proto.seek = function(offset, origin) {
		var C = this,
			undef;

		if (origin === undef) {
			origin = C.SEEK_CUR;
		}

		switch (origin) {
			case C.SEEK_SET:
				this.position_ = offset;
				break;

			case C.SEEK_CUR:
				this.position_ += offset;
				break;

			case C.SEEK_END:
				this.position_ = this.length + offset;
				break;
		}
	}

	/**
	 * Sets the stream pointer to the beginning of the stream.
	 */
	proto.rewind = function() {
		this.seek(0, this.SEEK_SET);
	};

	/**
	 * Position is from the start of the stream.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.SEEK_SET = 0;
	/**
	 * Position is from the current stream position.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.SEEK_CUR = 1;
	/**
	 * Position is from the end of the stream.
	 * 
	 * @constant
	 * @type {number}
	 */
	proto.SEEK_END = 2;

})();
