class TimeLine extends Urge.Component {
	#totalElapsed;
	#screen;

	constructor(context, screen) {
		super(context);
		this.#totalElapsed = 0;
		this.#screen = screen;
	}

	update(instant) {
		if (this.#totalElapsed > 5000) {
			const rate = 180;
			if (instant.frame % rate == 0) {
				this.debug(instant, 'SPAWN:', this.#totalElapsed);
				this.#screen.post(MessageType.CELL);
			}
		}

		this.#totalElapsed += instant.elapsed();
	}

	getTotalElapsed() {
		return this.#totalElapsed;
	}

	getTotalSeconds() {
		return Math.floor(this.#totalElapsed / 1000);
	}

	getTotalMinutes() {
		return Math.floor(this.getTotalSeconds() / 60);
	}

	getSeconds() {
		return this.getTotalSeconds() % 60;
	}
}
