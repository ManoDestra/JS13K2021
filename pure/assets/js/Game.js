class Monoculture extends Game {
	constructor() {
		super();
	}

	update(instant) {
	}

	render(instant) {
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();
});
