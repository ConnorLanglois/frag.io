class FraggerSP extends Fragger {
	constructor (fragger) {
		super(fragger);

		this._maxForce = 3;
		this._maxForceDistance = 150;

		this._vel = 0;

		this._offsetX = 0;
		this._offsetY = 0;
		this._dir = 0;

		this._scale = 1;

		this._isAlive = true;

		EVENT_MANAGER.add(this, EVENT.MOUSEDOWN);
		EVENT_MANAGER.add(this, EVENT.MOUSEMOVE);

		SOCKET.on('update', function (update) {
			this.init(update.fragger);
		}.bind(this));

		SOCKET.on('die', function () {
			this.die();
		}.bind(this));
	}

	frag() {
		SOCKET.emit('frag');
	}

	kaboom() {
		SOCKET.emit('kaboom');
	}

	die() {
		console.log('starting death');
		EVENT_MANAGER.remove(this, EVENT.MOUSEDOWN);
		EVENT_MANAGER.remove(this, EVENT.MOUSEMOVE);

		this._isAlive = false;
		console.log('ending death');
	}

	onUpdate() {
		super.onUpdate();

		var vel = this.isMoving() ? this._maxForce * Math.min(1, distance(this._offsetX, this._offsetY) / this._maxForceDistance) / (this._mass / 100) : 0;
		var velX = this._vel * Math.cos(this._dir);
		var velY = this._vel * Math.sin(this._dir);

		this._x = Math.max(this._r / 2, Math.min(this._x + velX, FRAGIO.scene.width - this._r / 2));
		this._y = Math.max(this._r / 2, Math.min(this._y + velY, FRAGIO.scene.height - this._r / 2));

		this._vel = lerp(this._vel, vel, 1 / 15);

		this._scale = lerp(this._scale, 200 / this._mass, 1 / 15)
	}

	onRender() {
		super.onRender();

		var gradient = FRAGIO.ctx.createRadialGradient(0, 0, height / 2, 0, 0, 0);
		
		FRAGIO.ctx.save();

		FRAGIO.ctx.globalAlpha = 0.1;
		FRAGIO.ctx.fillStyle = gradient;

		gradient.addColorStop(0, 'black');
		gradient.addColorStop(1, 'white');

		FRAGIO.ctx.fillRect(-width / 2, -height / 2, width, height);
		FRAGIO.ctx.restore();
	}

	onMousedown(e) {
		this.onMousemove(e);

		switch (e.button) {
			case 0:
				this.frag();

				break;

			case 2:
				this.kaboom();

				break;
		}
	}

	onMousemove(e) {
		this._offsetX = e.offsetX - width / 2;
		this._offsetY = e.offsetY - height / 2;

		SOCKET.emit('move', {
			offsetX: this._offsetX,
			offsetY: this._offsetY
		});

		this._dir = Math.atan2(this._offsetY, this._offsetX);
	}

	isMoving() {
		return Math.abs(this._offsetX) > 5 * this._maxForce + this._r / 8 || Math.abs(this._offsetY) > 5  * this._maxForce + this._r / 8;
	}

	get isAlive() {
		return this._isAlive;
	}
}
