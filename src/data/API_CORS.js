/*
 * API CORS
 * --------
 * Implementation: pseudo XMLHttpRequest CORS support extending XDomainRequest.
 * This is a minimal extension to XDomainRequest to handle Gamalto needs only.
 * --------
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

(function(global) {

	/* Implements for IE9 only */
	if (+(/MSIE (\d)/.exec(navigator.userAgent) || "")[1] !== 9) {
		return;
	}

	/* We are going to simulate XMLHttpRequest with XDomainRequest so that the original
	   code using classic XMLHttpRequest doesn't need to be changed a lot.
	   This code is made mostly for G.XMLLibrary use, but could be used directly in other code.
	*/
	var proto = XDomainRequest.prototype,

	/* Events */
	onprogress = function(e) {
		this.readyState = proto.LOADING;
		this.handler_.call(this, e);
	},

	onload = function(e) {
		var that = this;
		/* Be sure to always have a LOADING state */
		if (!this.readyState) {
			onprogress.call(this, e);
		}
		/* Defered for LOADING state if required */
		setTimeout(function() {
			that.readyState = proto.DONE;
			that.status = 200;
			try {
				// Try to get XMLDocument from response
				that.responseXML = new DOMParser()
					.parseFromString(that.responseText, "text/xml");
			} finally {
				that.handler_.call(that, e);
			}
		}, 0);
	},

	onerror = function(e) {
		this.readyState = proto.DONE;
		/* Dummy error code */
		this.status = 500;
		this.handler_.call(this, e);
	};

	Object.defineProperty(proto, "onreadystatechange", {
		set: function(value) {
			this.handler_ = value;
			this.onprogress = onprogress;
			this.onerror = this.ontimeout = onerror;
			this.onload = onload;
		}
	});

	/* States used in Gamalto */
	proto.LOADING	= 3;
	proto.DONE		= 4;

	/* Prevent use of XDomainRequest if this file is not executed */
	global._XDomainRequest = XDomainRequest;

})(this);
