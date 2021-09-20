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

		ctx.save();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkred';
		const width = canvas.width * 0.8;
		const height = canvas.height * 0.8;
		ctx.strokeRect(width / 8, height / 8, width, height);
		ctx.fillRect(width / 8, height / 8, width, height);
		ctx.restore();
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();
});
