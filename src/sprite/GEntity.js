/*
 * Gamalto.Entity
 * --------------
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

	gamalto.devel.require("Vector2");
	gamalto.devel.using("Movable");
	gamalto.devel.using("Transform");

	/**
	 * @constructor
	 */
	var _Object = G.Entity = function() {
		this.position_ = _Vector2.zero();
		this.active_ = null;

		this.state_ = {};
		this.animation_ = {};
		this.transform = new G.Transform();
	},
	_Vector2 = G.Vector2,

	proto = _Object.inherits(G.Object);
	
	// useful for ennemies duplication
	proto.clone = function() {
		var name, 
			clone = new _Object(),
			anim = this.animation_;
	
		for (name in anim) {
			clone.addAnimation(name, anim[name].clone());
		}

		clone.active_ = this.active_;
		clone.position_ = this.position_.clone();
	};
	
	proto.addAnimation = function(name, anim) {
		this.state_[name] = this.createState_(name);
		this.animation_[name] = anim;
	};

	proto.getActive = function() {
		return this.active_;
	};

	proto.setActive = function(name) {
		if (name != this.active_) {
			this.state_[name].reset();
			this.animation_[name].reset();
			this.active_ = name;
		}
	};

	proto.update = function(timer, dx, dy) {
		var active = this.active_;
		if (!active) { return _Vector2.zero(); }

		var disp = this.state_[active].update(timer, dx, dy);
		this.position_.add(disp);
		this.animation_[active].update(timer);

		return disp;
	};

	proto.getState = function(name) {
		return this.state_[name || this.getActive()];
	};

	proto.createState_ = function(name) {
		return new G.Movable();
	};

	// TODO: save current and previous BBox for collision tests
	proto.draw = function(renderer, x, y, i) {
		var active = this.active_;
		if (!active) { return false; }

		var pos, res,
			anim = this.animation_[this.active_],
			trns = anim.transform;

		if (!isNaN(x) || !isNaN(y)) {
			// In that case, reset the current position
			this.position = new _Vector2(x || 0, y || 0);
		}

		pos = this.position_;

		trns.save();
		trns.copy(this.transform);
		res = anim.draw(renderer, pos.x, pos.y, i);
		trns.restore();

		return res;
	};

	Object.defineProperties(proto, {
		"position": {
			get: function() { return this.position_; },
			set: function(value) {
				var active = this.active_;
				if (active) { this.state_[active].reset(); }
				this.position_ = value;
			}
		},
		"playing": {
			get: function() {
				var active = this.active_;
				return active ? this.animation_[active].playing : false;
			}
		}
	});

})();
