(function() {

	/**
	 * Dependencies
	 */
	gamalto.dev.require("BaseSound");
	gamalto.dev.using("Promise");
	gamalto.dev.using("AsyncFile");

	var _Object = G.WebAudioSound = function(src, context) {
		Object.base(this, src);
		this.init(context);
	},

	proto = _Object.inherits(G.BaseSound);

	proto.init = function(context) {
		this.ctx_ = context;
	};

	proto.load = function() {
		var that = this,
			promise = new G.Promise(),
			file = new G.AsyncFile(),
			context = this.ctx_;

		file.open(this.src_)
		.then(function() {
			if (file.error != 0) {
				promise.reject("Error " + file.error);
			} else {
				file.readAll();
				var buffer = file.buffer;
				file.close();

				if (context.decodeAudioData) {
					context.decodeAudioData(buffer, function(data) {
						that.buffer = data;
						promise.resolve();
					}, function() {
						promise.reject("Failed to decode audio data.");
					});
				} else {
					that.buffer = context.createBuffer(buffer, false/*keep channels*/);
					promise.resolve();
				}
			}

		}, function(reason) {
			promise.reject(reason);
		});

		return promise;
	};

	proto.play = function(repeat) {
		_Object.base.play.call(this, repeat);

		var context = this.ctx_,
			source = context.createBufferSource();
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
