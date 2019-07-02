class Frag {
	constructor (x, y, dir, mass, skin) {
		this._x = x;
		this._y = y;
		this._dir = dir;
		this._mass = mass;
		this._skin = skin;

		this._r = this._mass / 2;

		this._vel = 5;

		this._tick = FRAGIO.ticks;
		this._count = 0;

		this._glow = 0;
	}

	explode() {
		this._isExploded = true;
	}

	onUpdate() {
		var velX = this._vel * Math.cos(this._dir);
		var velY = this._vel * Math.sin(this._dir);

		this._x += velX;
		this._y += velY;

		this._vel = Math.max(0, lerp(this._vel, this._vel - 1, 1 / 15));

		this._glow = lerp(this._glow, randomInt(10, 80), 1 / 15);

		if (FRAGIO.ticks === this._tick - 1) {
			this._count++;
		}

		if (this._count === 2) {
			this._r = lerp(this._r, this._mass, 1 / 15);
		} else if (this._count >= 3) {
			this.explode();
		}
	}

	onRender() {
		FRAGIO.ctx.save();

		FRAGIO.ctx.shadowColor = this._skin; 
		FRAGIO.ctx.shadowBlur = this._glow;

		FRAGIO.ctx.scale(FRAGIO.fragger.scale, FRAGIO.fragger.scale);
		FRAGIO.ctx.save();

		FRAGIO.ctx.fillStyle = this._skin;

		FRAGIO.ctx.beginPath();
		FRAGIO.ctx.arc(this._x - FRAGIO.fragger.x, this._y - FRAGIO.fragger.y, this._r, 0, 2 * Math.PI);
		FRAGIO.ctx.fill();
		FRAGIO.ctx.closePath();
		FRAGIO.ctx.restore();

		FRAGIO.ctx.save();

		FRAGIO.ctx.globalAlpha = FRAGIO.ticks % 2 === 0 ? 0.7 : 0;
		FRAGIO.ctx.fillStyle = '#FF0000';

		FRAGIO.ctx.arc(this._x - FRAGIO.fragger.x, this._y - FRAGIO.fragger.y, this._r, 0, 2 * Math.PI);
		FRAGIO.ctx.fill();
		FRAGIO.ctx.closePath();
		FRAGIO.ctx.restore();
		FRAGIO.ctx.restore();
	}

	isExploded() {
		return this._isExploded;
	}
}
