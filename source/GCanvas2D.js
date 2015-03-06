/*
 * Gamalto.Canvas2D
 * 
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	/**
	 * Dependencies
	 */
	gamalto.require_("BaseCanvas");
	gamalto.using_	("Renderer2D");

	var _Object = G.Canvas2D = function(width, height) {
		Object.base(this, width, height);
	},
	_proto = _Object.inherits(G.BaseCanvas);

	_proto._setSize = function(width, height) {
		_Object.base._setSize.call(this, width, height);
		this._context = this.__canvas.getContext("2d");
	};

	_proto.getRendererType = function() {
		return G.Renderer2D;
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