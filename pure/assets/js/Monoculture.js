class Monoculture extends Game {
	constructor() {
		super();
	}

	update(instant) {
		this.debug(instant, 'Elapsed:', instant.elapsed(), instant.fps());
	}

	render(instant) {
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();
});
