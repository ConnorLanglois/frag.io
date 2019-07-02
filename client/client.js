'use strict';

var width = document.body.clientWidth;
var height = document.body.clientHeight; // Math.floor(width * (9 / 16));

const FRAGIO = new Fragio(width, height);
const EVENT_MANAGER = new EventManager(FRAGIO.canvas);
const SOCKET = io('/', {
	query: 'name=' + function () {
		do {
			var name = window.prompt('Fragger name: ', '');
		} while (name === null)

		return name;
	}()
});

FRAGIO.run();
