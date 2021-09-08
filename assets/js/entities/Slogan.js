class Slogan extends Urge.Sprite {
	#text;
	#delay;
	#totalElapsed = 0;

	constructor(context, x, y, width, height, text, delay) {
		super(context, x, y, width, height);
		this.#text = text;
		this.#delay = delay;
	}

	update(instant) {
		super.update(instant);
		if (this.#totalElapsed > this.#delay) {
			const velocity = -0.3;
			const delta = this.getHeight() * velocity * (instant.elapsed() / 1000);
			this.offsetY(delta);
		}

		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		if (this.#totalElapsed > this.#delay) {
			const ctx = this.getContext();
			const canvas = this.getCanvas();

			ctx.strokeStyle = 'darkgray';
			ctx.fillStyle = 'white';
			const fontSize = this.isPortrait() ? 32 : 48;
			ctx.font = fontSize + 'px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText(this.#text, this.getX(), this.getY());
		}
	}
}
