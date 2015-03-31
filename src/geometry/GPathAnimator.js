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
