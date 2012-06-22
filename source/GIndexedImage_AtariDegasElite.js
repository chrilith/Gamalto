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
	G.require	("IndexedImage");
	G.using		("MemoryStream");
	G.using		("Palette");
	G.using		("Color");

	/* Local */
	var base = G.IndexedImage;

	base._addDecoder({
		mime	: "application/octet-stream",
		ext		: [".pi1", ".pi2", ".pi3"],
		reader	: decoder
	});

	// Will be called in the context on the calling IndexedImage instance
	function decoder(buffer) {
		var palette, data, width, height, x, y, word = [];
	
		// Not low resolution?
		var rez = buffer.readUInt16BE();
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
			var o = buffer.readUInt16BE();
				var b = ((o >> 0) & 0x7) << 5,
					g = ((o >> 4) & 0x7) << 5,
					r = ((o >> 8) & 0x7) << 5;

			palette.addColor(new G.Color(r, g, b));
		}
		
		// Image data
		var iter = Math.pow(2, bits);
		data = new G.MemoryStream(width * height);

		for (y = 0; y < height; y++) {
			for (x = 0; x < width / 16; x++) {

				for (i = 0; i < bits; i++) {
					word[i] = buffer.readUInt16BE();
				}

				for (b = 0; b < 16; b++) {
					var pix = 0, sft = (15 - b);

					for (i = 0; i < bits; i++) {
						pix |= ((word[i] & (1 << sft)) >> sft) << i;
					}

					data.writeByte(pix);
				}
			}
		}

		// Palette animations if any
		if (!buffer.eos()) {
			var pos  = buffer.tell(),
				info = []; /* 0 = start color
						      1 = end color
						      2 = direction (0 = left, 1 = none, 2 = right)
						      3 = delay
						   */
	
			y = 0; do {
				buffer.seek(pos + y * 2);
	
				x = 0; do {
					info[x] = buffer.readUInt16BE();
					buffer.seek(8 - 2, G.Stream.SEEK_CUR);
				} while (++x < 4);

				if (info[2] != 1) {
					palette.addAnimator(
						info[2] == 0 ? info[0] : info[1],
						info[2] == 0 ? info[1] : info[0],
						(128 - info[3]) / 60 * 1500);	// 1500 to adjust perceived speed
				}
			} while (++y < 4);
		}

		return [palette, data, width, height];
	}	
	
})();
