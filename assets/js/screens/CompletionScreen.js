class CompletionScreen extends Urge.Screen {
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
			this.navigate(StartScreen);
		}
	}

	render(instant) {
		super.render(instant);

		const canvas = this.getCanvas();
		const ctx = this.getContext();
		ctx.font = '32px sans-serif';
		ctx.strokeStyle = 'white';
		ctx.textAlign = 'center';
		ctx.strokeText(
			'Congratulations! You Have Reached The Planet Of Our Enemies: EARTH!',
			canvas.width / 2,
			canvas.height / 2
		);
	}
}
