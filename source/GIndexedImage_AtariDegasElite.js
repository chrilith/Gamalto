/*
 * Gamalto.IndexedImage_AtariDegasElite
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
	gamalto.require_("IndexedImage");
	gamalto.using_("MemoryStream");
	gamalto.using_("Palette");
	gamalto.using_("Color");

	/* Local */
	var base = G.IndexedImage;

	base.addModule({
		mime	: ["application/octet-stream"],
		ext		: [".pi1", ".pi2", ".pi3", ".pc1", ".pc2", ".pc3"],
		reader	: module
	});

	// Will be called in the context on the calling IndexedImage instance
	function module(buffer) {
		var palette, data, width, height, x, y, bits;
	
		// Not low resolution?
		var packed = !!buffer.readUint8(),
			rez	= buffer.readUint8();

		if (rez == 0) {
			width	= 320;
			height	= 200;
			bits	= 4;
		} else if (rez == 1) {
			width	= 640;
			height	= 200;
			bits	= 2;
		} else if (rez == 2) {
			width	= 640;
			height	= 400;
			bits	= 1;
		}
		
		// Get palette
		palette = new G.Palette();
		for (x = 0; x < 16; x++) {
			var o = buffer.readUint16();
				var b = ((o >> 0) & 0x7) << 5,
					g = ((o >> 4) & 0x7) << 5,
					r = ((o >> 8) & 0x7) << 5;

			palette.addColor(new G.Color(r, g, b));
		}
		
		var temp, dec = G.Decoder;

		if (packed) {
			data = new G.MemoryStream(32000);
			dec.get("RLE-IFF")
				(buffer, data, bits, width, height);
			data.rewind();
		} else {
			data = buffer;
		}

		// Image data
		temp = new G.MemoryStream(width * height);
		data = dec.get("Interleaved")(data, temp, width, height, bits);

		// Palette animations if any
		if (!buffer.eos()) {
			var pos  = buffer.tell(),
				info = []; /* 0 = start color
						      1 = end color
						      2 = direction (0 = left, 1 = none, 2 = right)
						      3 = delay
						   */
	
			y = 0; do {
				buffer.seek(pos + y * 2, buffer.SEEK_SET);
	
				x = 0; do {
					info[x] = buffer.readUint16();
					buffer.seek(8 - 2);
				} while (++x < 4);

				if (info[2] != 1) {
					palette.addAnimator(
						info[2] == 0 ? info[0] : info[1],
						info[2] == 0 ? info[1] : info[0],
						(128 - info[3]) / 60 * 1000);
				}
			} while (++y < 4);
		}

		data.rewind();
		return [palette, data, width, height];
	}

})();
