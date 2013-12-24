/*
 * Gamalto.BaseRenderer
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
	
	/**
	 * Dependencies
	 */
	// ...
	
	/**
	 * @constructor
	 */
	G.BaseRenderer = function(surface) {
		this._surface = surface;
		this.reset();
	};
	
	/* Inheritance and shortcut */
	var proto = G.BaseRenderer.inherits(G.Object);
	
	/* Instance methods */	
	proto.setFlipX = function(isOn) {
		this._flipX = !!isOn;
	}

	proto.getFlipX = function() {
		return this._flipX;
	}
	
	proto.setFlipY = function(isOn) {
		this._flipY = !!isOn;
	}

	proto.getFlipY = function() {
		return this._flipY;
	}
	
	proto.setAlpha = function(value) {
		this._alpha = (value || 0);
	}
	
	proto.setOrigin = function(x, y) {
		this._origin = new G.Vector(x, y);
	}
	
	proto.setScale = function(x, y) {
		this._scaleX = (x || 1);
		this._scaleY = (y || x || 1);
	}
	
	proto.setRotation = function(angle) {
		this._rotate = (angle || 0) * Math.PI / 180;
	}

	proto.enableMask = function(isOn) {
		this._mask = isOn;
	}

	proto.reset = function() {
		this.setAlpha(1);
		this.setScale();
		this.setRotation();
		this.setOrigin(0, 0);
		this.setTransform(true);
		this._reset();
	}

	proto.setTransform = function(isOn) {
		var old = this._trans;
		this._trans = !!isOn;
		return old;
	}

	// Called by Surface and Scroller to prevent unexpected transformation
	proto._reset = function() { /* To be implemented, should be replace with setTransform() */ }

	/* Should be called before accessing _canvas */
	proto.flush = function() { /* Nothing to do */ }

	/* Used only when altering the canvas content */
	proto._getContext = function() {
		return this._surface._context;
	}

})();
