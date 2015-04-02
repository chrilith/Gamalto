/*
 * Gamalto.BaseCanvas
 * ------------------
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

	/**
	 * Abstract object to create a drawing canvas.
	 *
	 * @bastract
	 * 
	 * @memberof Gamalto
	 * @constructor Gamalto.BaseCanvas
	 * @augments Gamalto.Object
	 */
	var _Object = G.BaseCanvas = function(width, height) {
		this._initCanvas();
		this._setSize(width, height);
	},

	/** @alias Gamalto.BaseCanvas.prototype */
	proto = _Object.inherits(G.Object);

	_proto._setSize = function(width, height) {
		var ctx, canvas = this.__canvas;
		canvas.width  = this.width  = Number(width)  || 0;
		canvas.height = this.height = Number(height) || 0;
	};

	/**
	 * Creates a renderer for the current canvas type.
	 *
	 * @function createRenderer
	 * @memberof Gamalto.BaseCanvas.prototype
	 * @abstract
	 *
	 * @return {Gamalto.BaseRenderer} Object instance implementing {@link Gamalto.BaseRenderer}.
	 */

	proto.hasContext = function() {
		return !!this._getContext();
	};

	proto._initCanvas = function() {
		/* This will never change */
		this.__canvas = document.createElement("canvas");	
	};

	proto.getCanvas_ = function() {
		return this.__canvas;
	};

	proto._getContext = function() {
		return this._context;
	};

	proto._getRawBuffer = function() { };

	proto._createRawBuffer = function() { };

	proto._copyRawBuffer = function(raw, x, y) { };

	proto._copyRawBufferIndexed = function(palette, raw, x, y) { };

})();
