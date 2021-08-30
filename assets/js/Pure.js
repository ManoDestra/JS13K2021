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
		constructor() {
			super();
			this.components = [];
		}

		update(instant) {
			this.components.filter(c => c instanceof Component).forEach(c => c.update(instant));
		}

		render(instant) {
			this.components.filter(c => c instanceof RenderComponent).forEach(c => c.render(instant));
		}
	}

	return {
		Component,
		RenderComponent,
		Manager
	};
})();
