/*
 * Gamalto.Animation
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
	G.require	("SectionList");
	G.using		("Bitmap");
	G.using		("Color");
	G.using		("Rect");
	G.using		("Renderer");
	G.using		("Size");
	G.using		("Surface");

	/**
	 * @constructor
	 */
	G.Font = function(bitmap, r, count, tw, th, firstLetter) {
		var o = this;
		G.Object.base(o, r, count, tw, th);
		o._bitmap = bitmap;
		o._firstLetter = firstLetter.charCodeAt(0);
	}
	
	/* Inheritance and shortcut */
	var proto = G.Font.inherits(G.SectionList);
	
	proto._paintLine = function(renderer, text, x, y) {
		var o  = this,
			i, s, c,
			w  = 0,
			h  = 0;
	
		for (c = 0; c < text.length; c++) {
			i = text.charCodeAt(c) - o._firstLetter;
			if (!(s = o.getSection(i))) {
				continue;
			}
			renderer.drawBitmapSection(o._bitmap, x + w, y, s);
			w += s.width;
			h  = Math.fmax(s.height, h);
		}
	
		return new G.Rect(x, y, w, h);
	}
	
	proto._paintColor = function(renderer, text, x, y) {
		var o  = this,
			m  = o._getBounds(text), r,
			b  = o._buffer,
			s  = new G.Surface(m.width, m.height),
			w1 = m.width,
			h1 = m.height,
			w2 = s.width,
			h2 = s.height;
			o._buffer = s;
	
		if (w1 > w2 || h1 > h2) {
			s.setSize(Math.fmax(w1, w2), Math.fmax(h1, h2));
		} else {
			s.clear();
		}
		r = o._paintLine(s.renderer, text, 0, 0);
	
		s.renderer.enableMask(true);
		s.renderer.fillRect(null, o._color);
		s.renderer.enableMask(false);
	
		renderer.drawBitmap(s, x, y);
		
		r.tL.x = x;
		r.tL.y = y;
		return r;
	}
	
	proto.draw = function(renderer, text, x, y, halign, valign) {
		var that = this,
			shadow = that._shadow;
	
		if (shadow) {
			var prev = that.setColor(shadow.color);
			that._paint.call(that, renderer, text, x + shadow.x, y + shadow.y, halign, valign);
			that.setColor(prev);
		}
	
		return that._paint.apply(that, arguments);
	}
	
	proto._paint = function(renderer, text, x, y, halign, valign) {
		var o  = this,
			d  = o._color ? o._paintColor : o._paintLine,
			ns = G.Font,
			h  = 0, xx, yy, r,
			last, l, m;
	
		if (!halign && !valign) {
			return d.call(o, renderer, text, x, y);
		}
	
		if (valign) {
			m = o._getBounds(text, true);
	
			switch (valign) {
				case ns.AV_MIDDLE:
					y -= m.height >> 1;
					break;
				case ns.AV_BOTTOM:
					y -= m.height;
					break;
			}
		}
	
		text = text.split('\n');
		last = text.length;
		yy = y;
	
		for (l = 0; l < last; l++) {
			xx = x;
	
			if (halign) {
				m = o._getBounds(text[l]);	// Do not compute twice
	
				switch (halign) {
					case ns.AH_CENTER:
						xx -= m.width >> 1;
						break;
					case ns.AH_RIGHT:
						xx -= m.width;
						break;
				}
			}
	
			r = d.call(o, renderer, text[l], xx, yy);
			yy += r.height;
		}
	
		return r;
	}
	
	//TODO: _.setStyle
	proto.setColor = function(color) {
		var that = this,
			prev = that._color;
		that._color = color;
		return prev;
	}
	
	proto.setShadow = function(offsetX, offsetY, color) {
		this._shadow = !offsetX && !offsetY ? null : { x: offsetX, y: offsetY, color: color };
	}
	
	// TODO: multi? useless, pass a param anyway but internally
	// if \n then = multi...
	proto._getBounds = function(text, multi) {
		var c, i,
			o = this,
			s = o.getSection(0),
			w = 0, h = 0;
	
		if (multi) {
			text = text.split("\n");
			for (c = 0; c < text.length; c++) {
				s  = o._getBounds(text[c]);
				w  = Math.fmax(w, s.width);
				h += s.height;
			}
		} else {
			for (c = 0; c < text.length; c++) {
				i = text.charCodeAt(c) - o._firstLetter;
				s = o.getSection(i);
				w += s.width;
				h  = Math.fmax(s.height, h);
			}
		}
	
		return new G.Size(w, h);
	}
	
	var constant = G.Font;

	constant.AH_LEFT   = 0;
	constant.AH_CENTER = 1;
	constant.AH_RIGHT  = 2;
	constant.AV_TOP    = 0;
	constant.AV_MIDDLE = 1;
	constant.AV_BOTTOM = 2;

})();
