/*
 * Gamalto.IndexedImage Interchange File Format Module
 * ---------------------------------------------------
 * 
 * This file is part of the GAMALTO JavaScript Development Framework.
 * http://www.gamalto.com/
 *

Copyright (C)2012-20XX Chris Apers and The GAMALTO Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 *
 */

(function() {
	/* Dependencies */
	gamalto.devel.require("IndexedImage");
	gamalto.devel.using("Color");
	gamalto.devel.using("Decoder");
	gamalto.devel.using("MemoryStream");
	gamalto.devel.using("Palette");

	/* Local */
	var base = G.IndexedImage;

	base.addModule({
		mime	: ["application/octet-stream"],
		ext		: [".iff", ".ilbm", ".lbm"],
		reader	: module
	});
	
	// Will be called in the context on the calling IndexedImage instance
	function module(buffer) {
		var base, chunk, palette, data, width, height, x, y, bits, size,
			transparency, masking;

		// Entry point
		chunk = buffer.readString(4);
		if (chunk == "FORM") {
			size  = buffer.readUint32(),
			base = buffer.readString(4);
			if (base == "ILBM" || base == "PBM ") {
				do {
					chunk = buffer.readString(4);
					size = buffer.readUint32();

					if (chunk == "BMHD") {
						width = buffer.readUint16();
						height = buffer.readUint16();
						buffer.readUint16(); // x offset
						buffer.readUint16(); // y offset
						bits = buffer.readUint8();
						masking = buffer.readUint8();
						packed = buffer.readUint8(); // compress
						buffer.readUint8(); // padding
						transparency = buffer.readUint16();
						buffer.readUint8(); // horiz pixel ratio
						buffer.readUint8(); // vert pixel ratio
						buffer.readUint16(); // display page width
						buffer.readUint16(); // display page height

					} else if (chunk == "CMAP") {
						palette = new G.Palette();
						for (x = 0; x < size; x += 3) {
							var r = buffer.readUint8(),
								g = buffer.readUint8(),
								b = buffer.readUint8();
							palette.addColor(new G.Color(r, g, b));
						}
						// FIXME: masking is supposed to be set to 2 (mskHasTransparentColor)
						// but GRAFX2 doesn't seem to set it properly
						if (masking == 2 || transparency != 0) {
							palette.setTransparency(transparency);
						}

					} else if (chunk == "TMAP") {

					} else if (chunk == "CRNG") {		// TODO: CCRT
						buffer.readUint16(); // padding
						var rate	= buffer.readUint16(),
							active	= buffer.readUint16(),
							from	= buffer.readUint8(),
							to		= buffer.readUint8();

						if (active & 1) {
							palette.addAnimator(
								active == 3 ? from : to,
								active == 3 ? to : from,
								1000 / (rate / 16384 * 60));
							}

					} else if (chunk == "BODY") {
						var temp, dec = G.Decoder;

						if (packed) {
							data = new G.MemoryStream(width * height * bits / 8);
							dec.get("RLE" + (base == "ILBM" ? "-IFF" : ""))
								(buffer, data, bits, width, height);
							data.rewind();
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
						// Always read at an even position
						if (size % 2 == 1) { size++; }
						buffer.seek(size);
					}
				} while(!buffer.eos());
			}
		}

		data.rewind();
		return [palette, data, width, height];
	};

})();
