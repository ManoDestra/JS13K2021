class StartScreen extends Urge.Screen {
	#x = 100;
	#y = 100;

	constructor(state) {
		super(state);
	}

	init() {
		super.init();
		console.log('Store:', this.getStore());
	}

	update(instant) {
		const delta = 3;
		if (Nucleus.KeyInputHandler.checkKey('w', true)) {
			this.#y -= delta;
		}

		if (Nucleus.KeyInputHandler.checkKey('s', true)) {
			this.#y += delta;
		}

		if (Nucleus.KeyInputHandler.checkKey('a', true)) {
			this.#x -= delta;
		}

		if (Nucleus.KeyInputHandler.checkKey('d', true)) {
			this.#x += delta;
		}
	}

	render(instant) {
		super.render(instant);

		// TODO: add types at the end of this call
		this.getStore().renderByTypes(instant);

		const ctx = this.getContext();
		ctx.fillStyle = 'yellow';
		ctx.fillRect(this.#x, this.#y, 100, 100);
	}

	term() {
		super.term();
	}
}
