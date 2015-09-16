/*
 * Gamalto.AudioState
 * ------------------
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
	 * Creates a sound playing context.
	 *
	 * @memberof Gamalto
	 * @constructor Gamalto.AudioState
	 * @augments Gamalto.Object
	 *
	 * @param {Gamalto.BaseSound} sound
	 *        Sound to play.
	 * @param {number} [duplicateSource=true]
	 *        Priority of the sound.
	 */
	var _Object = G.AudioState = function(sound, duplicateSource) {
		/**
		 * Sound to play.
		 *
		 * @readonly
		 *
		 * @member {Gamalto.baseSound}
		 * @alias Gamalto.AudioState#sound
		 */
		this.sound = sound;

		/**
		 * Gets or sets the priority of the sound.
		 * It is used by the mixer channels to override a playing sound
		 * if no channel is available.
		 *
		 * @member {number}
		 * @alias Gamalto.AudioState#priority
		 */
		this.priority = 0;

		/**
		 * Gets or sets the number of times a sound may be played.
		 *
		 * @member {mumber}
		 * @alias Gamalto.AudioState#repeat
		 */
		this.repeat = 0;

		/**
		 * Whether to duplicate the source in order to play multiple
		 * instances of the same sound.
		 *
		 * @readonly
		 *
		 * @member {boolean}
		 * @alias Gamalto.AudioState#duplicateSource
		 */
		this.duplicateSource = gamalto.defined(duplicateSource, true);
	};

	/** @alias Gamalto.AudioState.prototype */
	var proto = _Object.inherits(G.Object);

	/**
	 * Frees the resources associated with this context.
	 */
	proto.dispose = function() {
		if (this.duplicateSource) {
			this.sound.dispose();
		}
	};

})();
