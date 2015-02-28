/*
 * Gamalto.CanvasWebGL
 * 
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function(initializer) {

	/* Dependencies */
	gamalto.require_("BaseCanvas");
	gamalto.using_	("RendererWebGL");
	gamalto.using_	("Shader");

	/* Initialization */
	var _shaders;

	initializer.addInitializer(function() {
		var path = initializer.getCurrentPath();

		_shaders = new G.TextLibrary();
		_shaders.pushItem("position", path + "shaders/cvs-position.vert");
		_shaders.pushItem("fillTexture", path + "shaders/cvs-fill-texture-indexed.frag");

		_shaders.load().then(function() {
			initializer.nextInitializer();
		});
	});

	/**
	 * @constructor
	 */
	var _Object = G.CanvasWebGL = function(width, height) {
		Object.base(this, width, height);
	},
	_proto = _Object.inherits(G.BaseCanvas);

	_proto._setSize = function(width, height) {
		_Object.base._setSize.call(this, width, height);
		try {
			var opt = { preserveDrawingBuffer: true },	// For WebKit
			canvas = this.__canvas,
			gl = this._context = canvas.getContext("webgl", opt) ||
								 canvas.getContext("experimental-webgl", opt);

			var s1 = G.Shader.load(gl, _shaders.getItem("position"), gl.VERTEX_SHADER);
			var s2 = G.Shader.load(gl, _shaders.getItem("fillTexture"), gl.FRAGMENT_SHADER);

			this._program = [G.Shader.program(gl, [s1, s2])];
		} catch(e) {  }
	};

	_proto.getRendererType = function() {
		return G.RendererWebGL;
	};

	_proto._copyRawBufferIndexed = function(palette, raw, x, y) {
		var gl = this._context,
			program = this._program[0],
			data = raw.data,
			width = raw.width,
			height = raw.height;

// HACK
// TODO: change palette _list[]
		var pal = palette, index = 0;
		palette = new Uint8Array(256 * 4);	// FIXME: Seems to required 256 colors

		for (var i = 0; i < pal.length; i++) {
		    palette[index * 4 + 0] = pal[i].r;
		    palette[index * 4 + 1] = pal[i].g;
		    palette[index * 4 + 2] = pal[i].b;
		    palette[index * 4 + 3] = pal[i].a;
		    index++;
		}
// HACK
		gl.useProgram(program);
		// TODO: Should be enabled only if the palette has a transparenet color
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		var positionLocation = gl.getAttribLocation(program, "aPosition"),
			paletteLocaction = gl.getUniformLocation(program, "uPalette"),
			imageLocation = gl.getUniformLocation(program, "uImage");

		gl.uniform1i(paletteLocaction, 0);	// GL_TEXTURE0
		gl.uniform1i(imageLocation, 1);		// GL_TEXTURE1

		var paletteTex = gl.createTexture();

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, paletteTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

		var imageTex = gl.createTexture();

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, imageTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, width, height, 0, gl.ALPHA, gl.UNSIGNED_BYTE, data);

		var positions = [
			 1,  1,  
			-1,  1,  
			-1, -1,  
			 1,  1,  
			-1, -1,  
			 1, -1	];

		var vertBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);		
	};

})(Gamalto);
