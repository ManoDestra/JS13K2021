class GameOverScreen extends Urge.Screen {
	#totalElapsed = 0;

	constructor(game, state) {
		super(game, state);
	}

	init() {
		this.#totalElapsed = 0;
	}

	update(instant) {
		this.#totalElapsed += instant.elapsed();
		if (this.#totalElapsed > 5000 && this.getScreenState() == Urge.ScreenState.ACTIVE) {
			this.navigate(PlayingScreen);
		}
	}

	render(instant) {
		super.render(instant);

		const canvas = this.getCanvas();
		const ctx = this.getContext();
		ctx.font = '32px sans-serif';
		ctx.strokeStyle = 'white';
		ctx.textAlign = 'center';
		ctx.strokeText('You Have Died! Spawning Another Clone!', canvas.width / 2, canvas.height / 2);
	}
}
