class StartScreen extends Urge.Screen {
	#totalElapsed = 0;
	#lastSpacePressed = false;
	#lastScreenState = Urge.ScreenState.INACTIVE;
	#spawned = false;

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
		const state = this.getState();
		const store = this.getStore();
		const ctx = this.getContext();
		const sf1 = new StarField(ctx, {
			image: state.assets.starFields[0],
			scrollSeconds: 150
		});
		const sf2 = new StarField(ctx, {
			image: state.assets.starFields[1],
			scrollSeconds: 110
		});
		const sf3 = new StarField(ctx, {
			image: state.assets.starFields[2],
			scrollSeconds: 75
		});
		store.put(sf1, sf2, sf3);
	}

	update(instant) {
		const store = this.getStore();
		const ctx = this.getContext();
		const canvas = this.getCanvas();

		store.update(instant);
		const screenState = this.getScreenState();
		if (screenState == Urge.ScreenState.ACTIVE) {
			const spacePressed = Nucleus.Keys.checkKey(' ');
			if (spacePressed && !this.#lastSpacePressed) {
				console.log('Space Pressed', performance.now());
				this.navigate(IntroScreen);
			}

			this.#lastSpacePressed = spacePressed;

			if (this.#lastScreenState == Urge.ScreenState.INITIALIZING) {
				const spaceButton = new SpaceButton(ctx);
				store.put(spaceButton);
			}

			if (!this.#spawned && this.#totalElapsed > 5000) {
				this.#spawned = true;
				console.log('Spawning Cells Now...');
				const cell = new Cell(ctx, canvas.width, canvas.height / 2, 100, 100, 0.3);
				store.put(cell);
			}

			this.debug(instant, 'Total Elapsed:', this.#totalElapsed);
			this.#totalElapsed += instant.elapsed();
		}

		this.#lastScreenState = screenState;
	}

	render(instant) {
		const ctx = this.getContext();
		const store = this.getStore();
		super.render(instant);
		store.renderByTypes(instant, StarField, SpaceButton, Cell);
	}
}
