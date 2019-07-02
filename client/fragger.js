class Fragger {
	constructor (fragger) {
		this.init(fragger);

		this._glow = 1;
	}

	init(fragger) {
		this._ox = fragger.ox;
		this._oy = fragger.oy;
		this._x = fragger.x;
		this._y = fragger.y;
		this._r = fragger.r;
		this._mass = fragger.mass;
		this._skin = fragger.skin;
		this._name = fragger.name;
	}

	onUpdate() {
		this._glow = lerp(this._glow, randomInt(10, 80), 1 / 15);
	}

	onRender() {
		var borderColor;

		FRAGIO.ctx.save();

		FRAGIO.ctx.fillStyle = this._skin;
		// FRAGIO.ctx.shadowColor = this._skin; 
		FRAGIO.ctx.shadowBlur = this._glow;

		borderColor = function () {
			var hex = FRAGIO.ctx.fillStyle.substring(1);
			
			var or = hex.substring(0, 2);
			var og = hex.substring(2, 4);
			var ob = hex.substring(4, 6);

			var nr = Math.max(0, '0x' + or - 79);
			var ng = Math.max(0, '0x' + og - 79);
			var nb = Math.max(0, '0x' + ob - 79);

			return 'rgb(' + nr +', ' + ng + ',' + nb +')';
		}();

		FRAGIO.ctx.strokeStyle = borderColor;
		FRAGIO.ctx.lineWidth = 5;

		FRAGIO.ctx.scale(FRAGIO.fragger.scale, FRAGIO.fragger.scale);
		FRAGIO.ctx.beginPath();

		for (var i = 0; i < 2 * Math.PI; i += 0.1) {
			const max = 2 / FRAGIO.fragger.scale;
			var ox = this instanceof FraggerSP ? this._x : this._ox;
			var oy = this instanceof FraggerSP ? this._y : this._oy;

			var line = (i === 0 ? FRAGIO.ctx.moveTo : FRAGIO.ctx.lineTo).bind(FRAGIO.ctx);

			var x = Math.max(0, Math.min(ox + this._r * Math.cos(i), FRAGIO.scene.width));
			var y = Math.max(0, Math.min(oy + this._r * Math.sin(i), FRAGIO.scene.height));

			var randX = randomInt(-max, max);
			var randY = randomInt(-max, max);

			x += randX;
			y += randY;

			if (this instanceof FraggerSP) {
				line(x - ox, y - oy);
			} else {
				line(x - FRAGIO.fragger.x, y - FRAGIO.fragger.y);
			}
		}

		FRAGIO.ctx.fill();
		FRAGIO.ctx.closePath();
		FRAGIO.ctx.stroke();
		FRAGIO.ctx.restore();

		FRAGIO.ctx.save();

		FRAGIO.ctx.fillStyle = borderColor;

		FRAGIO.ctx.scale(FRAGIO.fragger.scale, FRAGIO.fragger.scale);

		FRAGIO.ctx.font = this._mass / 5 + 'px fantasy';

		if (this instanceof FraggerSP) {
			FRAGIO.ctx.fillText(this._name, -FRAGIO.ctx.measureText(this._name).width / 2, 0);
		} else {
			FRAGIO.ctx.fillText(this._name, this._ox - FRAGIO.fragger.x - FRAGIO.ctx.measureText(this._name).width / 2 , this._oy - FRAGIO.fragger.y);
		}

		FRAGIO.ctx.restore();

		/* if (this._isKabooming) {
			FRAGIO.ctx.save();

			FRAGIO.ctx.globalAlpha = FRAGIO.ticks % 2 === 0 ? 0.7 : 0;
			FRAGIO.ctx.fillStyle = '#FF0000';

			FRAGIO.ctx.arc(0, 0, this._r, 0, 2 * Math.PI);
			FRAGIO.ctx.fill();
			FRAGIO.ctx.closePath();
			FRAGIO.ctx.restore();
		} */
	}

	get mass() {
		return this._mass;
	}

	get scale() {
		return this._scale;
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
