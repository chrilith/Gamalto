/*
 * Gamalto.Canvas2D
 * ----------------
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
	 * Dependencies
	 */
	gamalto.devel.require("BaseCanvas");
	gamalto.devel.using("Renderer2D");

	/**
	 * Aliases
	 */
	var _BaseCanvas = G.BaseCanvas;

	/**
	 * Creates a canvas based on the W3C Canvas 2D API.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Canvas2D
	 * @augments Gamalto.BaseCanvas
	 *
	 * @param {number} width
	 *        Width of the canvas in pixels.
	 * @param {number} height
	 *        Height of the canvas in pixels.
	 */
	var _Object = G.Canvas2D = function(width, height) {
		Object.base(this, width, height);
	};

	/** @alias Gamalto.Canvas2D.prototype */
	var proto = _Object.inherits(_BaseCanvas);

	/* Register the canvas */
	_BaseCanvas.addObject_("MODE_NATIVE2D", _Object);

	/**
	 * @see Gamalto.BaseCanvas
	 * @ignore
	 */
	proto.setSize_ = function(width, height) {
		_Object.base.setSize_.call(this, width, height);
		this.context_ = this.canvas.getContext("2d");
	};

	/**
	 * Creates a renderer for the current canvas type.
	 *
	 * @return {Gamalto.Renderer2D} Object instance.
	 */
	proto.createRenderer = function() {
		return new G.Renderer2D(this);
	};

	/**
	 * @see Gamalto.BaseCanvas
	 * @ignore
	 */
	proto.export_ = function() {
		return this.context_.getImageData(0, 0, this.width, this.height);
	};

	/**
	 * @see Gamalto.BaseCanvas
	 * @ignore
	 */
	proto.import_ = function(data) {
		this.context_.putImageData(data, 0, 0);
	};



	proto._createRawBuffer = function() {
		var ctx = this.context_;

		// .createImageData() is not supported in CocoonJS up to v1.4.1
		return (ctx.createImageData)
			? ctx.createImageData(this.width, this.height)
			: ctx.getImageData(0, 0, this.width, this.height);
	};

	proto._copyRawBufferIndexed = function(palette, raw, x, y) {
		var color, index;
		var pixel	= 0;
		var pos		= -1;
		var buf		= this._createRawBuffer();	// TODO: cache raw buffer
		var dest	= buf.data;
		var data	= raw.data;

		while (++pos < (data.length || data.byteLength)) {
			index = data[pos];
			color = palette[index];

			dest[pixel++] = color.r;
			dest[pixel++] = color.g;
			dest[pixel++] = color.b;
			dest[pixel++] = color.a;
		}

		this._copyRawBuffer(buf, x, y);
	};

})();
