class StartScreen extends Urge.Screen {
	#lastSpacePressed = false;

	constructor(state) {
		super(state);
	}

	init() {
		super.init();
		const state = this.getState();
		const store = this.getStore();
		const ctx = this.getContext();
		console.log('State:', state);
		console.log('Store:', store);
		console.log('Context:', ctx);

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
		const spaceButton = new SpaceButton(ctx);
		store.put(sf1, sf2, sf3, spaceButton);
	}

	update(instant) {
		const store = this.getStore();
		store.update(instant);
		const spacePressed = Nucleus.Keys.checkKey(' ');
		if (spacePressed && !this.#lastSpacePressed) {
			console.log('Space Pressed', performance.now());
			// TODO: navigate to IntroScreen
		}

		this.#lastSpacePressed = spacePressed;
	}

	render(instant) {
		const ctx = this.getContext();
		const store = this.getStore();
		super.render(instant);
		store.renderByTypes(instant, StarField, SpaceButton);
	}

	term() {
		super.term();
	}
}
