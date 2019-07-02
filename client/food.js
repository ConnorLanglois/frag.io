class Food {
	constructor (food) {
		this._x = food.x;
		this._y = food.y;
		this._r = food.r;
		this._mass = food.mass;
		this._skin = food.skin;

		this._glow = 1;
	}

	onUpdate() {
		var glow = randomInt(10, 80);

		this._glow = lerp(this._glow, glow, glow / 15);
	}

	onRender() {
		FRAGIO.ctx.save();

		// FRAGIO.ctx.shadowColor = this._skin; 
		FRAGIO.ctx.shadowBlur = this._glow;
		FRAGIO.ctx.fillStyle = this._skin;

		FRAGIO.ctx.scale(FRAGIO.fragger.scale, FRAGIO.fragger.scale);
		FRAGIO.ctx.beginPath();
		FRAGIO.ctx.arc(this._x - FRAGIO.fragger.x, this._y - FRAGIO.fragger.y, this._r, 0, 2 * Math.PI);
		FRAGIO.ctx.fill();
		FRAGIO.ctx.stroke();
		FRAGIO.ctx.closePath();
		FRAGIO.ctx.restore();
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	get r() {
		return this._r;
	}
}
