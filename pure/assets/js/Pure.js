class Game {
	constructor() {
	}

	#setDefaultStyle() {
		const html = document.documentElement;
		const body = document.body;

		html.style.margin = '0px';
		html.style.padding = '0px';
		html.style.height = '100%';
		html.style.overflow = 'hidden';

		body.style.cursor = 'crosshair';
		body.style.width = '100%';
		body.style.height = '100%';
		body.style.margin = '0px';
		body.style.padding = '0px';
		body.style.backgroundColor = 'black';
		body.style.color = 'white;';
		body.style.fontFamily = 'Segoe UI;sans-serif;';
		body.innerHTML = '';
	}

	#createCanvas() {
		const canvas = document.createElement('canvas');
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.margin = '0px';
		canvas.style.padding = '0px';
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
		document.body.appendChild(canvas);
	}

	async init() {
		console.log('Initializing...');
		this.#setDefaultStyle();
		this.#createCanvas();
		console.log('Initialized');
	}

	start() {
		console.log('Starting.,,');

		console.log('Started');
	}
}
