class StartScreen extends Urge.Screen {
	init() {
		console.log('Store:', this.getStore());
	}

	update(instant) {
	}

	render(instant) {
	}

	term() {
		this.getStore().clear();
	}
}
