const Pure = (() => {
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
		Manager
	};
})();
