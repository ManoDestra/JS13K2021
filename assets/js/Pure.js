const Pure = (() => {
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
		// TODO: this should be a private instance variable. Maybe use a module for Pure?
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
		Component,
		RenderComponent,
		Manager
	};
})();
