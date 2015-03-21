(function() {


	var _Object = G.BaseSound = function(src) {
		this.src_ = src;

		this.playing_ = false;

		this.toPlay_ = 0;
	},

	proto = _Object.inherits(G.Object);

	proto.init = function() {};

	proto.load = function() {};

	proto.play = function(repeat) {
		this.stop();
		// Should be playing now
		this.playing_ = true;
		// Loop the sound
		this.toPlay_ = (+repeat | 0);
	};

	proto.stop = function() {
		this.toPlay_ = 0;
		this.playing_ = false;
	};

	proto.isPlaying = function() {
		return this.playing_;
	};

	proto.onEnded_ = function() {
		if (this.playing_ && this.toPlay_-- > 0) {
			this.play(this.toPlay_);
		} else {
			this.stop();
		}		
	};

})();
