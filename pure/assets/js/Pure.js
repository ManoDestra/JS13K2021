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

	getLeft() {
		return this.getX();
	}

	getRight() {
		return this.getX() + this.getW();
	}

	getTop() {
		return this.getY();
	}

	getBottom() {
		return this.getY() + this.getH();
	}

	getArea() {
		return this.getW() * this.getH();
	}

	intersects(box) {
		const left = this.getLeft() >= box.getLeft() && this.getLeft() <= box.getRight();
		const right = this.getRight() >= box.getLeft() && this.getRight() <= box.getRight();
		const top = this.getTop() >= box.getTop() && this.getTop() <= box.getBottom();
		const bottom = this.getBottom() >= box.getTop() && this.getBottom() <= box.getBottom();
		return (left || right) && (top || bottom);
	}
}

class Component {
	#updateActive = true;

	constructor() {
	}

	isUpdateActive() {
		return this.#updateActive;
	}

	setUpdateActive(updateActive) {
		this.#updateActive = updateActive;
	}

	update(instant) {
	}

	debug(instant, ...params) {
		if (instant.frame % 60 == 0) {
			console.log(instant, ...params);
		}
	}
}

class RenderComponent extends Component {
	#renderActive = true;

	constructor() {
		super();
	}

	isRenderActive() {
		return this.#renderActive;
	}

	setRenderActive(renderActive) {
		this.#renderActive = renderActive;
	}

	render(instant) {
	}

	updateAndRender(instant) {
		this.update(instant);
		this.render(instant);
	}
}

class Layer extends RenderComponent {
	constructor() {
		super();
	}
}

class Game extends RenderComponent {
	#title;
	static #canvasId = 'cvsPure';
	static #canvasClass = 'canvas-pure';

	constructor(title) {
		super();
		this.#title = title ?? this.constructor.name;
	}

	getTitle() {
		return this.#title;
	}

	getCanvas() {
		return document.querySelector('#' + Game.#canvasId);
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
		canvas.id = Game.#canvasId;
		canvas.className = Game.#canvasClass;
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.margin = '0px';
		canvas.style.padding = '0px';
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		document.title = this.getTitle();
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
		Clock.start(instant => this.updateAndRender(instant));
		console.log('Started');
	}

	stop() {
		console.log('Stopping...');
		Clock.stop();
		console.log('Stopped');
	}
}
