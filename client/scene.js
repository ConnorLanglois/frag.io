class Scene {
	constructor (scene) {
		this.init(scene);

		SOCKET.on('update', function (update) {
			this.init(update.scene);
		}.bind(this));
	}

	init(scene) {
		this._width = scene.width;
		this._height = scene.height;

		this._fraggers = [];
		this._foods = [];
		// this._frags = [];

		scene.fraggers.forEach(function (fragger) {
			this._fraggers.push(new FraggerMP(fragger));
		}.bind(this));

		scene.foods.forEach(function (food) {
			this._foods.push(new Food(food));
		}.bind(this));
	}

	onUpdate() {
		this._fraggers.forEach(function (fragger) {
			fragger.onUpdate();
		});

		this._foods.forEach(function (food) {
			food.onUpdate();
		});
	}

	onRender() {
		FRAGIO.ctx.save();
		
		FRAGIO.ctx.globalAlpha = 0.8;
		// FRAGIO.ctx.shadowColor = '#000000'; 
		FRAGIO.ctx.shadowBlur = 1000000; 
		FRAGIO.ctx.fillStyle = '#400000';

		FRAGIO.ctx.fillRect(-FRAGIO.fragger.x - width / 2, -FRAGIO.fragger.y - height / 2, this._width + width, this._height + height);
		FRAGIO.ctx.restore();

		FRAGIO.ctx.save();

		FRAGIO.ctx.globalAlpha = 0.6;
		FRAGIO.ctx.fillStyle = FRAGIO._pattern;
		FRAGIO.ctx.strokeStyle = '#FF0000';
		FRAGIO.ctx.lineWidth = 5;

		FRAGIO.ctx.scale(FRAGIO.fragger.scale, FRAGIO.fragger.scale);
		FRAGIO.ctx.translate(-FRAGIO.fragger.x, -FRAGIO.fragger.y);
		FRAGIO.ctx.beginPath();
		FRAGIO.ctx.rect(0, 0, this._width, this._height);
		FRAGIO.ctx.fill();
		FRAGIO.ctx.stroke();
		FRAGIO.ctx.closePath();
		FRAGIO.ctx.restore();

		this._foods.forEach(function (food) {
			if (this.isVisible(food)) {
				food.onRender();
			}
		}.bind(this));

		this._fraggers.forEach(function (fragger) {
			if (this.isVisible(fragger)) {
				fragger.onRender();
			}
		}.bind(this));
	}

	isVisible(obj) {
		return obj.x - FRAGIO.fragger.x + (width / 2 + obj.r) / (FRAGIO.fragger.scale / 2) > 0 &&
				obj.x - FRAGIO.fragger.x + (width / 2 - obj.r) / (FRAGIO.fragger.scale / 2) < width / (FRAGIO.fragger.scale / 2) &&
				obj.y - FRAGIO.fragger.y + (height / 2 + obj.r) / (FRAGIO.fragger.scale / 2) > 0 &&
				obj.y - FRAGIO.fragger.y + (height / 2 - obj.r) / (FRAGIO.fragger.scale / 2) < height / (FRAGIO.fragger.scale / 2)
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}
}
