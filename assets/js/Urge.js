// URGE (Update Render Game Engine)
const Urge = (() => {
	class BoundingBox {
		#x;
		#y;
		#width;
		#height;

		constructor(x, y, width, height) {
			this.#x = x;
			this.#y = y;
			this.#width = width;
			this.#height = height;
		}

		getX() {
			return this.#x;
		}

		getY() {
			return this.#y;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
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
		constructor() {
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
		constructor() {
			super();
		}

		render(instant) {
			// Empty Implementation
		}

		updateAndRender(instant) {
			this.update(instant);
			this.render(instant);
		}
	}

	class Sprite extends RenderComponent {
		#x = 0;
		#y = 0;
		#width = 0;
		#height = 0;

		constructor(x, y, width, height) {
			super();
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

	class Storage {
		constructor() {
		}

		static getAll(namespace) {
			if (!window?.localStorage) {
				throw new Error('Local Storage Is Not Supported!');
			}

			const o = {};
			for (let i = 0; i< localStorage.length; i++) {
				const key = localStorage.key(i);
				console.log('Key:', key);
				if (key.startsWith(namespace)) {
					const value = localStorage.getItem(key);
					console.log('Value:', value);
					const m = JSON.parse(value);
					console.log('Model:', m);
					o[key] = m;
				}
			}

			return o;
		}
	}

	class ComponentStore extends Component {
		#map = null;

		constructor() {
			super();
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

		renderByType(instant, type) {
			this.#map.forEach(c => {
				if (c instanceof RenderComponent && c instanceof type) {
					c.render(instant);
				}
			});
		}

		#getUniqueId() {
			const now = performance.now();
			const r = parseInt(Math.random() * 100000000);
			return now.toString() + '_' + r.toString();
		}
	}

	// TODO: complete this, but allow for plugin style logic
	class Manager extends RenderComponent {
		#components = [];

		constructor() {
			super();
		}

		add(component) {
			if (component instanceof Component) {
				this.#components.push(component);
			}
		}

		update(instant) {
			this.#components.filter(c => c instanceof Component).forEach(c => c.update(instant));
		}

		render(instant) {
			this.#components.filter(c => c instanceof RenderComponent).forEach(c => c.render(instant));
		}

		static instance() {
			return new Manager();
		}
	}

	return {
		BoundingBox,
		Component,
		RenderComponent,
		Sprite,
		Storage,
		ComponentStore
	};
})();
