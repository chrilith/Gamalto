/*
 * Gamalto Global Environement
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
	gamalto.using_("Color");
	gamalto.using_("Pattern");
	gamalto.using_("Renderer");
	gamalto.using_("SpriteSheet");
	gamalto.using_("Surface");
	gamalto.using_("Timer");

	/**
	 * @constructor
	 */
	GE.Fader = function(surface, style, duration) {
		var o = this;
		o._base = surface;
		o.surface = new G.Surface(surface.width, surface.height);
		o.setStyle(style || new G.Color());
		o._duration = duration || 1000;
		o.reset();
	
	//- o.callback = null;
	}
	
	/* Inheritance and shortcut */
	var proto = GE.Fader.inherits(G.Object);
	
	proto.reset = function() {
		this._old = 0;
	}
	
	proto.setStyle = function(style) {
		this._style = style;
	}
	
	proto.update = function(timer, dir) {
		var o = this,
			l = o._old,
			d = o._duration,
			time = timer.elapsedTime,
			callback = o.callback,
			inFrame  = (l <= d),
			progress = (o._old += time) / d;

		o._pos = (dir == GE.IN ? 1 : 0) + Math.fmin(1, progress) * dir;

		if (inFrame) {
			o._paint();
		} else if (callback) {
			callback(time, o);
		}
		return inFrame;
	}
	
	proto._paint = function() {
		var o = this,
			s = o._style,
			b = o.surface,
			r = b.renderer,
			q = s.is(G.SpriteSheet),
			i, c;
	
		b.clear();
		r.setAlpha(1);
		r.enableMask(false);
	
		if (s._canvas) {		// Surface or Bitmap
			b.blit(s, 0, 0);
		} else {
			if (q) {
				i = Math.fmax((o._pos * s.length | 0) - 1, 0);

				c = o._cache;
				if (!c || c.tag != i) {
					c = new G.Pattern(s._bitmap, s.getSection(i));
					c.tag = i;
					o._cache = c;
				}
				s = c;
			}
			r.fillRect(null, s);
		}

		if (q)	{ r.enableMask(true); }
		else	{ r.setAlpha(1 - o._pos); }
		r.drawBitmap(o._base, 0, 0);
	}
	
	GE.IN  = -1;
	GE.OUT = +1;

})();
