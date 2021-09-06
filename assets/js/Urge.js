// URGE (Update Render Game Engine)
const Urge = (() => {
	const ABSTRACT_ERROR = 'Abstract Class Cannot Be Instantiated';

	class Dimension {
		#width;
		#height;

		constructor(width, height) {
			this.#width = width;
			this.#height = height;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
		}
	}

	class BoundingBox extends Dimension {
		#x;
		#y;

		constructor(x, y, width, height) {
			super(width, height);
			this.#x = x;
			this.#y = y;
		}

		getX() {
			return this.#x;
		}

		getY() {
			return this.#y;
		}

		getLeft() {
			return this.getX();
		}

		getRight() {
			return this.getX() + this.getWidth();
		}

		getTop() {
			return this.getY();
		}

		getBottom() {
			return this.getY() + this.getHeight();
		}

		getCenter() {
			return [this.getX() + (this.getWidth() / 2), this.getY() + (this.getHeight() / 2)];
		}

		getTopLeft() {
			return [this.getLeft(), this.getTop()];
		}

		getTopRight() {
			return [this.getRight(), this.getTop()];
		}

		getBottomLeft() {
			return [this.getLeft(), this.getBottom()];
		}

		getBottomRight() {
			return [this.getRight(), this.getBottom()];
		}

		getCorners() {
			return [
				this.getTopLeft(),
				this.getTopRight(),
				this.getBottomLeft(),
				this.getBottomRight()
			];
		}

		intersects(box) {
			if (this.getRight() < box.getLeft()) {
				return false;
			}

			if (this.getLeft() > box.getRight()) {
				return false;
			}

			if (this.getBottom() < box.getTop()) {
				return false;
			}

			if (this.getTop() > box.getBottom()) {
				return false;
			}

			const corners = this.getCorners();
			const valid = corners.some(c => {
				const validLeft = c[0] >= box.getLeft();
				const validRight = c[0] <= box.getRight();
				const validTop = c[1] >= box.getTop();
				const validBottom = c[1] <= box.getBottom();
				//console.log(c, validLeft, validRight, validTop, validBottom);
				return validLeft && validRight && validTop && validBottom;
			});

			return valid;
		}
	}

	class Component {
		#context;

		constructor(context) {
			this.#context = context;
			if (this.constructor == Component) {
				throw new Error(ABSTRACT_ERROR);
			}
		}

		getContext() {
			return this.#context;
		}

		setContext(context) {
			this.#context = context;
		}

		getCanvas() {
			const selector = this.#context.canvas?.id ? '#' + this.#context.canvas.id : 'canvas';
			const canvasById = Nucleus.$(selector);
			const canvas = Nucleus.$('canvas');
			return (canvasById ?? canvas) ?? this.#context.canvas;
		}

		isPortrait() {
			const canvas = this.getCanvas();
			return canvas.height > canvas.width;
		}

		update(instant) {
			// Empty Implementation
		}

		debug(instant, message) {
			if (instant.frame % 60 == 0) {
				console.log(message);
			}
		}
	}

	class RenderComponent extends Component {
		constructor(context) {
			super(context);
			if (this.constructor == RenderComponent) {
				throw new Error(ABSTRACT_ERROR);
			}
		}

		render(instant) {
			RenderComponent.clear(this.getContext());
		}

		updateAndRender(instant) {
			this.update(instant);
			this.render(instant);
		}

		static clear(ctx, color = '#400', width = 0, height = 0) {
			const w = width > 0 ? width : ctx.canvas.width;
			const h = height > 0 ? height : ctx.canvas.height;
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, w, h);
		}
	}

	class Sprite extends RenderComponent {
		#x = 0;
		#y = 0;
		#width = 0;
		#height = 0;

		constructor(context, x, y, width, height) {
			super(context);
			if (this.constructor == Sprite) {
				throw new Error(ABSTRACT_ERROR);
			}

			this.#x = x;
			this.#y = y;
			this.#width = width;
			this.#height = height;
		}

		getX() {
			return this.#x;
		}

		setX(x) {
			this.#x = x;
		}

		offsetX(delta) {
			this.#x += delta;
		}

		getY() {
			return this.#y;
		}

		setY(y) {
			this.#y = y;
		}

		offsetY(delta) {
			this.#y += delta;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
		}

		getBoundingBox() {
			return new BoundingBox(this.#x, this.#y, this.#width, this.#height);
		}

		moveTo(x, y) {
			this.setX(x);
			this.setY(y);
		}

		moveBy(deltaX, deltaY) {
			this.offsetX(deltaX);
			this.offsetY(deltaY);
		}
	}

	class ComponentStore extends Component {
		#map = null;

		constructor(context) {
			super(context);
			this.#map = new Map();
		}

		put(...components) {
			const arr = [];
			for (let component of components) {
				if (!(component instanceof Component)) {
					throw new Error('Not A Component');
				}

				const id = this.#getUniqueId();
				this.#map.set(id, component);
				arr.push(id);
			}

			return arr;
		}

		get(id) {
			return this.#map.get(id);
		}

		remove(id) {
			this.#map.delete(id);
		}

		clear() {
			this.#map.clear();
		}

		keys() {
			return this.#map.keys();
		}

		values() {
			return this.#map.values();
		}

		entries() {
			return this.#map.entries();
		}

		entriesByType(type) {
			const arr = [];
			for (let e of this.entries()) {
				if (e[1] instanceof type) {
					arr.push(e);
				}
			}

			return arr;
		}

		forEach(callback) {
			this.#map.forEach(callback);
		}

		count() {
			return this.#map.size;
		}

		update(instant) {
			this.#map.forEach(c => c.update(instant));
		}

		render(instant) {
			this.#map.forEach(c => {
				if (c instanceof RenderComponent) {
					c.render(instant);
				}
			});
		}

		renderByTypes(instant, ...types) {
			types.forEach(type => {
				this.#map.forEach(c => {
					if (c instanceof RenderComponent && c instanceof type) {
						c.render(instant);
					}
				});
			});
		}

		#getUniqueId() {
			const now = performance.now();
			const r = parseInt(Math.random() * 100000000);
			return now.toString() + '_' + r.toString();
		}
	}

	const ScreenState = {
		INACTIVE: 0,
		INITIALIZING: 1,
		ACTIVE: 2,
		TERMINATING: 3
	};
	Object.freeze(ScreenState);

	// TODO: work on screen management module also
	class Screen extends RenderComponent {
		#store;
		#state;

		constructor(state) {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			super(context);
			if (this.constructor == Screen) {
				throw new Error(ABSTRACT_ERROR);
			}

			this.#store = new ComponentStore(context);
			this.#state = state;
		}

		getStore() {
			return this.#store;
		}

		getState() {
			return this.#state;
		}

		init() {
			console.log('Screen Initialization');
		}

		term() {
			console.log('Screen Termination');
			this.getStore().clear();
		}
	}

	class Game extends RenderComponent {
		#selector;

		constructor(selector = 'canvas') {
			const canvas = Nucleus.$(selector);
			if (!canvas) {
				throw new Error('Canvas Not Found: ' + selector);
			}

			super(canvas.getContext('2d'));
			if (this.constructor == Game) {
				throw new Error(ABSTRACT_ERROR);
			}

			this.#selector = selector;
		}

		getCanvas() {
			return Nucleus.$(this.#selector);
		}

		async init() {
		}

		async start() {
			console.log('Starting...');
			return this.init().then(s => {
				console.log('Success', s);
				Nucleus.Clock.start(instant => this.updateAndRender(instant));
				return s;
			}).catch(f => {
				console.error(f);
				return f;
			}).finally(() => {
				console.log('Started');
			});
		}

		generateCanvas(f, w = 256, h = 256) {
			const c = document.createElement('canvas');
			c.width = w;
			c.height = h;
			const x = c.getContext('2d');
			if (f) {
				f(x);
			}

			return c;
		}

		async generateImage(func, type = 'image/png', quality = 0.92, width, height) {
			const c = this.generateCanvas(func, width, height);
			const i = new Image();
			i.src = c.toDataURL(type, quality);
			await i.decode();
			return i;
		}
	}

	return {
		BoundingBox,
		Component,
		RenderComponent,
		Sprite,
		ComponentStore,
		ScreenState,
		Screen,
		Game
	};
})();
