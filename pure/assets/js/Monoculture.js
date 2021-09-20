class Monoculture extends Game {
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

		const widthUnit = canvas.width / 10;
		const heightUnit = canvas.height / 10;
		const width = widthUnit * 8;;
		const height = heightUnit * 8;

		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkred';
		//ctx.globalAlpha = 0.7;
		ctx.strokeRect(widthUnit, heightUnit, width, height);
		ctx.fillRect(widthUnit, heightUnit, width, height);
		ctx.restore();
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();
});
