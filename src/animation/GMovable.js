/*
 * Gamalto.Movable
 * ---------------
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
	gamalto.devel.require("Vector2");

	/* Aliases */
	var _Vector2 = G.Vector2;

	/**
	 * Base object to create a movable entity. It's not meant to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Movable
	 * @augments Gamalto.Object
	 */
	var _Object = G.Movable = function() {
		/**
		 * Fractional part of the previous displacement.
		 *
		 * @protected
		 * @internal
		 * @ignore
		 *
		 * @member {Gamalto.Vector2}
		 */
		this.frac_ = new _Vector2(0, 0);
		/**
		 * Current expected displacement of the entity in pixels.
		 *
		 * @protected
		 * @internal
		 * @ignore
		 *
		 * @member {Gamalto.Vector2}
		 */
		this.curr_ = new _Vector2(0, 0);
		/**
		 * Displacement speed in pixels per millisecond.
		 *
		 * @protected
		 * @ignore
		 *
		 * @member {Gamalto.Vector2}
		 */
		this.speed_ = new _Vector2(0, 0);
	};

	/** @alias Gamalto.Movable.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Sets the maximum displacement speed of the entity.
	 *
	 * @param {number} sx
	 *        Maximum horizontal speed in pixels per second.
	 * @param {number} sy
	 *        Maximum vertical speed in pixels per second.
	 */
	proto.setSpeed = function(sx, sy) {
		var speed = this.speed_;
		speed.x = sx / 1000 || 0;
		speed.y = sy / 1000 || 0;
	};

	/**
	 * Resets the displacement properties of the movable entity.
	 */
	proto.reset = function() {
		this.curr_.x = this.curr_.y =
		this.frac_.x = this.frac_.y = 0;
	};

	/**
	 * Gets the computed displacement of the movable entity.
	 * This method should be overridden to add specific behaviors
	 * like acceleration.
	 *
	 * @protected
	 * @virtual
	 * @ignore
	 *
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@link Gamalto.ITiming} from which the elapsed
	 *         time will be read.
	 * @param  {number} dx
	 *         Value beween -1 and +1 indicating the desired horizontal
	 *         displacement.
	 * @param  {number} dy
	 *         Value beween -1 and +1 indicating the desired vertical
	 *         displacement.
	 *
	 * @return {Gamalto.Vector2} Displacement to be applied to the entity
	 *         in pixels including the fractional part.
	 */
	proto.getDisplacement_ = function(timer, dx, dy) {
		var speed = this.speed_;
		var time = timer.elapsedTime;
		return new _Vector2(speed.x * dx * time, speed.y * dy * time);
	};

	/**
	 * Updates the internal displacement state of the movable entity.
	 *
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@link Gamalto.ITiming} from which the elapsed
	 *         time will be read.
	 * @param  {number} dx
	 *         Value beween -1 and +1 indicating the horizontal displacement.
	 * @param  {number} dy
	 *         Value beween -1 and +1 indicating the vertical displacement.
	 *
	 * @return {Gamalto.Vector2} Effective displacement to be applied to
	 *         the entity in pixels.
	 */
	proto.update = function(timer, dx, dy) {
		var frac = this.frac_;
		var disp = this.getDisplacement_(timer, dx, dy);

		frac.x += disp.x;
		frac.y += disp.y;

		disp.x = frac.x | 0;	// Round
		disp.y = frac.y | 0;

		frac.x -= disp.x;
		frac.y -= disp.y;

		return (this.curr_ = disp);
	};

})();
