(function() {

	gamalto.dev.using("AudioChannel");

	var _Object = G.BaseAudioMixer = function() {
		this.duplicateSource_ = false;
	},

	proto = _Object.inherits(G.Object);
	
	proto.init = function(channels) {
		var all = this.channels_ = [];

		for (var i = 0; i < channels; i++) {
			all.push(new G.AudioChannel(this.duplicateSource_));
		}

		return channels;
	};

	proto.createChannel = function() { };

	proto.createSound = function(src) { };

	proto.findChannel_ = function(priority) {
		var i, all = this.channels_;

		// Find a non playing channel
		for (i = 0; i < all.length; i++) {
			if (!all[i].isPlaying()) {
				return all[i];
			}
		}
		// Then try to find a playing channel with same priority
		for (i = 0; i < all.length; i++) {
			if (all[i].getPriority() <= priority) {
				return all[i];
			}
		}
		return null;
	};

	proto.playSound = function(sound, repeat, priority) {
		var channel = this.findChannel_(priority);
		if (!channel) {
			gamalto.warn_("Unable to allocate channel to play sound.");
		} else {
			channel.play(sound, repeat, priority);
		}
	};

	proto.playMusic = function(sound) {
		this.playSound(sound, 0xffff, 0xffff);
	};

	proto.stopAll = function() {
		this.channels_.forEach(function(chan) {
			chan.stop();
		});
	};

})();
