/*
 * Gamalto.Animation
 * -----------------
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
	gamalto.devel.require("BaseAnimation");
	gamalto.devel.using("SpriteSheet");

	/**
	 * Creates a new animation sequence from a sprites sheet.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.Animation
	 * @augments Gamalto.BaseAnimation
	 *
	 * @param  {Gamalto.SpriteSheet} sheet
	 *         Sprites sheet containing the sections for the animation.
	 *
	 * @example
	 * var anim = new Gamalto.Animation(sheet);
	 */
	var _Object = G.Animation = function(sheet) {
		/**
		 * Sprites sheet use by the animation.
		 *
		 * @type {Gamalto.SpriteSheet}
		 * @readonly
		 * @alias Gamalto.Animation#sheet
		 */
		this.sheet = sheet;

		Object.base(this);
	};

	/** @alias Gamalto.Animation.prototype */
	var proto = _Object.inherits(G.BaseAnimation);

	/**
	 * Sets a section indices range to be used for the animation.
	 *
	 * @param  {number} start
	 *         Start index is the sections list.
	 * @param  {number} length
	 *         Number of sections to be used.
	 */
	proto.useSectionRange = function(start, length) {
		this.length += length;
		while (length--) {
			this.offs_.push(new G.Vector2());
			this.list_.push(start++);
			this.time_.push(0);
		}
	};

	/**
	 * Gets the sprites sheet section for the given frame.
	 *
	 * @param  {number} frame
	 *         Frame index.
	 *
	 * @return {Gamalto.Rect} Rectangle defining the section.
	 */
	proto.getSection = function(frame) {
		gamalto.devel.assert(frame < this.list_.length);
		return this.sheet.getSection(this.list_[frame]);
	};

	/**
	 * @see {Gamalto.BaseAnimation#draw}
	 * @ignore
	 */
	proto.draw_ = function(renderer, x, y, frame) {
		this.sheet.draw(renderer, x, y, this.list_[frame]);
	};

	/**
	 * Creates a clone of the current object.
	 *
	 * @return {Gamalto.Animation} Copy of the object.
	 */
	proto.clone = function() {
		var clone = _Object.base.clone.call(this);
		clone.sheet = this.sheet;
		return clone;
	};

})();
