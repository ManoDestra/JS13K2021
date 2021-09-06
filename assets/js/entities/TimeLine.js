class TimeLine extends Urge.Component {
	#totalElapsed;
	#send;

	constructor(context, send) {
		super(context);
		this.#totalElapsed = 0;
		this.#send = send;
	}

	update(instant) {
		this.#totalElapsed += instant.elapsed();

		// TODO: add enemy spawn logic here via this.#send
		if (instant.frame % 180 == 120) {
			this.#send('CELL');
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
