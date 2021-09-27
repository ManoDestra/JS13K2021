const LayerState = {
	INACTIVE: 0,
	INITIALIZING: 1,
	ACTIVE: 2,
	TERMINATING: 3
};
Object.freeze(LayerState);

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
	}

	static stop() {
		if (!Clock.#hook) {
			throw new Error('Clock Already Stopped');
		}

		Clock.#hook = null;
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

class UniqueIdentifier {
	static * get() {
		let i = 0;
		while (true) {
			i++;
			yield i;
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
	static #idProvider = UniqueIdentifier.get();
	#id = 0;
	#updateActive = true;

	constructor() {
		this.#id = Component.#idProvider.next().value;
	}

	get id() {
		return this.#id;
	}

	isUpdateActive() {
		return this.#updateActive;
	}

	setUpdateActive(updateActive) {
		this.#updateActive = updateActive;
	}

	update(instant) {
	}

	onResize(dimensions) {
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
	#resizeOptions = null;
	#renderTarget = null;
	#renderContext = null;
	#left = 0;
	#top = 0;
	#ratio = 0;
	static #defaultResizeOptions = { x: 0, y: 0, w: 1, h: 1 };
	#state = LayerState.INACTIVE;
	#previousState = LayerState.INACTIVE;

	constructor(dimensions, resizeOptions = Layer.#defaultResizeOptions) {
		super();
		this.#resizeOptions = resizeOptions;
		this.#renderTarget = document.createElement('canvas');
		this.#renderContext = this.#renderTarget.getContext('2d');
		this.onResize(dimensions);
	}

	get state() {
		return this.#state;
	}

	// TODO: do we need this?
	set state(s) {
		this.#state = s;
	}

	advanceState() {
		this.#state = (this.#state + 1) % 4;
	}

	init() {
	}

	term() {
	}

	onResize(dimensions) {
		const { width, height } = dimensions;
		const { x, y, w, h } = this.#resizeOptions;
		this.#left = width * x;
		this.#top = height * y;
		this.#renderTarget.width = width * w;
		this.#renderTarget.height = height * h;
	}

	get renderTarget() {
		return this.#renderTarget;
	}

	get renderContext() {
		return this.#renderContext;
	}

	get dimensions() {
		return {
			x: this.#left,
			y: this.#top,
			w: this.#renderTarget.width,
			h: this.#renderTarget.height
		};
	}

	get ratio() {
		return this.#ratio;
	}

	set ratio(r) {
		this.#ratio = r;
	}
}

class Game extends RenderComponent {
	static #canvasId = 'cvsPure';
	static #canvasClass = 'canvas-pure';
	#title;
	#transitionDuration = 1000;
	#context = null;
	#assets = null;
	#layers = new Map();

	constructor(title) {
		super();
		this.#title = title ?? this.constructor.name;
	}

	getLayer(id) {
		for (let e of this.#layers.entries()) {
			const [ key, layer ] = e;
			if (layer.id == id) {
				return layer;
			}
		}

		return null;
	}

	addLayers(...layers) {
		layers.forEach(layer => this.#layers.set(layer.id, layer));
	}

	removeLayers(...layers) {
		layers.map(l => l.id).forEach(i => this.#layers.delete(i));
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
			const { clientWidth: cw, clientHeight: ch } = document.body;
			const dimensions = {
				x: 0,
				y: 0,
				width: cw,
				height: ch
			};
			canvas.width = dimensions.width;
			canvas.height = dimensions.height;
			for (let e of this.#layers.entries()) {
				const [ key, layer ] = e;
				layer.onResize(dimensions);
			}
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

	async #init() {
		this.#setStyle();
		this.#createCanvas();
		window.addEventListener('resize', () => this.#onResize());
		this.#assets = await this.loadAssets();
		Object.freeze(this.#assets);
	}

	async loadAssets() {
		return {};
	}

	get assets() {
		return this.#assets;
	}

	update(instant) {
		const delta = instant.elapsed() / this.#transitionDuration;
		for (let e of this.#layers.entries()) {
			const [ key, layer ] = e;
			layer.update(instant);
			switch (layer.state) {
				case LayerState.INITIALIZING:
					layer.ratio += delta;
					if (layer.ratio >= 1) {
						console.log(layer.constructor.name, 'Activated');
						layer.ratio = 1;
						layer.advanceState();
					}

					break;
				case LayerState.TERMINATING:
					layer.ratio -= delta;
					if (layer.ratio <= 0) {
						console.log(layer.constructor.name, 'Deactivated');
						layer.ratio = 0;
						layer.advanceState();
					}

					break;
			}
		}
	}

	render(instant) {
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		this.clearCanvas();
		for (let e of this.#layers.entries()) {
			const [ key, layer ] = e;
			layer.render(instant);
			if (layer.ratio > 0) {
				const { x, y, w, h } = layer.dimensions;

				ctx.save();
				ctx.globalAlpha = layer.ratio;

				//ctx.filter = 'blur(6px)';
				//ctx.filter = 'sepia(1)';
				//ctx.filter = 'grayscale(0.7)';
				//ctx.filter = 'invert(0)';
				//ctx.filter = 'brightness(1)';
				//ctx.filter = 'contrast(1)';
				//ctx.filter = 'opacity(1)';

				ctx.drawImage(layer.renderTarget, x, y, w, h);
				ctx.restore();
			}
		}
	}

	async start() {
		await this.#init();
		Clock.start(instant => this.updateAndRender(instant));
	}
}
