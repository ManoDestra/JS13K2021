class Monoculture extends Game {
	constructor() {
		super();
	}

	update(instant) {
		if (instant.frame % 60 == 0) {
			console.log('Update:', instant);
		}
	}

	render(instant) {
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();
});
