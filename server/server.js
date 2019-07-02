'use strict';

class Client {
	constructor (socket, name, fragger) {
		this._socket = socket;
		this._name = name;
		this._fragger = fragger;

		SCENE.addFragger(this._fragger);
	}

	get fragger() {
		return this._fragger;
	}

	get socket() {
		return this._socket;
	}
}

class Scene {
	constructor (width, height) {
		this._width = width;
		this._height = height;

		this._fraggers = [];

		this._foods = [];
		this._maxFoods = UTILS.randomInt((this._width + this._height) / 2 / 20, (this._width + this._height) / 2 / 10);

		this._frags = [];
	}

	addFragger(fragger) {
		this._fraggers.push(fragger);
	}

	removeFragger(fragger) {
		this._fraggers.splice(this._fraggers.indexOf(fragger), 1);
	}

	addFood() {
		var mass = UTILS.randomInt(1, 3);
		var r = 6 * mass;

		this._foods.push(new Food(UTILS.randomInt(r, this._width - r), UTILS.randomInt(r, this._height - r), mass));
	}

	removeFood(food) {
		this._foods.splice(this._foods.indexOf(food), 1);
	}

	addFoods() {
		if (this._foods.length < this._maxFoods) {
			var newFoods = UTILS.randomInt(1, this._maxFoods / 10);

			for (var i = 0; i < newFoods; i++) {
				this.addFood();
			}
		}
	}

	onUpdate() {
		this._fraggers.forEach(function (fragger) {
			this._fraggers.forEach(function (otherFragger) {
				if (otherFragger != fragger &&
					fragger.mass > 1.25 * otherFragger.mass &&
				 	fragger.distanceTo(otherFragger.x, otherFragger.y) < fragger.r - (1 / 3) * otherFragger.r) {

					fragger.eat(otherFragger);
					otherFragger.die();
				}
			});

			this._foods.forEach(function (food) {
				if (fragger.distanceTo(food.x, food.y) < fragger.r - (1 / 3) * food.r) {
					fragger.eat(food);
					this.removeFood(food);
				}
			}.bind(this));

			fragger.onUpdate();
		}.bind(this));

		this._foods.forEach(function (food) {
			food.onUpdate();
		});

		this.addFoods();
	}

	serialize() {
		return {
			width: this._width,
			height: this._height,
			fraggers: (function () {
				var fraggers = [];

				this._fraggers.forEach(function (fragger) {
					fraggers.push(fragger.serialize());
				});

				return fraggers;
			}.bind(this))(),
			foods: (function () {
				var foods = [];

				this._foods.forEach(function (food) {
					foods.push(food.serialize());
				});

				return foods;
			}.bind(this))(),
			frags: this._frags
		};
	}

	get fraggers() {
		return this._fraggers;
	}

	get foods() {
		return this._foods;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}
}

class Food {
	constructor (x, y, mass) {
		this._x = x;
		this._y = y;
		this._mass = mass;

		this._r = 0;

		this._skin = UTILS.randomColor();
	}

	onUpdate() {
		this._r = UTILS.lerp(this._r, 6 * this._mass, 1 / 15);
	}

	serialize() {
		return {
			x: this._x,
			y: this._y,
			r: this._r,
			mass: this._mass,
			skin: this._skin
		};
	}

	get mass() {
		return this._mass;
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

class Fragger {
	constructor (x, y, mass, skin, name, socket) {
		this._x = x;
		this._y = y;
		this._mass = mass;
		this._skin = skin;
		this._name = name;
		this._socket = socket;

		this._ox = this._x;
		this._oy = this._y;

		this._r = 0;
		this._dir = 0;

		this._maxForce = 3;
		this._maxForceDistance = 150;

		this._vel = 0;

		this._isAlive = true;

		this._socket.on('move', function (offsets) {
			this._offsetX = offsets.offsetX;
			this._offsetY = offsets.offsetY;

			this._dir = Math.atan2(this._offsetY, this._offsetX);
		}.bind(this));

		this._socket.on('frag', function () {

		});

		this._socket.on('kaboom', function () {

		});
	}

	addMass(mass) {
		this._mass += mass;
	}

	eat(obj) {
		this.addMass(obj.mass);
	}

	frag() {
		if (this._mass > 100) {
			this._frags.push(new Frag(this._x + this._r * Math.cos(this._dir), this._y + this._r * Math.sin(this._dir), this._dir, this._mass / 4, this._skin));
			this._mass /= 2;
		}
	}

	kaboom() {
		this._count = 0;
		this._isKabooming = false;
	}

	die() {
		console.log('starting death');
		this._socket.emit('die');
		SCENE.removeFragger(this);

		this._isAlive = false;
		console.log('ending death');
	}

	onUpdate() {
		var vel = this.isMoving() ? this._maxForce * Math.min(1, UTILS.distance(this._offsetX, this._offsetY) / this._maxForceDistance) / (this._mass / 100) : 0;
		var velX = this._vel * Math.cos(this._dir);
		var velY = this._vel * Math.sin(this._dir);

		/* this._frags.forEach(function (frag, index) {
			if (!frag.isExploded()) {
				frag.onUpdate();
			} else {
				this._frags.splice(index, 1);
			}
		}.bind(this));

		/* if (this._isKabooming && FRAGIO.ticks === this._tick - 1) {
			this._count++;

			if (this._count === 2) {
				this._mass *= 2;
			} else if (this._count >= 3) {
				this.kaboom();
			}
		} */

		this._x = Math.max(this._r / 2, Math.min(this._x + velX, SCENE.width - this._r / 2));
		this._y = Math.max(this._r / 2, Math.min(this._y + velY, SCENE.height - this._r / 2));

		this._r = UTILS.lerp(this._r, this._mass / 2, 1 / 15);

		this._vel = UTILS.lerp(this._vel, vel, 1 / 15);
	}

	distanceTo(x, y) {
		return UTILS.distance(x, y, this._x, this._y);
	}

	isMoving() {
		return Math.abs(this._offsetX) > 5 * this._maxForce + this._r / 8 || Math.abs(this._offsetY) > 5  * this._maxForce + this._r / 8;
	}

	serialize() {
		var ret = {
			ox: this._ox,
			oy: this._oy,
			x: this._x,
			y: this._y,
			r: this._r,
			mass: this._mass,
			skin: this._skin,
			name: this._name
		};

		this._ox = this._x;
		this._oy = this._y;

		return ret;
	}

	get mass() {
		return this._mass;
	}

	get isAlive() {
		return this._isAlive;
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

const PATH = require('path');
const FS = require('fs');
const EXPRESS = require('express');
const APP = EXPRESS();
const HTTP = require('http').Server(APP);
const IO = require('socket.io')(HTTP);

const UTILS = require('../client/utils.js');

const CLIENTS = [];

const SCENE = new Scene(1000, 1000);

const EMIT_INTERVAL = 1000 / 60;
const UPDATE_INTERVAL = 1000 / 60;

APP.get('/', function (req, res) {
	res.sendFile(PATH.join(__dirname, '../client/frag.io.html'));
});

APP.get('/favicon.ico', function (req, res) {
	res.sendFile(PATH.join(__dirname, '/favicon.ico'));
});

APP.get('*', function (req, res) {
	res.sendFile(PATH.join(__dirname, '..' + req.url));
});

IO.on('connection', function (socket) {
	const name = socket.handshake.query.name;
	const x = UTILS.randomInt(0, SCENE.width);
	const y = UTILS.randomInt(0, SCENE.height);
	const mass = UTILS.randomInt(50, 200);
	const color = UTILS.randomColor();
	
	const client = new Client(socket, name, new Fragger(x, y, mass, color, name, socket));

	socket.on('disconnect', function () {
		SCENE.removeFragger(client.fragger);

		delete CLIENTS[socket.id];

		console.log('SOCKET ' + socket.id + ': disconnected');
	});

	socket.emit('init', {
		scene: SCENE.serialize(),
		fragger: client.fragger.serialize()
	});

	CLIENTS[socket.id] = client;

	console.log('SOCKET ' + socket.id + ': connected');
});

setInterval(function onUpdate() {
	SCENE.onUpdate();
}, UPDATE_INTERVAL);

setInterval(function onEmit() {
	Object.values(CLIENTS).forEach(function (client) {
		if (client.fragger.isAlive) {
			SCENE.removeFragger(client.fragger);
		}

		client.socket.emit('update', {
			scene: SCENE.serialize(),
			fragger: client.fragger.serialize()
		});

		if (client.fragger.isAlive) {
			SCENE.addFragger(client.fragger);
		}
	});
}, EMIT_INTERVAL);

HTTP.listen(80);
