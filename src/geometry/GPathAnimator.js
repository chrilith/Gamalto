/*
 * Gamalto.PathAnimator
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012-2015 Chris Apers and The Gamalto Project, all rights reserved.

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

	/* Dependencies */
	gamalto.dev.using("Path");

	/**
	 * @constructor
	 */
	var _Object = G.PathAnimator = function(path, duration) {
		Object.base(this);
		this.path = path;
		this.duration = duration;	// msecs
	},

	/* Inheritance and shortcut */
	proto = _Object.inherits(G.Animator);

	/* Instance methods */
	proto.update = function(timer) {
		_Object.base._update.call(this, timer, false, [this.duration]);

		var path = this.path,
			position = this.progress * path.length,
			vertices = path.vertices_,
			distances = path.distances_,
			i, dist, amount;

		for (i = 0; i < distances.length; i++) {
			dist = distances[i];
			if (position < dist) {
				break;
			}
			position -= dist;
		}

		amount = position / dist;

		if (i == distances.length && this.progress == 1) {
			return vertices[i].clone();
		}

		position = G.Vector2.lerp(vertices[i], vertices[i + 1], amount);
		position.x |= 0;
		position.y |= 0;

		return position;
	};

})();
