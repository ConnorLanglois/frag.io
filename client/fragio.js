class Fragio {
	constructor (width, height) {
		this._canvas = createCanvas(width, height, true);

		this._ctx = this._canvas.getContext('2d');

		this._fragger = null;
		this._scene = null;

		this._ticks = 0;
		this._tticks = 0;
		this._tps = 0;
		this._lastTime = 0;

		this._background = new Image();
		this._background.src = '/client/background.png';
		this._background.onload = function () {
			this._pattern = FRAGIO.ctx.createPattern(this._background, 'repeat');
		}.bind(this);
	}

	run() {
		this._canvas.oncontextmenu = function (e) {
    		e.preventDefault();
		};

		this._lastTime = Date.now();

		SOCKET.on('init', function (init) {
			this._fragger = new FraggerSP(init.fragger);
			this._scene = new Scene(init.scene);

			this._id = window.setInterval(function () {
				this.onTick();
			}.bind(this), 1000 / 60);
		}.bind(this));

		SOCKET.on('disconnect', function () {
			window.clearInterval(this._id);
		}.bind(this));
	}

	onTick() {
		this.onUpdate();
		this.onRender();

		this._ticks++;
		this._tticks++;

		if (Date.now() - this._lastTime > 1000) {
			this._tps = this._tticks;
			this._tticks = 0;
			this._lastTime = Date.now();
		}
	}

	onUpdate() {
		width = this._canvas.width / pixelRatio;
		height = this._canvas.height / pixelRatio;
		
		this._scene.onUpdate();
		
		if (this._fragger.isAlive) {
			this._fragger.onUpdate();
		}
	}

	onRender() {
		var tps = 'TPS: ' + this._tps;

		this._ctx.save();
		this._ctx.translate(width / 2, height / 2);
		this._ctx.clearRect(-width / 2, -height / 2, width, height);

		this._scene.onRender();

		if (this._fragger.isAlive) {
			this._fragger.onRender();
		}

		this._ctx.save();

		this._ctx.fillStyle = '#00FF00';
		this._ctx.font = '20px fantasy';

		this._ctx.fillText('Mass: ' + Math.floor(this._fragger.mass), -width / 2 + 5, -height / 2 + 20);
		this._ctx.fillText(tps, width / 2 - 5 - this._ctx.measureText(tps).width, height / 2 - 5);
		this._ctx.restore();
		this._ctx.restore();
	}

	get fragger() {
		return this._fragger;
	}

	get scene() {
		return this._scene;
	}

	get ticks() {
		return this._ticks;
	}

	get ctx() {
		return this._ctx;
	}

	get canvas() {
		return this._canvas;
	}
}
