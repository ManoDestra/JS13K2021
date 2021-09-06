class StartScreen extends Urge.Screen {
	constructor(state) {
		super(state);
	}

	init() {
		super.init();
		console.log('Store:', this.getStore());
	}

	update(instant) {
	}

	render(instant) {
		// TODO: add types at the end of this call
		this.getStore().renderByTypes(instant);
	}

	term() {
		super.term();
	}
}
