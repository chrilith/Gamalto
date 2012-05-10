(function() {
	
	G.using("Color");
	G.using("Pattern");
	G.using("Renderer");
	G.using("SpriteSheet");
	G.using("Surface");
	G.using("Timer");

	GE.Fader = function(surface, style, duration) {
		var o = this;
		o._base = surface;
		o.surface = new G.Surface(surface.width, surface.height);
		o.setStyle(style || new G.Color());
		o._duration = duration || 1000;
		o.reset();
	
	//- o.callback = null;
	}
	
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
					c = new G.Pattern(s.bitmap, s.getSection(i));
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
