class TimeLine extends Urge.Component {
	#totalElapsed;
	#screen;

	constructor(context, screen) {
		super(context);
		this.#totalElapsed = 0;
		this.#screen = screen;
	}

	update(instant) {
		this.#totalElapsed += instant.elapsed();

		if (this.#totalElapsed > 5000) {
			if (instant.frame % 180 == 120) {
				this.debug(instant, 'SPAWN:', this.#totalElapsed);
				this.#screen.post(MessageType.CELL);
			}
		}
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
