/*
 * Gamalto.Font
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
	gamalto.require("SpriteSheet");
	gamalto.using("Bitmap");
	gamalto.using("Rect");
	gamalto.using("Renderer");
	gamalto.using("Size");
	gamalto.using("Surface");

	/**
	 * @constructor
	 */
	G.Font = function(bitmap, firstLetter, tw, th, count, r) {
		var o = this;
		Object.base(o, bitmap, tw, th, count, r);
		o._bitmap = bitmap;
		o._firstLetter = firstLetter.charCodeAt(0);
		this.setAlign();
	}
	
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
				w += s.width;
				h  = Math.fmax(s.height, h);
			}
		}
		return new G.Rect(x, y, w, h);
	}
	
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

		rect.tL.x = x;
		rect.tL.y = y;
		return rect;
	}
	
	proto.draw = function(renderer, text, x, y) {
		var that = this,
			shadow = that._shadow;
	
		if (shadow) {
			var prev = that.setStyle(shadow.style);
			that._paint.call(that, renderer, text, x + shadow.x, y + shadow.y);
			that.setStyle(prev);
		}
	
		return that._paint.apply(that, arguments);
	}
	
	proto._paint = function(renderer, text, x, y) {
		var o  = this,
			d  = o._style ? o._paintStyle : o._paintLine,
			S = G.Shape,
			align = this._align,
			h  = 0, xx, yy, r,
			last, l, m;

		if (!align || align == (S.ALIGN_LEFT|S.ALIGN_TOP)) {
			return d.call(o, renderer, text, x, y);
		}

		// Do we have a bit set for vertical alignment

		if (align & S.ALIGN_BOTTOM) {
			m  = o.getBounds(text);	
			y -= m.height >> (align & S.ALIGN_TOP ? 1 : 0);
		}

		text = text.split('\n');
		last = text.length;
		yy = y;

		for (l = 0; l < last; l++) {
			xx = x;

			// Do we have a bit set for horizontal alignment
			if (align & S.ALIGN_RIGHT) {
				m   = o._getBBox(text[l]);	// FIXME: Do not compute twice?
				xx -= m.w >> (align & S.ALIGN_LEFT ? 1 : 0);
			}

			r = d.call(o, renderer, text[l], xx, yy);
			yy += m.h;
		}
	
		return r;
	}
	
	proto.setStyle = function(style) {
		var prev = this._style;
		this._style = style;
		return prev;
	}
	
	proto.setShadow = function(offsetX, offsetY, style) {
		// FIXME: really create a new object?
		this._shadow = !offsetX && !offsetY ? null : { x: offsetX, y: offsetY, style: style };
	}

	proto.setAlign = function(align) {
		this._align = align;
	}

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
	}
	
	proto._getBBox = function(text) {
		var c, i, s,
			w = 0, h = 0;

		for (c = 0; c < text.length; c++) {
			i = text.charCodeAt(c) - this._firstLetter;
			s = this.getSection(i);
			w += s.width;
			h  = Math.fmax(s.height, h);
		}
		return { w: w, h:h };
	}

})();
