class IntroScreen extends Urge.Screen {
	#totalElapsed = 0;

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
	}

	update(instant) {
		this.#totalElapsed += instant.elapsed();
		this.debug(instant, this.#totalElapsed);
	}

	render(instant) {
		const ctx = this.getContext();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkred';
		ctx.strokeRect(100, 100, 100, 100);
		ctx.fillRect(100, 100, 100, 100);
	}

	term() {
	}
}
