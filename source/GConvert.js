/*
 * Gamalto.Convert
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

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

	var stat = (G.Convert = {});
	
	stat.toUInt8 = function(value) {
		return value & 0xff;
	}

	stat.toSInt8 = function(value) {
		return toSigned(value, 0x7f, 0xff);
	}

	stat.toUInt16 = function(value) {
		return value & 0xffff;
	}

	stat.toSInt16 = function(value) {
		return toSigned(value, 0x7fff, 0xffff);
	}

	stat.toUInt32 = function(value) {
		return value & 0xffffffff;
	}

	stat.toSInt32 = function(value) {
		return toSigned(value, 0x7fffffff, 0xffffffff);
	}

	function toSigned(value, SM, UM) {
		var lower = - (SM + 1);

		if (value <= lower) {
			value = value & UM;
		}

		if (value > SM) {
			var s = value & SM,
				u = value & UM;
			value = (s < u ? s + lower : u);
		}

		return value;
	}
	
})();
