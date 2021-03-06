/*
 * Gamalto.SoundPool
 * -----------------
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
	gamalto.devel.require("BaseLibrary");

	/**
	 * Creates a new sound library.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.SoundPool
	 * @augments Gamalto.BaseLibrary
	 *
	 * @param {Gamalto.AudioMixer} mixer
	 *        Parent mixer of the library.
	 */
	var _Object = G.SoundPool = function(mixer) {
		Object.base(this);
		/**
		 * Parent mixer of the library.
		 * The mixer is use to instanciate related sound objects.
		 *
		 * @readonly
		 *
		 * @member {Gamalto.AudioMixer}
		 * @alias Gamalto.SoundPool#mixer
		 */
		this.mixer = mixer;
	};

	/** @alias Gamalto.SoundPool.prototype */
	var proto = _Object.inherits(G.BaseLibrary);

	/**
	 * Tries to load a new resource in the library.
	 *
	 * @param  {string} name
	 *         Name of the resource.
	 * @param  {string} src
	 *         Location of the item to load.
	 *
	 * @return {Promise} A promise to handle loading states.
	 */
	proto.loadItem = function(name, src) {
		var sound = this.mixer.createSound(src);

		gamalto.devel.assert(sound,
			"Failed to initialize sound object " + name + ".");

		return new Promise(function(resolve, reject) {

			return sound.load()
			.then(
				function() {
					this.add_(name, sound);
					resolve({
						source: this,
						item: name
					});
				}.bind(this),

				function(reason) {
					reject(this.failed_(name, src, reason));
				}.bind(this)
			);

		}.bind(this));
	};

})();
