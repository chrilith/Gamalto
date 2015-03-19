/*********************************************************************************
 #################################################################################

 API CORS
 ________

 Implementation: pseudo XMLHttpRequest CORS support extending XDomainRequest.
 This is a minimal extension to XDomainRequest to handle Gamalto needs only.
 ________

 This file is part of the GAMALTO JavaScript Development Framework.
 http://www.gamalto.com/

 (c)2012-Now The GAMALTO Project, written by Chris Apers, all rights reserved.

 #################################################################################
 #################################################################################
  _________   _________   _________   _________   _        _________   _________
 |  _______| |_______  | |  _   _  | |_________| | |      |___   ___| |  _____  |
 | |  _____   _______| | | | | | | |  _________  | |          | |     | |     | |
 | | |____ | |  _____  | | | | | | | |_________| | |          | |     | |     | |
 | |_____| | | |_____| | | | | | | |  _________  | |_______   | |     | |_____| |
 |_________| |_________| |_| |_| |_| |_________| |_________|  |_|     |_________|

                       «< javascript development framework >»                    

 #################################################################################
 *********************************************************************************/

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
