const GameScreen = {
	START: 0,
	INTRO: 1,
	PLAYING: 2,
	PAUSED: 3,
	DEATH: 4,
	GAME_COMPLETION: 5
};
Object.freeze(GameScreen);

class Rogue extends Urge.Game {
	#save;
	#assets;

	constructor() {
		super([StartScreen, IntroScreen, PlayingScreen, CompletionScreen, GameOverScreen]);
		this.#save = null;
		this.#assets = {};
	}

	async init() {
		this.#save = this.#getSaveOrDefault();
		window.addEventListener('resize', () => this.onResize(), false);
		this.onResize();
		this.#assets['starFields'] = [
			this.#getStarField(250, 1, 2),
			this.#getStarField(200, 1, 3.5),
			this.#getStarField(150, 1, 5)
		];
		Nucleus.Keys.start();

		const state = {
			assets: this.#assets,
			save: this.#save
		};

		return state;
	}

	async start() {
		await super.start(StartScreen);
		this.onResize();
	}

	#getSaveOrDefault() {
		const namespace = 'com.manodestra.rogue';
		const model = Nucleus.Cryo.get('Save', namespace);
		if (!model) {
			console.log('Setting Default Model...');
			Nucleus.Cryo.set('Save', this.#getDefaultSave(), namespace);
		}

		return Nucleus.Cryo.get('Save', namespace);
	}

	#getDefaultSave() {
		return {
			id: 1,
			health: 100,
			damage: 10
		};
	}

	onResize() {
		const c = this.getCanvas();
		const b = document.body;
		c.width = b.clientWidth;
		c.height = b.clientHeight;
		this.updateScreens(b.clientWidth, b.clientHeight);
	}

	#getStarField(count = 250, minSize = 1, maxDelta = 3) {
		const canvas = this.getCanvas();
		return this.generateCanvas(c => {
			c.strokeStyle = '#0a0';
			c.fillStyle = 'cornflowerblue';
			for (let i = 0; i < count; i++) {
				const r = parseInt(Math.random() * 256);
				const g = parseInt(Math.random() * 256);
				const b = parseInt(Math.random() * 128) + 128;
				c.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
				const x = parseInt(Math.random() * canvas.width);
				const y = parseInt(Math.random() * canvas.height);
				const size = parseInt(Math.random() * maxDelta) + minSize;
				c.fillRect(x, y, size, size);
			}
		}, canvas.width, canvas.height);
	}
}

(async () => {
	const rogue = new Rogue();
	await rogue.start();
})();
