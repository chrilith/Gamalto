/*
 * Gamalto.IndexedImage_AtariNeochrome
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012-2014 Chris Apers and The Gamalto Project, all rights reserved.

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
		ext		: [".neo"],
		reader	: module
	});

	// Will be called in the context on the calling IndexedImage instance
	function module(buffer) {
		var palette, data, width, height, x, y, bits;
	
		buffer.seek(2, buffer.SEEK_SET);
		// Not low resolution?
		var rez	= buffer.readUint16();

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
		
		// Skip filename
		buffer.seek(12)

		// Palette animations if any
		var valid	= !!(buffer.readUint8() & 0x80),
			limits	= buffer.readUint8(),
			active	= valid && !!(buffer.readUint8() & 0x80),
			vblank	= buffer.readInt8(),
			from	= (limits & 0xf0) >> 4,
			to		= (limits & 0x0f);

		if (active) {
			palette.addAnimator(
				vblank < 0 ? from : to,
				vblank < 0 ? to : from,
				Math.fabs(vblank) / 60 * 1000);
		}

		// skip more...
		buffer.seek(2 * 5 + 2 * 33);

		// Image data
		var temp = new G.MemoryStream(width * height);
		data = G.Decoder.get("Interleaved")(buffer, temp, width, height, bits);
		data.rewind();

		return [palette, data, width, height];
	}

})();
