/*
 * Gamalto.TextLibrary
 * 
 * This file is part of the Gamalto Project
 * http://www.gamalto.com/
 *
 */

(function() {

	/* Dependencies */
	gamalto.require_("XMLLibrary");

	/**
	 * Creates a text resource manager.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.TextLibrary
	 * @augments Gamalto.XMLLibrary
	 */
	var _Object = G.TextLibrary = function() {
		Object.base(this);
	},

	/** @alias Gamalto.TextLibrary.prototype */
	_proto = _Object.inherits(G.XMLLibrary);

	/**
	 * Transforms data before sorting the resource.
	 *
	 * @see {@link Gamalto.XMLLibrary}
	 * @ignore
	 */
	_proto._toData = function(o) {
		return o.responseText;
	};

})();
