/*
 * Gamalto.PathAnimator
 * --------------------
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

	/* Dependencies */
	gamalto.devel.require("Animator");
	gamalto.devel.using("Path");
	gamalto.devel.using("Vector2");
	gamalto.devel.needing("ITiming");

	/**
	 * Creates a new path animator.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.PathAnimator
	 * @augments Gamalto.Animator
	 *
	 * @param {Gamalto.Path} path
	 *        Path to be used for the animation.
	 * @param {number} duration
	 *        Duration of the animation.
	 *
	 * @example
	 * var anim = new Gamalto.PathAnimator(path, 1000);
	 */
	var _Object = G.PathAnimator = function(path, duration) {
		Object.base(this);
		this.path = path;
		this.duration = duration;	// In msecs
	};

	/** @alias Gamalto.PathAnimator.prototype */
	var proto = _Object.inherits(G.Animator);

	/**
	 * Updates path animation state.
	 *
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@link Gamalto.ITiming} object from which the elpased
	 *         time will be read.
	 *
	 * @return {Gamalto.Vector2} New position on the path.
	 */
	proto.update = function(timer) {
		_Object.base.update_.call(this, timer, false, [this.duration]);

		var i, dist, amount;
		var path = this.path;
		var position = this.progress * path.length;
		var vertices = path.vertices;
		var distances = path.distances;

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
