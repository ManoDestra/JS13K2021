class Clock {
	static #hook = null;
	static #instant = {
		frame: 0,
		tick: 0,
		lastTick: 0,
		elapsed() {
			return this.tick - this.lastTick;
		},
		fps() {
			const e = this.elapsed();
			return e > 0 ? (1000 / e) : 60;
		}
	};

	static start(callback) {
		if (Clock.#hook) {
			throw new Error('Clock Already Started');
		}

		Clock.#hook = callback;
		Clock.#instant.lastTick = Clock.#instant.tick;
		Clock.#instant.frame = window.requestAnimationFrame(Clock.#loop);
		console.log('Clock Started');
	}

	static stop() {
		if (!Clock.#hook) {
			throw new Error('Clock Already Stopped');
		}

		Clock.#hook = null;
		console.log('Clock Stopped');
	}

	static #loop(tick) {
		if (Clock.#hook) {
			Clock.#instant.lastTick = Clock.#instant.tick;
			Clock.#instant.tick = tick;
			Clock.#instant.frame = window.requestAnimationFrame(Clock.#loop);
			if (Clock.#hook) {
				Clock.#hook(Clock.#instant);
			}
		}
	}
}

class Point2D {
	#x = 0;
	#y = 0;

	constructor(x = 0, y = 0) {
		this.#x = x;
		this.#y = y;
	}

	getX() {
		return this.#x;
	}

	getY() {
		return this.#y;
	}
}

class Box extends Point2D {
	#w = 0;
	#h = 0;

	constructor(x = 0, y = 0, w = 0, h = 0) {
		super(x, y);
		this.#w = w;
		this.#h = h;
	}

	getW() {
		return this.#w;
	}

	getH() {
		return this.#h;
	}
}

class Component {
	constructor() {
	}

	update() {
	}
}

class Game {
	constructor() {
	}

	#setStyle() {
		const html = document.documentElement;
		html.style.margin = '0px';
		html.style.padding = '0px';
		html.style.height = '100%';
		html.style.overflow = 'hidden';

		const body = document.body;
		body.style.cursor = 'crosshair';
		body.style.width = '100%';
		body.style.height = '100%';
		body.style.margin = '0px';
		body.style.padding = '0px';
		body.style.backgroundColor = 'black';
		body.style.color = 'white;';
		body.style.fontFamily = 'Segoe UI;sans-serif;';
	}

	#createCanvas() {
		const canvas = document.createElement('canvas');
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.margin = '0px';
		canvas.style.padding = '0px';
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
		document.body.innerHTML = '';
		document.body.appendChild(canvas);
	}

	async init() {
		console.log('Initializing...');
		this.#setStyle();
		this.#createCanvas();

		// TODO: preload assets here

		console.log('Initialized');
	}

	start() {
		console.log('Starting.,,');
		Clock.start(instant => {
			// TODO: call main loop here
		});
		console.log('Started');
	}
}
