/*
 * Gamalto.PathAnimator
 * --------------------
 * 

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 *
 */

(function() {

	/* Dependencies */
	gamalto.devel.require("Animator");
	gamalto.devel.using("Path");
	gamalto.devel.using("Vector2");

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
		this.duration = duration;	// msecs
	},

	/** @alias Gamalto.PathAnimator.prototype */
	proto = _Object.inherits(G.Animator);

	/**
	 * Updates path animation state.
	 * 
	 * @param  {Gamalto.Timer} timer
	 *         {@link Gamalto.Timer} object from which the elpased time will be read.
	 * 
	 * @return {Gamalto.Vector2} New position on the path.
	 */
	proto.update = function(timer) {
		_Object.base.update_.call(this, timer, false, [this.duration]);

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
