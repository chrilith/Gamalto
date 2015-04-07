/*
 * Gamalto.Version
 * ---------------
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
	 * Represents a version number.
	 * 
	 * @memberof Gamalto
	 * @constructor Gamalto.Version
	 * @augments Gamalto.Object
	 * 
	 * @param {number} major
	 *        Major component of the version number.
	 * @param {number} minor
	 *        Minor component of the version number.
	 * @param {number} build
	 *        Build component of the version number.
	 * @param {number} revision
	 *        Revision component of the version number.
	 * @param {number|string} [stage]
	 *        Stage component of the version number.
	 */
	var _Object = G.Version = function(major, minor, build, revision, stage) {
		/**
		 * Gets or sets the major component of the version number.
		 * 
		 * @member {number}
		 * @alias Gamalto.Version#major
		 */
		this.major = major;
		/**
		 * Gets or sets the minor component of the version number.
		 * 
		 * @member {number}
		 * @alias Gamalto.Version#minor
		 */
		this.minor = minor;
		/**
		 * Gets or sets the build component of the version number.
		 * 
		 * @member {number}
		 * @alias Gamalto.Version#build
		 */
		this.build = build;
		/**
		 * Gets or sets the stage component of the version number.
		 * 
		 * @member {object}
		 * @alias Gamalto.Version#stage
		 */
		this.stage = stage;
		/**
		 * Gets or sets the revision component of the version number.
		 * 
		 * @member {number}
		 * @alias Gamalto.Version#revision
		 */
		this.revision = revision;

		this.format_();
	},

	/** @alias Gamalto.Version.prototype */
	proto = _Object.inherits(G.Object);

	/**
	 * Adjusts the version components for proper conversion.
	 *
	 * @private
	 * @ignore
	 */
	proto.format_ = function() {
		this.major = Math.fmax(0, Number(this.major) | 0);
		this.minor = Math.fmax(0, Number(this.minor) | 0);
		this.build = Math.fmax(0, Number(this.build) | 0);

		var undef,
			stg = Number(this.stage),
			rev = Number(this.revision);

		// Should be alpha, beta, rc... also, 0 has a different meaning than undefined
		// so be sure to have the proper value here. 
		stg = isNaN(stg) ? ((this.stage || "").toLowerCase() || undef) : Math.fmax(0, stg | 0);

		// Try to get le revision from the stage string if any
		if (!rev && isNaN(stg)) {
			rev = Number(String(stg || "").replace(/[^0-9]+/, ""));
			stg = !stg ? stg : stg.replace(/[0-9]+/, "");
		}

		this.stage = stg;
		this.revision = Math.fmax(0, rev | 0);
	};

	/**
	 * Determines whether teh current object is equal to the passed parameter.
	 * 
	 * @param  {Gamalto.Version} version
	 *         Version object to test.
	 * 
	 * @return {boolean} True if the two objects are equal.
	 */
	proto.equals = function(version) {
		return String(this) == String(version);
	};

	/**
	 * Converts of value of the object to a testable string representation.
	 *
	 * @ignore
	 * 
	 * @return {string} Version number as a testable string.
	 */
	proto.valueOf = function() {
		this.format_();

		// Make released version over all others
		var undef, stg = this.stage;
		stg = (stg === undef ? "" : stg) + "zz";

		// Transform into testable string
		return	pad(this.major, 4) +
				pad(this.minor, 4) +
				pad(this.build, 4) + 
				pad(stg.charCodeAt(0), 3)  +
				pad(stg.charCodeAt(1), 3)  +
				pad(this.revision, 4);
	};

	/**
	 * Converts the value of the object to its equivalent printable string representation.
	 * 
	 * @return {string} Version number as a printable string.
	 */
	proto.toString = function() {
		this.format_();

		var undef,
			bld = this.build,
			stg = this.stage,
			rev = this.revision,
			str = this.major + "." + this.minor;

		// Do we have a numerical build or stage?
		if (bld > 0 || stg > 0 || (stg === 0 && rev > 0)) { str += "." + bld; }
		// Do we have a defined stage part...
		if (stg != undef && (stg !== 0 || rev > 0)) {
			str += (isNaN(stg) ?"-" : ".") + stg;
		// ...or a coming revision?
		} else if (rev > 0) {
			str += "-r";
		}
		if (rev > 0) {
			str += "." + rev;
		}
		// Remove extra period between stage and revision.
		return str.replace(/([a-z])\.(\d)/, "$1$2");
	};

	/**
	 * Converts a string to a [Version]{@link Gamalto.Version} object.
	 *
	 * @function parse
	 * @memberof Gamalto.Version
	 * @static
 	 * 
	 * @param  {string} str
	 *         String to be converted.
	 * 
	 * @return {Gamalto.Version} New instance representing the converted string.
	 */
	_Object.parse = function(str) {
		// Cleanup string
		str = str.replace(/[^0-9a-z\.,\-\+\s]/gi, "");
		// Try to split version and stage/revision part
		var rev = str.split(/[-\s]/),
			ver = rev[0].split(/[\.,\+]/);
		rev = (rev[1] || "").split(/[\.,\+]/);

		return new _Object(ver[0], ver[1], ver[2], ver[4] || rev[1], ver[3] || rev[0]);
	};

	function pad(val, len) {
		return (Array(len+1).join("0") + val).substr(-len);
	}

})();
