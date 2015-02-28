/*
 * Gamalto.BaseCanvas
 * 
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	var _Object = G.BaseCanvas = function(width, height) {
		this._initCanvas();
		this._setSize(width, height);
	},
	_proto = _Object.inherits(G.Object);

	_proto._setSize = function(width, height) {
		var ctx, canvas = this.__canvas;
		canvas.width  = this.width  = +width  || 0;
		canvas.height = this.height = +height || 0;
	};

	_proto.getRendererType = function() { };

	_proto.hasContext = function() {
		return !!this._getContext();
	};

	_proto._initCanvas = function() {
		/* This will never change */
		this.__canvas = document.createElement("canvas");	
	};

	_proto._getCanvas = function() {
		return this.__canvas;
	}

	_proto._getContext = function() {
		return this._context;
	}

	_proto._getRawBuffer = function() { };

	_proto._createRawBuffer = function() { };

	_proto._copyRawBuffer = function(raw, x, y) { };

	_proto._copyRawBufferIndexed = function(palette, raw, x, y) { };

})();