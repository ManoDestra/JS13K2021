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

class Box extends DOMRect {
	intersects(box) {
		const left = this.left >= box.left && this.left <= box.right;
		const right = this.right >= box.left && this.right <= box.right;
		const top = this.top >= box.top && this.top <= box.bottom;
		const bottom = this.bottom >= box.top && this.bottom <= box.bottom;
		return (left || right) && (top || bottom);
	}

	get area() {
		return this.width * this.height;
	}

	get boundary() {
		return (this.width + this.height) * 2;
	}
}

class Component {
	#updateActive = true;

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
	#renderTarget = null;

	constructor() {
		super();
		this.#renderTarget = document.createElement('canvas');

		// TODO: set width/height dynamically
		this.#renderTarget.width = 300;
		this.#renderTarget.height = 300;
	}
}

class Game extends RenderComponent {
	static #canvasId = 'cvsPure';
	static #canvasClass = 'canvas-pure';
	#title;
	#context = null;

	constructor(title) {
		super();
		this.#title = title ?? this.constructor.name;
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

		document.title = this.getTitle();
		document.body.innerHTML = '';
		document.body.appendChild(canvas);
		this.#onResize();
		this.#context = canvas.getContext('2d');
	}

	#onResize() {
		const canvas = this.getCanvas();
		if (canvas) {
			canvas.width = document.body.clientWidth;
			canvas.height = document.body.clientHeight;
		} else {
			console.warn('No Canvas Found');
		}
	}

	getTitle() {
		return this.#title;
	}

	getCanvas() {
		return document.querySelector('#' + Game.#canvasId);
	}

	getContext() {
		return this.#context;
	}

	clearCanvas(canvas = this.getCanvas(), ctx = this.getContext()) {
		const { width, height } = canvas;
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, width, height);
		ctx.restore();
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
		window.addEventListener('resize', () => this.#onResize());
		Clock.start(instant => this.updateAndRender(instant));
		console.log('Started');
	}

	stop() {
		console.log('Stopping...');
		Clock.stop();
		console.log('Stopped');
	}
}
