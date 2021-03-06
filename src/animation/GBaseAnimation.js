/*
 * Gamalto.BaseAnimation
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

(function() {

	/* Dependencies */
	gamalto.devel.require("Animator");
	gamalto.devel.using("Vector2");
	gamalto.devel.using("Transform");
	gamalto.devel.needing("ITiming");

	/**
	 * Abstract object to create an animation sequence. It is not meant
	 * to be used directly.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.BaseAnimation
	 * @augments Gamalto.Animator
	 *
	 * @param  {Gamalto.SpriteSheet} sheet
	 *         Sprites sheet containing the sections for the animation.
	 */
	var _Object = G.BaseAnimation = function() {
		/**
		 * Frames to be used for the animation. May be an spritesheet index
		 * or a tile-based block.
		 *
		 * @protected
		 * @ignore
		 *
		 * @type {array.<object>}
		 */
		this.list_ = [];

		/**
		 * Offsets to be used when drawing a sprite.
		 *
		 * @protected
		 * @ignore
		 *
		 * @type {array.<Gamalto.IPoint>}
		 */
		this.offs_ = [];
		/**
		 * Frame durations.
		 *
		 * @protected
		 * @ignore
		 *
		 * @type {array.<number>}
		 */
		this.time_ = [];
		/**
		 * Length of the animation in frames.
		 *
		 * @type {number}
		 * @readonly
		 * @alias Gamalto.BaseAnimation#length
		 */
		this.length = 0;
		/**
		 * Gets or sets the loop state of the animation.
		 *
		 * @member {boolean}
		 * @alias Gamalto.BaseAnimation#loop
		 */
		this.loop = true;

		/**
		 * Drawing transformation information.
		 *
		 * @readonly
		 *
		 * @member {Gamalto.Transform}
		 * @alias Gamalto.BaseAnimation#transform
		 */
		this.transform = new G.Transform();

		this.setOffset();
		Object.base(this);
	};

	/** @alias Gamalto.BaseAnimation.prototype */
	var proto = _Object.inherits(G.Animator);

	/**
	 * Sets the global duration of the animation, for the current
	 * animation content only.
	 * This will reset durations set with
	 * [setFrameDuration()]{@link Gamalto.Animation#setFrameDuration}
	 *
	 * @param {number} time
	 *        Duration in milliseconds.
	 */
	proto.setDuration = function(time) {
		var len = this.length;
		var slice = time / len;
		while (len--) {
			this.time_[len] = slice;
		}
	};

	/**
	 * Sets the local duration of a frame.
	 *
	 * @param {number} frame
	 *        Frame index.
	 * @param {number} time
	 *
	 */
	proto.setFrameDuration = function(frame, time) {
		gamalto.devel.assert(frame < this.list_.length);
		this.time_[frame] = time;
	};

	/**
	 * Sets the global offset of the animation, for the current animation
	 * content only.
	 *
	 * @param {number} x
	 *        Horizontal offset.
	 * @param {number} y
	 *        Vertical offset.
	 */
	proto.setOffset = function(x, y) {
		this.offset_ = new G.Vector2(x, y);
	};

	/**
	 * Sets the local drawing offset of a frame. It will be added to
	 * the global offset.
	 *
	 * @param {number} frame
	 *        Frame index.
	 * @param {number} x
	 *        Horizontal offset.
	 * @param {number} y
	 *        Vertical offset.
	 */
	proto.setFrameOffset = function(frame, x, y) {
		gamalto.devel.assert(frame < this.list_.length);
		this.offs_[frame] = new G.Vector2(x, y);
	};

	/**
	 * Duplicates a frame including all its properties.
	 *
	 * @param  {number} index
	 *         Frame index.
	 * @param  {number} dest
	 *         New frame destination.
	 */
	proto.duplicateFrame = function(index, dest) {
		gamalto.devel.assert(dest <= this.list_.length);

		this.list_.splice(dest, 0, this.list_[index]);
		this.offs_.splice(dest, 0, this.offs_[index]);
		this.time_.splice(dest, 0, this.time_[index]);

		this.length++;
	};

	/**
	 * Updates the animation state.
	 *
	 * @param  {Gamalto.ITiming} timer
	 *         [Timer]{@link Gamalto.ITiming} object from which the elpased
	 *         time will be read.
	 *
	 * @return {boolean} Playing state.
	 */
	proto.update = function(timer) {
		return _Object.base
			.update_.call(this, timer, this.loop, this.time_);
	};

	/**
	 * Draws the current animation frame.
	 *
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the {@linkcode Gamalto.surface} to which the animation
	 *         frame will be rendered.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 * @param  {number} [frame]
	 *         Index of the frame to draw. Usually, the frame index is internally
	 *         calculated.
	 *
	 * @return {number} Drawn frame index.
	 */
	proto.draw = function(renderer, x, y, frame) {
		frame = gamalto.defined(frame, this.progress, 0) | 0;

		var offs = this.offs_[frame];
		var tran = this.offset_;
		var trns = this.transform;
		var dest = renderer.transform;

		x += tran.x + offs.x * (trns.flipX ? -1 : 1);
		y += tran.y + offs.y * (trns.flipY ? -1 : 1);

		dest.save();
		dest.copy(trns);
		this.draw_(renderer, x, y, frame);
		dest.restore();

		return frame;
	};

	/**
	 * Abstract method to draw an animation frame.
	 *
	 * @function
	 * @name Gamalto.BaseAnimation#draw_
	 *
	 * @protected
	 * @abstract
	 * @ignore
	 *
	 * @param  {Gamalto.BaseRenderer} renderer
	 *         Renderer of the {@linkcode Gamalto.surface} to which
	 *         the animation frame will be rendered.
	 * @param  {number} x
	 *         Horizontal drawing position.
	 * @param  {number} y
	 *         Vertical drawing position.
	 * @param  {number} [frame]
	 *         Index of the frame to draw. Usually, the frame index
	 *         is internally calculated.
	 */

	/**
	 * Creates a clone of the current object.
	 *
	 * @virtual
	 *
	 * @return {object} Copy of the object.
	 */
	proto.clone = function() {
		var clone = new this.constructor();
		clone.list_ = this.list_.slice();
		clone.offs_ = this.offs_.slice();
		clone.time_ = this.time_.slice();
		return clone;
	};

})();
