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
				//console.log('Spawning Cells Now...');
				//const cell = new Cell(ctx, canvas.width, canvas.height / 2, 100, 100, 0.3);
				//store.put(cell);
			}

			this.#totalElapsed += instant.elapsed();
			store.forEach((c, cId, cMap) => {
				if (c instanceof Cell) {
					store.forEach((b, bId, bMap) => {
						if (b instanceof SpaceButton) {
							if (c.getBoundingBox().intersects(b.getBoundingBox())) {
								console.log(performance.now(), 'Cell Intersects SpaceButton');
							}
						}
					})
				}
			});
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

class IntroScreen extends Urge.Screen {
	#totalElapsed = 0;
	#lastSpacePressed = false;
	#lines = [
		'Citizens Of Planet Tran!',
		'We Are Under Attack!',
		'Chemical Warfare, Waged From A Distant Galaxy!',
		'Scramble The Clone Pilots To Their Ships!',
		'Protect The Planet At All Costs From Space-Born Pathogens!',
		'Infectious Agents Of Unknown Origin Incoming!',
		'Be Strong, Clone Warriors!',
		'We Will Overcome These Personal Space Invaders!',
		'Avoid Infection! Practice Spatial Distancing!',
		'Never Fear! A New Clone Will Replace You When You Die',
		'Each New Clone Benefits From Your Experience',
		'With Enhanced Abilities And Skills',
		'Use W/S/A/D To Move',
		'Press SPACE To Shoot',
		'Now, Get Out There, Clone Warrior!',
		'Save Our Planet From This Nefarious Viral Attack!'
	];
	#points = [];

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
		const store = this.getStore();
		const state = this.getState();
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const x = canvas.width / 2;
		const y = canvas.height * 1.1;
		const width = canvas.width / 3;
		const height = canvas.height / 5;
		const sf1 = new StarField(ctx, {
			image: state.assets.starFields[0],
			scrollSeconds: 300
		});
		const sf2 = new StarField(ctx, {
			image: state.assets.starFields[1],
			scrollSeconds: 180
		});
		store.put(sf1, sf2);
		for (let i = 0; i < this.#lines.length; i++) {
			const text = this.#lines[i];
			const delay = (i * 2 + 1) * 1000;
			const slogan = new Slogan(ctx, x, y, width, height, text, delay);
			store.put(slogan);
		}

		const minRadius = 40;
		const maxRadius = 70;
		const count = 18;
		for (let i = 0; i < count; i++) {
			const angle = Math.PI * 2 * i / count;
			const length = minRadius + (Math.random() * (maxRadius - minRadius));
			const x = 200 + Math.cos(angle) * length;
			const y = 200 + Math.sin(angle) * length;
			this.#points.push([x, y]);
		}
	}

	update(instant) {
		const store = this.getStore();
		store.update(instant);
		const spacePressed = Nucleus.Keys.checkKey(' ');
		if (this.getScreenState() == Urge.ScreenState.ACTIVE && spacePressed && !this.#lastSpacePressed) {
			this.navigate(PlayingScreen);
		}

		this.#lastSpacePressed = spacePressed;
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		super.render(instant);
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const store = this.getStore();
		store.render(instant);
		const text = 'Press SPACE To Begin';

		ctx.fillStyle = '';
		ctx.font = '48px sans-serif';
		ctx.textAlign = 'center';
		const measured = ctx.measureText(text);
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkgreen';
		ctx.fillRect(((canvas.width - measured.width) / 2) - 10, 50, measured.width + 20, 58);
		ctx.fillStyle = 'white';
		ctx.fillText(text, canvas.width / 2, 98);

		ctx.moveTo(this.#points[0][0], this.#points[0][1]);
		for (let i = 0; i < this.#points.length; i++) {
			const nextIndex = (i + 1) % this.#points.length;
			const x_mid = (this.#points[i][0] + this.#points[nextIndex][0]) / 2;
			const y_mid = (this.#points[i][1] + this.#points[nextIndex][1]) / 2;
			const cp_x1 = (x_mid + this.#points[i][0]) / 2;
			const cp_x2 = (x_mid + this.#points[nextIndex][0]) / 2;
			ctx.quadraticCurveTo(cp_x1, this.#points[i][1], x_mid, y_mid);
			ctx.quadraticCurveTo(cp_x2, this.#points[nextIndex][1], this.#points[nextIndex][0], this.#points[nextIndex][1]);
		}

		ctx.stroke();
	}
}

class PlayingScreen extends Urge.Screen {
	#namespace = 'com.manodestra.rogue';
	#playState = PlayState.STARTING;
	#ship = null;
	#hud = null;
	#miles = 0;
	#targetMiles = 12000;
	#save = null;

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

		// TODO: we need to pull this from storage live, as we don't want the one in state.
		this.#save = this.#getSaveOrDefault();
		const ship = new Ship(ctx, startX, startY, size, this.#save, this);
		store.put(ship);
		this.#ship = ship;
		console.log(this.#ship);

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

								c.reduceHealth(this.#save.damage);
								if (!c.isAlive()) {
									// TODO: enemy explosion/death effect?
									// TODO: change this hard coded value to be based on the enemy killed
									this.#ship.increaseScore(1);
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

		const rate = 120 - Math.floor((this.#miles / this.#targetMiles) * 110)
		if (instant.frame % rate == 0) {
			this.post(MessageType.CELL);
		}
	}

	#updateCompletion(instant) {
		this.debug(instant, 'Completion');
		this.#saveAndNavigate(CompletionScreen);
	}

	#updateDeath(instant) {
		this.debug(instant, 'Death');
		this.#saveAndNavigate(GameOverScreen);
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
					const size = this.#getSize();
					const x = portrait
						? parseInt(Math.random() * (canvas.width - size))
						: canvas.width + (size / 2);
					const y = portrait
						? (0 - (size / 2))
						: parseInt(Math.random() * (canvas.height - size));

					const health = 1 + Math.floor(this.#miles / 3);
					const velocity = (this.#miles / 1000) + 2;
					const cell = new Cell(ctx, x, y, size, health, velocity);
					console.log('Cell Spawned', performance.now(), cell);
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

	#saveAndNavigate(screenType) {
		if (this.getScreenState() == Urge.ScreenState.ACTIVE) {
			const healthRate = 100;
			const damageRate = 3;
			const healthBoost = Math.floor(this.#miles / healthRate);
			const damageBoost = Math.floor(this.#ship.getScore() / damageRate);

			this.#save.id++;
			this.#save.health += healthBoost;
			this.#save.damage += damageBoost;
			this.#saveGame();
			this.navigate(screenType);
		}
	}

	#getSaveOrDefault() {
		const model = Nucleus.Cryo.get('Save', this.#namespace);
		if (!model) {
			console.log('Setting Default Model...');
			Nucleus.Cryo.set('Save', this.#getDefaultSave(), this.#namespace);
		}

		return Nucleus.Cryo.get('Save', this.#namespace);
	}

	#getDefaultSave() {
		return {
			id: 1,
			health: 100,
			damage: 1
		};
	}

	#saveGame() {
		Nucleus.Cryo.set('Save', this.#save, this.#namespace);
	}
}

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
