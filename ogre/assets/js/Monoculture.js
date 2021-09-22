class Monoculture extends Game {
	#transform = null;

	constructor() {
		super();
	}

	update(instant) {
		//this.debug(instant, 'Elapsed:', instant.elapsed(), instant.fps());
	}

	render(instant) {
		const canvas = this.getCanvas();
		const ctx = this.getContext();

		// TODO: this call could be automatic
		this.clearCanvas(canvas, ctx);

		//const widthUnit = canvas.width / 10;
		//const heightUnit = canvas.height / 10;
		//const width = widthUnit * 8;;
		//const height = heightUnit * 8;

		ctx.save();

		ctx.lineWidth = 0.02;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkred';
		ctx.translate(20, 30);
		ctx.scale(canvas.width, canvas.height);
		if (!this.#transform) {
			this.#transform = ctx.getTransform();
			console.log(this.#transform);
		}

		ctx.strokeRect(0.1, 0.1, 0.8, 0.8);
		ctx.fillRect(0.1, 0.1, 0.8, 0.8);

		//ctx.globalAlpha = 0.7;
		//ctx.strokeRect(widthUnit, heightUnit, width, height);
		//ctx.fillRect(widthUnit, heightUnit, width, height);

		ctx.restore();
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();

	const matrix = new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	console.log(matrix);
});
