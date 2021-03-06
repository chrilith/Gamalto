/*
 * Gamalto.Decoder RLE-IFF Module
 * ------------------------------
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
	gamalto.devel.require("Decoder");

	/* Local */
	var base = G.Decoder;

	/* RLE variant used with Interchange File Format (IFF) */
	base.add("RLE-IFF", function(source, dest, planes, width, height) {
		var offset		= (planes - 1) * 2,
			scan_bytes	= width / 8 * planes,
			scan_off	= 0;

		while (height--) {
			var scan_in	= 0,
				count	= planes;

			do {
				do {
					var data = -1,
						iter = source.readUint8();

					if (iter > 128) {
						data = source.readUint8();
						iter = 256 - iter;
					}

					do {
						dest.seek(scan_off + scan_in++, dest.SEEK_SET);
						dest.writeInt8(data != -1 ? data : source.readUint8());

						if (scan_in % 2 == 0) {
							scan_in += offset;
						}
					} while (iter--);

				} while (scan_in < scan_bytes);
				scan_in -= scan_bytes - 2;

			} while (--count);
			scan_off += scan_bytes;
		}

		return dest;
	});

})();
