/*
 * Gamalto.IndexedImage_InterchangeFileFormat
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

For production software, the copyright notice only is required. You must also
display a splash screen showing the Gamalto logo in your game of other software
made using this middleware.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 *
 */

(function() {
	/* Dependencies */
	G.require	("IndexedImage");
	G.using		("Color");
	G.using		("Decoder");
	G.using		("MemoryStream");
	G.using		("Palette");

	/* Local */
	var base = G.IndexedImage;

	base.addModule({
		mime	: "application/octet-stream",
		ext		: [".iff", ".ilbm", ".lbm"],
		reader	: module
	});
	
	// Will be called in the context on the calling IndexedImage instance
	function module(buffer) {
		var base, chunk, palette, data, width, height, x, y, bits, size;

		// Entry point
		chunk = buffer.readString(4);
		if (chunk == "FORM") {
			size  = buffer.readUInt32BE(),
			base = buffer.readString(4);

			if (base == "ILBM" || base == "PBM ") {
				do {
					chunk = buffer.readString(4);
					size = buffer.readUInt32BE();
					
					if (chunk == "BMHD") {
						width = buffer.readUInt16BE();
						height = buffer.readUInt16BE();
						buffer.readUInt16BE(); // x offset
						buffer.readUInt16BE(); // y offset
						bits = buffer.readByte();
						buffer.readByte(); // masking
						packed = buffer.readByte(); // compress
						buffer.readByte(); // padding
						buffer.readUInt16BE(); // transparency
						buffer.readByte(); // horiz pixel ratio
						buffer.readByte(); // vert pixel ratio
						buffer.readUInt16BE(); // display page width
						buffer.readUInt16BE(); // display page height

					} else if (chunk == "CMAP") {
						palette = new G.Palette();
						for (x = 0; x < size; x += 3) {
							var r = buffer.readByte(),
								g = buffer.readByte(),
								b = buffer.readByte();
							palette.addColor(new G.Color(r, g, b));
						}

					} else if (chunk == "CRNG") {		// TODO: CCRT
						buffer.readUInt16BE(); // padding
						var rate	= buffer.readUInt16BE(),
							active	= buffer.readUInt16BE(),
							from	= buffer.readByte(),
							to		= buffer.readByte();

						if (active & 1) {
							palette.addAnimator(
								active == 3 ? from : to,
								active == 3 ? to : from,
								500 / (rate / 16384 * 60));
							}

					} else if (chunk == "BODY") {
						var temp, dec = G.Decoder;

						if (packed) {
							data = new G.MemoryStream(width * height * bits / 8);
							dec.get("RLE" + (base == "ILBM" ? "-IFF" : ""))
								(buffer, data, bits, width, height);
							data.seek(0);
						} else {
							data = buffer;
						}

						// Image data
						if (base == "ILBM") {
							temp = new G.MemoryStream(width * height);
							data = dec.get("Interleaved")
								(data, temp, width, height, bits);
						}
						break;

					// Ignore unhandled chunks
					} else {
						buffer.seek(size, G.Stream.SEEK_CUR);
					}
				} while(!buffer.eos());
			}
		}

		data.seek(0);
		return [palette, data, width, height];
	}

})();