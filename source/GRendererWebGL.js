/*
 * Gamalto.RendererWebGL
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


// http://learningwebgl.com/blog/?p=859
// http://media.tojicode.com/webgl-samples/js/webgl-tilemap.js

(function() {

	var shaders = [
		[	"attribute vec2 aPosition;",
			"attribute vec2 aTexCoord;",
			"uniform vec2 uResolution;",
			"varying vec2 vTexCoord;",

			"void main() {",
			   // convert the rectangle from pixels to 0.0 to 1.0
			  "vec2 zeroToOne = aPosition / uResolution;",

			   // convert from 0->1 to 0->2
			   "vec2 zeroToTwo = zeroToOne * 2.0;",

			   // convert from 0->2 to -1->+1 (clipspace)
			   "vec2 clipSpace = zeroToTwo - 1.0;",

			   "gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);",

				// pass the texCoord to the fragment shader
				// The GPU will interpolate this value between points.
				"vTexCoord = aTexCoord;",

			"}"].join('\n'),

		[	"precision mediump float;",
			"uniform vec4 uColor;",

			"void main() {",
			"	gl_FragColor = uColor;",

			"}"].join('\n'),

		[	"precision mediump float;",

			// our texture
			"uniform sampler2D uImage;",
			"uniform vec4 uClip;",

			// the texCoords passed in from the vertex shader.
			"varying vec2 vTexCoord;",

			"void main() {",
  			"	gl_FragColor = texture2D(uImage, (vec2(vTexCoord.x * uClip.z, vTexCoord.y * uClip.w) + uClip.xy));",
//			"   gl_FragColor = texture2D(uImage, vTexCoord);",

			"}"].join('\n'),
	];

	/**
	 * Dependencies
	 */
	gamalto.require_("BaseRenderer");
	gamalto.using_("Bitmap");
	gamalto.using_("Rect");
	gamalto.using_("Surface");
	
	/**
	 * @constructor
	 */
	G.RendererWebGL = function(surface) {
		Object.base(this, surface);

		var gl = this._getContext();

		var s1 = G.Shader.load(gl, shaders[0], gl.VERTEX_SHADER);
		var s2 = G.Shader.load(gl, shaders[1], gl.FRAGMENT_SHADER);
		var s3 = G.Shader.load(gl, shaders[2], gl.FRAGMENT_SHADER);

		this._program = [
			G.Shader.program(gl, [s1, s2]),
			G.Shader.program(gl, [s1, s3])];

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	};
	
	/* Inheritance and shortcut */
	var proto = G.RendererWebGL.inherits(G.BaseRenderer);
	
	/* Instance methods */
	proto.drawBitmap = function(bitmap, x, y) {
		this.drawBitmapSection(bitmap, x, y);
	}

	proto.drawBitmapSection = function(bitmap, x, y, r) {
		var gl = this._getContext(),
			p = this._program[1],
			gc = bitmap._getCanvas;

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
			var xx = r.tL.x / iw,
				yy = r.tL.y / ih;
			ww = r.width / iw;
			hh = r.height / ih;

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
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gc ? bitmap._getCanvas() : bitmap); 

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
	}

	proto.enableFiltering = function(isOn) {
		this._filtering = !!isOn;
	}

	proto._setStyle = function(style) {
		var gl = this._getContext();

		var colorLocation = gl.getUniformLocation(this._program[0], "uColor");
		gl.uniform4f(colorLocation, style.r / 255, style.g / 255, style.b / 255, style.a / 255);
	}

	proto._initDraw = function(program, points) {
		var gl = this._getContext(),
			s = this._surface;

		var positionLocation = gl.getAttribLocation(program, "aPosition");
		var resolutionLocation = gl.getUniformLocation(program, "uResolution");

		gl.uniform2f(resolutionLocation, s.width, s.height);

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		return buffer;
	}

	proto._drawShape = function(type, points, style) {
		var gl = this._getContext(),
			p = this._program[0];

		this._setStyle(style);
		this._initDraw(p, points);
		gl.drawArrays(type, 0, points.length >> 1);
	}
	
	proto.fillRect = function(r, style) {
		var s = this._surface,
			x = 0,
			y = 0, w, h, v;

		if (r) {
			x = r.tL.x;
			y = r.tL.y;
			w = r.width;
			h = r.height;
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
	}

	proto.clearRect = function(r) {
		var gl = this._getContext();

		gl.disable(gl.BLEND);
		this.fillRect(r, new G.Color(0, 0, 0, 0));
		gl.enable(gl.BLEND);
	}

	proto.hLine = function(x, y, w, style) {
		var gl = this._getContext();

		x = (x | 0) + 0.0;
		y = (y | 0) + 0.5;

		gl.useProgram(this._program[0]);
		this._drawShape(gl.LINES, [
			x, y,
			x + w, y], style);
	}

	proto.vLine = function(x, y, h, style) {
		var gl = this._getContext();

		x = (x | 0) + 0.5;
		y = (y | 0) + 0.5;

		gl.useProgram(this._program[0]);
		this._drawShape(gl.LINES, [
			x, y,
			x, y + h], style);
	}
	
	proto._transform = function(x, y, w, h) {
	}

	// Called by Surface and Scroller to prevent unexpected transformation
	proto._reset = function() {
	}

	/* Should be called before accessing _canvas */
	proto.flush = function() { /* Nothing to do */ }

})();
