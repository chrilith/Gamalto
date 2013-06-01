/*
 * Gamalto.Timer
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

(function(env) {

	/* Dependencies */
	/* ... */

	/**
	 * @constructor
	 */
	G.Timer = function(callback, rate, skip) {
		Object.base(this);
		
		this._cb = callback;
	
		this.setFrameRate(rate || 25);
		this.setSkipRatio(skip || 0);
	};
	
	/* Inheritance and shortcut */
	var proto = G.Timer.inherits(G.Object);
	
	/* Instance methods */
	proto.setFrameRate = function(rate) {
		this._tolerance = 500 + (this._frameTime = 1000 / rate);
		this.setSkipRatio(this._frameSkipRatio);
	}
	
	proto.setSkipRatio = function(ratio) {
		this._skipped = 0;
		this._frameSkipRatio = ratio;
		this._frameSkip = (1000 / this._frameTime * ratio / 100) | 0;
	}
	
	proto._nextWait = function(prev) {
		var that = this,
			elasped = Date.now() - prev,
			wait = that._frameTime - elasped + (that._overWait | 0);
	
		if (elasped > that._tolerance) {
			return that._frameTime;
	
		} else if (wait < 0) {
			that._overWait = wait;
			that._shouldSkip = (that._skipped++ < that._frameSkip);
			if (that._skipped == that._frameSkip)
				that._skipped = 0;
			return 0;
		}
		that._overWait = 0;
		that._shouldSkip = false;
		return wait;
	}

	proto.getElapsed = function() {
		var e = (Date.now() - this._lastTime);
		return e >= this._tolerance ? 0 : e;
	}

	proto.start = function(strict) {
		this._stopped = false;
	
		var that = this,
			last = Date.now(),						// Last execution is now
			// TODO: use AnimationFrame but check for expected frame time
			func = strict ? null : env.requestAnimationFrame,	
			next,									// Next iteration duration
			skip, before;
	
		(function callback() {
			// We should quit...
			if (that._stopped) {
				return;
			}
			// Static time since the last call.
			that.elapsedTime = that.getElapsed();
			before = Date.now();

			// Execute the timer if possible, should access "elapsedTime".
			if (!(skip = that._shouldSkip && that._frameSkip)) {
				skip = that._cb(that);
			}

			// Save the last execution time.
			// Don't update the time if we have to skip so that the next frame
			// will take the lost time into account. This time is independent from
			// the internal timer time.
			if (!skip) { that._lastTime = before; }

			// Compute FPS
			last = that.computeFPS__(last, skip);
	
			// Next iteration
			next = that._nextWait(before);
			
			// If we have a real timer, use it
			if (func)	{ func(callback); }
			else		{ env.setTimeout(callback, next); }
		})();
	}

	proto.stop = function() {
		this._stopped = true;
	}
	
	/*	Frames Per Second (FPS) related methods
		For debug purpose only */
	
	proto.computeFPS__ = function(last, skip) {
		var time, elapsed, i, length, sum = 0,
			list = this._ticks,
			callback = this._fpsCb;
	
		if (callback) {
			elapsed = (time = Date.now()) - last;
			if (!skip) {
				this._frameCount++;
			}
			if (elapsed >= 1000) {
				this._tickSum -= list[this._tickIndex] | 0;
				this._tickSum += (list[this._tickIndex] = this._frameCount);
				if (++this._tickIndex == 100) {
					this._tickIndex = 0;
				}
				callback(this._tickSum / this._ticks.length | 0, (1000 / this._frameTime + .5 | 0));
				this._frameCount = 0;
				// If the page is in wait state, "d" whill be far higher than 1000
				// so we use a modulo to extract the over time.
				return time + (elapsed % 1000);
			}
		}
	
		return last;
	}

	var setFPSWatcher__ = function(callback) {
		this._fpsCb = callback;
		this._frameCount = 0;
		this._ticks = [0];
		this._tickSum = 0;
		this._tickIndex = 0;
	};
	proto.setFPSWatcher = setFPSWatcher__;	// Removed in release mode

})(ENV);
