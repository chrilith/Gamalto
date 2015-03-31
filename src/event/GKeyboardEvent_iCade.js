/*
 * Gamalto.KeyBoardEvent for iCade
 * -------------------------------
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
	/**
	 * Dependencies
	 */
	gamalto.devel.require("Event");

	/* Constants */
	var constant = G.Event;

	constant.K_ICADE_UP		= 0x1000;
	constant.K_ICADE_DOWN	= 0x1001;
	constant.K_ICADE_LEFT	= 0x1002;
	constant.K_ICADE_RIGHT	= 0x1003;

	constant.K_ICADE_FIRE1	= 0x1010;
	constant.K_ICADE_FIRE2	= 0x1011;
	constant.K_ICADE_FIRE3	= 0x1012;
	constant.K_ICADE_FIRE4	= 0x1013;
	constant.K_ICADE_FIRE5	= 0x1014;
	constant.K_ICADE_FIRE6	= 0x1015;

	constant.K_ICADE_FIREX1	= 0x1016;
	constant.K_ICADE_FIREX2	= 0x1017;

})();
