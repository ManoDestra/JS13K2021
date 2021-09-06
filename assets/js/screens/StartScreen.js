class StartScreen extends Urge.Screen {
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
			scrollSeconds: 30
		});
		const sf2 = new StarField(ctx, {
			image: state.assets.starFields[1],
			scrollSeconds: 24
		});
		const sf3 = new StarField(ctx, {
			image: state.assets.starFields[2],
			scrollSeconds: 21
		});
		store.put(sf1, sf2, sf3);
	}

	update(instant) {
		const delta = 3;
		if (Nucleus.KeyInputHandler.checkKey(' ', true)) {
			console.log('Space Pressed', performance.now());
		}
	}

	render(instant) {
		const ctx = this.getContext();
		const store = this.getStore();
		super.render(instant);
		store.renderByTypes(instant, StarField);
	}

	term() {
		super.term();
	}
}
