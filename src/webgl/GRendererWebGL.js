/*
 * Gamalto.RendererWebGL
 * ---------------------
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

// http://learningwebgl.com/blog/?p=859
// http://media.tojicode.com/webgl-samples/js/webgl-tilemap.js

(function(ns) {

	/**
	 * Dependencies
	 */
	gamalto.devel.require("BaseRenderer");
	gamalto.devel.require("TextLibrary");
	
	/* Initialization */
	var _shaders,
		_path = ns.getCurrentPath();

	ns.addInitializer(function() {		
		_shaders = new G.TextLibrary();
		_shaders.pushItem("position", _path + "shaders/rdr_position.vert");
		_shaders.pushItem("fillColor", _path + "shaders/rdr_fill-color.frag");
		_shaders.pushItem("fillTexture", _path + "shaders/rdr_fill-texture.frag");

		_shaders.load().then(function() {
			ns.nextInitializer();
		});
	});

	/**
	 * @constructor
	 */
	var _Object = G.RendererWebGL = function(canvas) {
		Object.base(this, canvas);
	};
	
	/* Inheritance and shortcut */
	var proto = _Object.inherits(G.BaseRenderer);
	
	/* Instance methods */
	proto._init = function() {
		_Object.base._init.call(this);

		var gl = this._getContext();

		var s1 = G.Shader.load(gl, _shaders.getItem("positions"), gl.VERTEX_SHADER);
		var s2 = G.Shader.load(gl, _shaders.getItem("fillColor"), gl.FRAGMENT_SHADER);
		var s3 = G.Shader.load(gl, _shaders.getItem("fillTexture"), gl.FRAGMENT_SHADER);

		this._program = [
			G.Shader.program(gl, [s1, s2]),
			G.Shader.program(gl, [s1, s3])];

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	};

	proto.drawBitmap = function(bitmap, x, y) {
		this.drawBitmapSection(bitmap, x, y);
	};

	proto.drawBitmapSection = function(bitmap, x, y, r) {
		var gl = this._getContext(),
			p = this._program[1],
			gc = bitmap.getCanvas_;

		gl.useProgram(this._program[1]);

		var positionLocation = gl.getAttribLocation(p, "aPosition");
		var texCoordLocation = gl.getAttribLocation(p, "aTexCoord");
		var cropLocation = gl.getUniformLocation(p, "uClip");

		var iw = bitmap.width,
			ih = bitmap.height,
			ww = 1,
			hh = 1;

		if (!r) {
			gl.uniform4f(cropLocation, 0, 0, 1, 1);
		} else {
			var xx = r.origin.x / iw,
				yy = r.origin.y / ih;
			ww = r.extent.x / iw;
			hh = r.extent.y / ih;

			gl.uniform4f(cropLocation, xx, yy, ww, hh);
		}

		// provide texture coordinates for the rectangle.
		var texCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		  0,  0,
		  1,  0,
		  0,  1,
		  0,  1,
		  1,  0,
		  1,  1]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(texCoordLocation);
		gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
/*
CANNOT CACHE TEX LIKE THIS BECAUSE CONTEXT MAY BE LOST
// http://www.khronos.org/webgl/wiki/HandlingContextLost
// http://asalga.wordpress.com/2011/08/01/using-webgl-readpixels-turn-on-preservedrawingbuffer/

		var texture = bitmap._texture;
		if (!texture) {
			bitmap._texture = texture = gl.createTexture();
		}
*/
		var texture = texture = gl.createTexture();;
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._filtering ? gl.NEAREST : gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._filtering ? gl.NEAREST : gl.LINEAR);

		// For scrolling, we allow passing a context directly
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gc ? bitmap.getCanvas_() : bitmap); 

		var x1 = x,
			y1 = y,
			x2 = x + iw * ww,
			y2 = y + ih * hh,
			points = [
				x1, y1,
				x2, y1,
				x1, y2,

				x1, y2,
				x2, y1,
				x2, y2];

		var buffer = this._initDraw(p, points);

		// draw
		gl.drawArrays(gl.TRIANGLES, 0, points.length >> 1);
	};

	proto.enableFiltering = function(isOn) {
		this._filtering = !!isOn;
	};

	proto._setStyle = function(style) {
		var gl = this._getContext();

		var colorLocation = gl.getUniformLocation(this._program[0], "uColor");
		gl.uniform4f(colorLocation, style.r / 255, style.g / 255, style.b / 255, style.a / 255);
	};

	proto._initDraw = function(program, points) {
		var gl = this._getContext(),
			s = this.canvas;

		var positionLocation = gl.getAttribLocation(program, "aPosition");
		var resolutionLocation = gl.getUniformLocation(program, "uResolution");

		gl.uniform2f(resolutionLocation, s.width, s.height);

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		return buffer;
	};

	proto._drawShape = function(type, points, style) {
		var gl = this._getContext(),
			p = this._program[0];

		this._setStyle(style);
		this._initDraw(p, points);
		gl.drawArrays(type, 0, points.length >> 1);
	};
	
	proto.fillRect = function(r, style) {
		var s = this.canvas,
			x = 0,
			y = 0, w, h, v;

		if (r) {
			x = r.origin.x;
			y = r.origin.y;
			w = r.extent.x;
			h = r.extent.y;
		} else {
			w = s.width;
			h = s.height;
		}

		var gl = this._getContext(),
			x1 = x,
			y1 = y,
			x2 = x + w,
			y2 = y + h;

		gl.useProgram(this._program[0]);
		this._drawShape(gl.TRIANGLES, [
			x1, y1,
			x2, y1,
			x1, y2,

			x1, y2,
			x2, y1,
			x2, y2], style);
	};

	proto.clearRect = function(r) {
		var gl = this._getContext();

		gl.disable(gl.BLEND);
		this.fillRect(r, new G.Color(0, 0, 0, 0));
		gl.enable(gl.BLEND);
	};

	proto.hLine = function(x, y, w, style) {
		var gl = this._getContext();

		x = (x | 0) + 0.0;
		y = (y | 0) + 0.5;

		gl.useProgram(this._program[0]);
		this._drawShape(gl.LINES, [
			x, y,
			x + w, y], style);
	};

	proto.vLine = function(x, y, h, style) {
		var gl = this._getContext();

		x = (x | 0) + 0.5;
		y = (y | 0) + 0.5;

		gl.useProgram(this._program[0]);
		this._drawShape(gl.LINES, [
			x, y,
			x, y + h], style);
	};
	
	proto._transform = function(x, y, w, h) {
	};

	proto._clip = function(r) {
		var gl = this._getContext();

		if (!r) {
			gl.disable(gl.SCISSOR_TEST);
		} else {
			var y = this.canvas.height - r.extent.y - r.origin.y;

			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(r.origin.x, y, r.extent.x, r.extent.y);
		}
	};

})(Gamalto);
