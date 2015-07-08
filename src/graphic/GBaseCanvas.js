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
	 * Factory stuff
	 */
	var canvases = [];
	var mode = 0;

	/**
	 * Abstract object to create a drawing canvas.
	 *
	 * @bastract
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BaseCanvas
	 * @augments Gamalto.Object
	 *
	 * @param {number} width
	 *        Width of the canvas in pixels.
	 * @param {number} height
	 *        Height of the canvas in pixels.
	 */
	var _Object = G.BaseCanvas = function(width, height) {
		/**
		 * Internal canvas object.
		 *
		 * @member {object}
		 * @readonly
		 * @alias Gamalto.BaseCanvas#canvas
		 */
		this.canvas = document.createElement("canvas");

		this.setSize_(width, height);
	};

	/** @alias Gamalto.BaseCanvas.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Initializes the internal canvas object.
	 *
	 * @protected
	 * @ingore
	 *
	 * @param {number} width
	 *        Width of the canvas in pixels.
	 * @param {number} height
	 *        Height of the canvas in pixels.
	 */
	proto.setSize_ = function(width, height) {
		var canvas = this.canvas;

		canvas.width = this.width = Number(width) || 0;
		canvas.height = this.height = Number(height) || 0;
	};

	/**
	 * Gets the current context of the cnavas.
	 * May be overidden for expiring context.
	 *
	 * @protected
	 * @ignore
	 *
	 * @return {object} Current canvas context.
	 */
	proto.getContext_ = function() {
		return this.context_;
	};

	/**
	 * Gets an object than can be drawn on a HTMLCanvasElement.
	 *
	 * @internal
	 * @ignore
	 *
	 * @return {object} HTMLCanvasElement.
	 */
	proto.getDrawable_ = function() {
		return this.canvas;
	};

	/**
	 * Context of the internal canvas.
	 *
	 * @member {object}
	 * @readonly
	 * @alias Gamalto.BaseCanvas#context
	 */
	Object.defineProperties(proto, {
		"context": {
			get: function() {
				return this.getContext_();
			}
		}
	});

	proto._getRawBuffer = function() { };

	proto._createRawBuffer = function() { };

	proto._copyRawBuffer = function(raw, x, y) { };

	proto._copyRawBufferIndexed = function(palette, raw, x, y) { };

	/**
	 * Creates a renderer for the current canvas type.
	 *
	 * @function createRenderer
	 * @memberof Gamalto.BaseCanvas.prototype
	 * @abstract
	 *
	 * @return {Gamalto.BaseRenderer} Object instance implementing
	 *         {@link Gamalto.BaseRenderer}.
	 */

	/**
	 * Adds an object to the factory.
	 *
	 * @ignore
	 *
	 * @param {string} name
	 *        Name of the constant.
	 * @param {object} item
	 *        Object type.
	 */
	_Object.addObject_ = function(name, item) {
		_Object[name] = ++mode; // For next object registration
		canvases.push(item);
	};

	/**
	 * Creates a canvas using the specified parameters.
	 *
	 * @ignore
	 *
	 * @param  {number} mode
	 *         Canvas mode.
	 * @param {number} width
	 *        Width of the canvas in pixels.
	 * @param {number} height
	 *        Height of the canvas in pixels.
	 *
	 * @return {Gamalto.BaseCanvas} New instance of the requested canvas type.
	 */
	_Object.create_ = function(mode, width, height) {
		// Return the first by default
		return new canvases[(mode || 1) - 1](width, height);
	};

})();
