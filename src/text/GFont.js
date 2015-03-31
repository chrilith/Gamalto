/*
 * Gamalto.Font
 * ------------
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
	gamalto.devel.require("SpriteSheet");
	gamalto.devel.using("Rect");
	gamalto.devel.using("Size");
	gamalto.devel.using("Surface");

	/**
	 * @constructor
	 */
	G.Font = function(bitmap, firstLetter) {
		Object.base(this, bitmap);
		this._firstLetter = firstLetter.charCodeAt(0);
		this.setAlign();
	};
	
	/* Inheritance and shortcut */
	var proto = G.Font.inherits(G.SpriteSheet);
	
	proto._paintLine = function(renderer, text, x, y) {
		var o  = this,
			i, s, c,
			w  = 0,
			h  = 0;
	
		for (c = 0; c < text.length; c++) {
			i = text.charCodeAt(c) - o._firstLetter;
			if ((s = o.getSection(i))) {
				renderer.drawBitmapSection(o._bitmap, x + w, y, s);
				w += s.extent.x;
				h  = Math.fmax(s.extent.y, h);
			}
		}
		return new G.Rect(x, y, w, h);
	};
	
	proto._paintStyle = function(renderer, text, x, y) {
		var rect, area,
			size = this.getBounds(text),
			buff = this._buffer;

		if (!buff || buff.width != size.width || buff.height != size.height) {
			this._buffer = buff = new G.Surface(size.width, size.height);
		} else {
			buff.clear();
		}

		area = buff.renderer;
		rect = this._paintLine(area, text, 0, 0);

		area.enableMask(true);
		area.fillRect(null, this._style);
		area.enableMask(false);

		renderer.drawBitmap(buff, x, y);

		// The line was painted at (0,0) in the buffer, readjust the box
		// position according to the requested coordinates
		var origin = rect.origin;
		origin.x = x;
		origin.y = y;
		rect.origin = origin;

		return rect;
	};
	
	proto.draw = function(renderer, text, x, y) {
		var shadow = this._shadow;
	
		if (shadow) {
			var prev = this.setStyle(shadow.style);
			this._paint(renderer, text, x + shadow.x, y + shadow.y);
			this.setStyle(prev);
		}
	
		return this._paint.apply(this, arguments);
	};
	
	proto._paint = function(renderer, text, x, y) {
		var o  = this,
			d  = o._style ? o._paintStyle : o._paintLine,
			align = this._align,
			h  = 0, xx, yy, r,
			last, l, m;

		if (!align || align == (G.ALIGN_LEFT|G.ALIGN_TOP)) {
			return d.call(o, renderer, text, x, y);
		}

		// Do we have a bit set for vertical alignment

		if (align & G.ALIGN_BOTTOM) {
			m  = o.getBounds(text);	
			y -= m.height >> (align & G.ALIGN_TOP ? 1 : 0);
		}

		text = text.split('\n');
		last = text.length;
		yy = y;

		for (l = 0; l < last; l++) {
			xx = x;

			// Do we have a bit set for horizontal alignment
			if (align & G.ALIGN_RIGHT) {
				m   = o._getBBox(text[l]);	// FIXME: Do not compute twice?
				xx -= m.w >> (align & G.ALIGN_LEFT ? 1 : 0);
			}

			r = d.call(o, renderer, text[l], xx, yy);
			yy += m.h;
		}
	
		return r;
	};
	
	proto.setStyle = function(style) {
		var prev = this._style;
		this._style = style;
		return prev;
	};
	
	proto.setShadow = function(offsetX, offsetY, style) {
		// FIXME: really create a new object?
		this._shadow = !offsetX && !offsetY ? null : { x: offsetX, y: offsetY, style: style };
	};

	proto.setAlign = function(align) {
		this._align = align;
	};

	proto.getBounds = function(text) {
		var c, i, s,
			w = 0, h = 0;
	
		text = text.split("\n");
		for (c = 0; c < text.length; c++) {
			s  = this._getBBox(text[c]);
			w  = Math.fmax(w, s.w);
			h += s.h;
		}	
		return new G.Size(w, h);
	};
	
	proto._getBBox = function(text) {
		var c, i, s,
			w = 0, h = 0;

		for (c = 0; c < text.length; c++) {
			i = text.charCodeAt(c) - this._firstLetter;
			s = this.getSection(i);
			w += s.extent.x;
			h  = Math.fmax(s.extent.y, h);
		}
		return { w: w, h:h };
	};

})();
