const PlayState = {
	STARTING: 0,
	PLAYING: 1
};
Object.freeze(PlayState);

class PlayingScreen extends Urge.Screen {
	#playState = PlayState.STARTING;
	#ship = null;

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
		const state = this.getState();
		const store = this.getStore();
		const canvas = this.getCanvas();
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

		const size = this.#getSize();
		const startX = this.isPortrait() ? (canvas.width - size) / 2 : -size;
		const startY = this.isPortrait() ? canvas.height + (size * 2) : (canvas.height - size) / 2;
		const save = state.save;
		const receive = msg => {
			console.log('Message Received:', msg);
		};
		const ship = new Ship(ctx, startX, startY, size, save, receive);
		store.put(ship);
		this.#ship = ship;
		console.log(this.#ship);
	}

	update(instant) {
		const store = this.getStore();
		store.update(instant);
		switch (this.#playState) {
			case PlayState.STARTING:
				if (this.#ship.isActive()) {
					this.#playState = PlayState.PLAYING;
				}

				break;
			case PlayState.PLAYING:
				break;
		}

		this.debug(instant, 'Play State:', this.#playState);
	}

	render(instant) {
		super.render(instant);
		const store = this.getStore();
		store.render(instant);
	}

	term() {
	}

	#getSize() {
		const canvas = this.getCanvas();
		return (this.isPortrait() ? canvas.height : canvas.width) / 25;
	}
}
