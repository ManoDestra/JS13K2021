const PlayState = {
	STARTING: 0,
	PLAYING: 1,
	COMPLETION: 2,
	DEATH: 3
};
Object.freeze(PlayState);

const MessageType = {
	PLAYER_BULLET: 0,
	CELL: 1
};
Object.freeze(MessageType);

class PlayingScreen extends Urge.Screen {
	#playState = PlayState.STARTING;
	#ship = null;
	#timeLine = null;
	#hud = null;
	#miles = 0;
	#targetMiles = 12000;

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
		this.#playState = PlayState.STARTING;
		this.#miles = 0;

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
		const ship = new Ship(ctx, startX, startY, size, save, this);
		store.put(ship);
		this.#ship = ship;
		console.log(this.#ship);

		this.#timeLine = new TimeLine(ctx, this);
		store.put(this.#timeLine);

		this.#hud = new Hud(ctx);
		store.put(this.#hud);
	}

	getRemainingMiles() {
		return Math.max(0, this.#targetMiles - this.#miles);
	}

	update(instant) {
		const store = this.getStore();
		const canvas = this.getCanvas();
		store.update(instant);
		this.#hud.setHealth(this.#ship.getHealth());
		this.#hud.setScore(this.#ship.getScore());
		this.#hud.setRemainingMiles(this.getRemainingMiles());

		switch (this.#playState) {
			case PlayState.STARTING:
				this.#updateStarting(instant);
				break;
			case PlayState.PLAYING:
				this.#updatePlaying(instant);
				break;
			case PlayState.COMPLETION:
				this.#updateCompletion(instant);
				break;
			case PlayState.DEATH:
				this.#updateDeath(instant);
				break;
		}

		// TODO: out of bound entity removals
		store.forEach((c, id, map) => {
			if (c instanceof PlayerBullet) {
				const box = c.getBoundingBox();
				const portraitRemoval = this.isPortrait() && box.getY() + box.getHeight() < 0;
				const nonPortraitRemoval = !this.isPortrait() && box.getX() > canvas.width;
				if (portraitRemoval || nonPortraitRemoval) {
					map.delete(id);
				}
			}

			if (c instanceof Enemy) {
				const box = c.getBoundingBox();
				const portraitRemoval = this.isPortrait() && box.getY() - (box.getHeight() / 2) > canvas.height;
				const nonPortraitRemoval = !this.isPortrait() && box.getX() + box.getWidth() < 0;
				if (portraitRemoval || nonPortraitRemoval) {
					map.delete(id);
				} else {
					store.forEach((sc, scId, scMap) => {
						if (sc instanceof PlayerBullet) {
							if (sc.getBoundingBox().intersects(c.getBoundingBox())) {
								// TODO: bullet impact?
								scMap.delete(scId);

								c.reduceHealth(25);
								if (!c.isAlive()) {
									// TODO: enemy explosion/death effect?
									this.#ship.increaseScore(10);
									map.delete(id);
								}
							}
						}

						if (sc instanceof Ship) {
							if (sc.getBoundingBox().intersects(c.getBoundingBox())) {
								// TODO: enemy explosion?
								map.delete(id);
								sc.reduceHealth(25);
								if (!sc.isAlive()) {
									scMap.delete(scId);
								}
							} else {
								// TODO: deal with proximity infection
							}
						}
					});
				}
			}
		});
	}

	#updateStarting(instant) {
		if (this.#ship.isActive()) {
			this.#playState = PlayState.PLAYING;
		}
	}

	#updatePlaying(instant) {
		const v = 10;
		this.#miles += v * instant.elapsed() / 1000;
		const remaining = this.getRemainingMiles();
		if (!this.#ship.isAlive()) {
			this.#playState = PlayState.DEATH;
		}

		if (remaining <= 0) {
			this.#playState = PlayState.COMPLETION;
		}
	}

	#updateCompletion(instant) {
		this.debug(instant, 'Completion');

		// TODO: remove, just testing here...
		//this.navigate(PlayingScreen);
		const ctx = this.getContext();
		ctx.fillStyle = 'white';
		ctx.font = '32px sans-serif';
		ctx.fillText('Completion', 50, 50);
	}

	#updateDeath(instant) {
		this.debug(instant, 'Death');

		// TODO: display death first and give a few seconds before restarting...
		//this.navigate(PlayingScreen);
		const ctx = this.getContext();
		ctx.fillStyle = 'white';
		ctx.font = '32px sans-serif';
		ctx.fillText('Death', 50, 50);
	}

	render(instant) {
		super.render(instant);
		const store = this.getStore();

		// TODO: render by types
		store.render(instant);
	}

	term() {
		super.term();
	}

	post(msgType) {
		//console.log('Message Received:', msgType, performance.now());
		const store = this.getStore();
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const portrait = this.isPortrait();
		switch (msgType) {
			case MessageType.PLAYER_BULLET:
				{
					const box = this.#ship.getBoundingBox();
					const x = box.getX() + (portrait ? box.getWidth() / 2 : box.getWidth() * 4 / 5);
					const y = box.getY() + (portrait ? box.getHeight() / 5 : box.getHeight() / 2);
					const width = portrait ? 5 : 20;
					const height = portrait ? 20 : 5;
					const bullet = new PlayerBullet(ctx, x, y, width, height);
					store.put(bullet);
				}

				break;
			case MessageType.CELL:
				{
					console.log('Cell Spawned', performance.now());
					const size = this.#getSize();
					const x = portrait
						? parseInt(Math.random() * (canvas.width - size))
						: canvas.width + (size / 2);
					const y = portrait
						? (0 - (size / 2))
						: parseInt(Math.random() * (canvas.height - size));
					const cell = new Cell(ctx, x, y, size, 100, 2);
					store.put(cell);
				}

				break;
			default:
				console.error('Unsupported Message Type:', msgType);
		}
	}

	#getSize() {
		const canvas = this.getCanvas();
		return (this.isPortrait() ? canvas.height : canvas.width) / 25;
	}
}
