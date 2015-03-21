(function(global) {

	/* Enable standard version of the method */
	Object.defineMethod(global, "AudioContext");

	/**
	 * Dependencies
	 */
	gamalto.dev.require("AudioMixer");
	gamalto.dev.using("WebAudioSound");

	var _Base = G.AudioMixer,

		_Object = function() {
			Object.base(this);
		},

		proto = _Object.inherits(G.BaseAudioMixer);

	_Object.canUse = function() {
		return !!global.AudioContext && !global.ontouchstart;
	};

	_Base.addMixer_("BIT_WEBAUDIO", _Object);
	
	proto.init = function(channels) {
		this.ctx_ = new AudioContext();
		return _Object.base.init.call(this, channels);
	};

	proto.createSound = function(src) {
		return new G.WebAudioSound(src, this.ctx_);
	};

})(this);
