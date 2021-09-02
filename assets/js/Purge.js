// PURGE (Programmable Update Render Game Engine)
const Purge = (() => {
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
		Storage
	};
})();
