/*
 *  Implementation: pseudo XMLHttpRequest CORS support extending XDomainRequest
 *
 *  This is a minimal extension to XDomainRequest to handle Gamalto needs only.
 * 
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
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
	var _proto = XDomainRequest.prototype,

	/* Events */
	_onprogress = function(e) {
		this.readyState = _proto.LOADING;
		this._handler.call(this, e);
	},

	_onload = function(e) {
		var that = this;
		/* Be sure to always have a LOADING state */
		if (!this.readyState) {
			_onprogress.call(this, e);
		}
		/* Defered for LOADING state if required */
		setTimeout(function() {
			that.readyState = _proto.DONE;
			that.status = 200;
			try {
				// Try to get XMLDocument from response
				that.responseXML = new DOMParser()
					.parseFromString(that.responseText, "text/xml");
			} finally {
				that._handler.call(that, e);
			}
		}, 0);
	},

	_onerror = function(e) {
		this.readyState = _proto.DONE;
		/* Dummy error code */
		this.status = 500;
		this._handler.call(this, e);
	};

	Object.defineProperty(_proto, "onreadystatechange", {
		set: function(value) {
			this._handler = value;
			this.onprogress = _onprogress;
			this.onerror = this.ontimeout = _onerror;
			this.onload =_onload;
		}
	});

	/* States used in Gamalto */
	_proto.LOADING	= 3;
	_proto.DONE		= 4;

	/* Prevent use of XDomainRequest if this file is not executed */
	global._XDomainRequest = XDomainRequest;

})(this);
