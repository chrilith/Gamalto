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

	var _Object = G.Canvas2D = function(width, height) {
		Object.base(this, width, height);
	},
	_proto = _Object.inherits(G.BaseCanvas);

	_proto._setSize = function(width, height) {
		_Object.base._setSize.call(this, width, height);
		this._context = this.__canvas.getContext("2d");
	};

	_proto.createRenderer = function() {
		return new G.Renderer2D(this);
	};

	_proto._getRawBuffer = function() {
		return this._context.getImageData(0, 0, this.width, this.height);
	};

	_proto._createRawBuffer = function() {
		var ctx = this._context;
		// createImageData() is not supported in CocoonJS up to v1.4.1 
		return (ctx.createImageData)
			? ctx.createImageData(this.width, this.height)
			: ctx.getImageData(0, 0, this.width, this.height);
	};

	_proto._copyRawBuffer = function(raw, x, y) {
		this._context.putImageData(raw, x || 0, y || 0);
	};

	_proto._copyRawBufferIndexed = function(palette, raw, x, y) {
		var color, index,
			pixel	= 0,
			pos		= -1,
			buf		= this._createRawBuffer(),	// TODO: cache raw buffer
			dest	= buf.data,
			data	= raw.data;

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