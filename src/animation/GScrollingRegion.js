/*
 * Gamalto.ScrollingRegion
 * -----------------------
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
	gamalto.devel.require("Movable");
	gamalto.devel.using("Canvas2D");
	gamalto.devel.using("Vector2");

	/**
	 * Creates an object defining the movable region of a [scroller]{@link Gamalto.Scroller}.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.ScrollingRegion
	 * @augments Gamalto.Movable
	 *
	 * @param {Gamalto.IBox} box
	 *        Bounds of the region to be scrolled.
	 * @param {boolean} [loop]
	 *        Whether to loop the scrolling area.
	 */
	var _Object = G.ScrollingRegion = function(box, loop) {
		Object.base(this);
		/**
		 * Bounds of the region to be scrolled.
		 *
		 * @internal
		 * @ignore
		 * 
		 * @member {Gamalto.IBox}
		 */
		this.bounds_ = box;
		/**
		 * Gets or sets the loop state of the scrolling.
		 * 
		 * @member {boolean}
		 * @alias Gamalto.ScrollingRegion#loop
		 */
		this.loop = !!loop;
	},

	/** @alias Gamalto.ScrollingRegion.prototype */
	proto = _Object.inherits(G.Movable);

})();
