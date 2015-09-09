/*
 * Gamalto.WebAudioSound
 * ---------------------
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
	gamalto.devel.require("BaseSound");
	gamalto.devel.using("AsyncFile");

	/**
	 * @memberof Gamalto
	 * @constructor Gamalto.WebAudioSound
	 * @augments Gamalto.BaseSound
	 */
	var _Object = G.WebAudioSound = function(src, context) {
		Object.base(this, src);
		this.init(context);
	};

	var proto = _Object.inherits(G.BaseSound);

	proto.init = function(context) {
		this.ctx_ = context;
	};

	proto.load = function() {
		var file = new G.AsyncFile();
		var context = this.ctx_;

		return new Promise(function(resolve, reject) {

			file.open(this.src_)
			.then(function() {

				if (file.error !== 0) {
					reject("Error " + file.error);

				} else {
					file.readAll();
					var buffer = file.buffer;
					file.close();

					if (context.decodeAudioData) {
						context.decodeAudioData(buffer, function(data) {
							this.buffer = data;
							resolve();
						}.bind(this), reject);
					} else {
						this.buffer = context.createBuffer(buffer, false /* Keep channels */);
						resolve();
					}
				}

			}.bind(this), reject);

		}.bind(this));
	};

	proto.play = function(repeat) {
		_Object.base.play.call(this, repeat);

		var context = this.ctx_;
		var source = context.createBufferSource();

		source.connect(context.destination);
		source.onended = this.onEnded_.bind(this);

		this.source_ = source;
		source.buffer = this.buffer;

		source.start(0);
	};

	proto.stop = function() {
		if (this.playing_) {
			this.source_.onended = null;
			this.source_.stop(0);
		}
		_Object.base.stop.call(this);
	};

})();
