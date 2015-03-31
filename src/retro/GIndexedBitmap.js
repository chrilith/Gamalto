/*
 * Gamalto.IndexedBitmap
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
	gamalto.devel.require("Bitmap");
	gamalto.devel.using("IndexedImage");

	
	G.IndexedBitmap = function(source) {
		Object.base(this, source);
		this._updated = true;	// To force initial image rendering
	};

	/* Inheritance */
	var proto = G.IndexedBitmap.inherits(G.Bitmap);
	
	/* Instance methods */
	proto.animate = function(timer) {
		return (this._updated = this._source._palette.update(timer));
	};
	
	proto.setTransparency = function(index) {
		this._updated = true;
		this._source._palette.setTransparency(index);
	};

	proto.setColor = function(index, color) {
		this._updated = true;
		this._source._palette.setColor(index, color);
	};

	proto._getCanvas = function() {
		var refresh = this._updated;
		this._updated = false;
		return this._source._getCanvas(refresh);	
	};

	proto._getSourceType = function() {
		return G.IndexedImage;
	};

})();
