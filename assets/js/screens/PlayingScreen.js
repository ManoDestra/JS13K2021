class PlayingScreen extends Urge.Screen {
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
		const store = this.getStore();
		store.update(instant);
	}

	render(instant) {
		super.render(instant);
		const store = this.getStore();
		store.render(instant);
	}

	term() {
	}
}
