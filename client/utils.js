if (typeof module !== 'undefined') {
	module.exports = exports = {
		distance: distance,
		lerp: lerp,
		randomColor: randomColor,
		randomInt: randomInt
	};
} else {
	var pixelRatio = function () {
		const ctx = document.createElement('canvas').getContext('2d');

		const dpr = window.devicePixelRatio || 1;
		const bsr = ctx.webkitBackingStorePixelRatio ||
				  ctx.mozBackingStorePixelRatio ||
				  ctx.msBackingStorePixelRatio ||
				  ctx.oBackingStorePixelRatio ||
				  ctx.backingStorePixelRatio || 1;

		return dpr / bsr;
	}();
}

function createCanvas(width, height, doScale) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.id = 'canvas';
	canvas.tabIndex = 1;

	canvas.width = width * pixelRatio;
	canvas.height = height * pixelRatio;
	canvas.style.width = width;
	canvas.style.height = height;

	ctx.scale(pixelRatio, pixelRatio);

	if (doScale) {
		const widthScale = width / document.body.clientWidth;
		const heightScale = height / document.body.clientHeight;

		window.onresize = function () {
			const width = widthScale * document.body.clientWidth;
			const height = heightScale * document.body.clientHeight;

			canvas.width =  width * pixelRatio;
			canvas.height =  height * pixelRatio;
			canvas.style.width = width;
			canvas.style.height = height;

			ctx.scale(pixelRatio, pixelRatio);
		};
	}

	document.body.appendChild(canvas);

	return canvas;
}

function distance(x1, y1, x2, y2) {
	return x2 !== undefined ? Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) : Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
}

function lerp(a, b, t) {
	return a + t * (b - a);
}

function randomColor() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);

	return 'rgb(' + r +', ' + g + ', ' + b + ')';
}

function randomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}
