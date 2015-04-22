/*
 * Gamalto.SectionList
 * -------------------
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
	gamalto.devel.using("Rect");
	
	/**
	 * Abstract object to create a list a sections. It is not meant to be used directly.
	 *
	 * @abstract
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.SectionList
	 * @augments Gamalto.Object
	 */
	var _Object = G.SectionList = function() {
		/**
		 * Number of items in the list.
		 *
		 * @readonly
		 * 
		 * @member {number}
		 * @alias Gamalto.SectionList#length
		 */
		this.length = 0;
		this.list_ = [];
		this.setMargin();
		this.setSpacing();
	},
	_Vector2 = G.Vector2,
	
	/** @alias Gamalto.SectionList.prototype */
	proto = _Object.inherits(G.Object);
	
	/**
	 * Sets the global margin around the sections in the container.
	 * 
	 * @param {number} x
	 *        Horizontal margin.
	 * @param {number} y
	 *        Vertical margin.
	 */
	proto.setMargin = function(x, y) {
		this.margin_ = new _Vector2(x | 0, y | 0);
	};

	/**
	 * Sets the spacing around a section in the container.
	 * 
	 * @param {number} x
	 *        Horizontal spacing between sections.
	 * @param {number} y
	 *        Vertical spacing between sections.
	 */
	proto.setSpacing = function(x, y) {
		this.spacing_ = new _Vector2(x | 0, y | 0);
	};

	/**
	 * Adds a new set of sections to the list using the specified parameters.
	 *
	 * @virtual
	 * 
	 * @param {Gamalto.Size} size
	 *        Size of a section.
	 * @param {number} count
	 *        Number of sections to compute.
	 * @param {Gamalto.IBox} r
	 *        Rectangle defining the bounds of the container.
	 *
	 * @return {Gamalto.SectionList} Current object for method chaining.
	 */
	proto.addSections = function(size, count, r) {
		var tw = size.width,
			th = size.height,
			// Format
			mg = this.margin_,
			sp = this.spacing_,
			// Rectangle
			tL = r.origin,
			bR = _Vector2.add(tL, r.extent).substractFloat(1);

		this.length += count;

		for (var y = tL.y + mg.y; y < bR.y - mg.y; y += th + sp.y) {
			for (var x = tL.x - mg.x; x < bR.x - mg.x; x += tw + sp.x) {
				this.list_.push(this.createSection_(x, y, tw, th));
				if (!--count) {
					return this;
				}
			}
		}
		return this;
	};

	/**
	 * Inserts an existing section into the list.
	 * 
	 * @param  {number} at
	 *         Zero-based index where the section must be inserted.
	 * @param  {object} section
	 *         Section to be added. The type depends on the implementation.
	 */
	proto.insertSection = function(at, section) {
		gamalto.devel.assert(at <= this.length);
		this.list_.splice(at, 0, section);
		this.length++;
	};

	/**
	 * Instanciates a new section.
	 *
	 * @protected
	 * @virtual
	 * @ignore
	 * 
	 * @param  {number} x
	 *         Horizontal position of the section.
	 * @param  {number} y
	 *         Vertical position of the section.
	 * @param  {number} w
	 *         Width of the section.
	 * @param  {number} h
	 *         Height of the section.
	 * 
	 * @return {object} The type depends on the implementation.
	 */
	proto.createSection_ = function(x, y, w, h) {
		return new G.Rect(x, y, w, h);
	};
	
	/**
	 * Gets the section at the specified index.
	 * 
	 * @param  {number} index
	 *         Zero-based index of the section.
	 * 
	 * @return {object} Requested section. The type depends on the implementation.
	 */
	proto.getSection = function(index) {
		return this.list_[index | 0];
	};

})();
