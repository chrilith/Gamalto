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
	proto = _Object.inherits(G.XMLLibrary);

	/**
	 * Transforms data before sorting the resource.
	 *
	 * @see {@link Gamalto.XMLLibrary}
	 * @ignore
	 */
	proto.toData_ = function(o) {
		return o.responseText;
	};

})();
