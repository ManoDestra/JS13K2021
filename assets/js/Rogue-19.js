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
		super([StartScreen, IntroScreen, PlayingScreen]);
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

		const startScreen = new StartScreen(state);

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

const RogueEx = (() => {
	const DARK = '#111';
	const GREEN = '#0a0';
	const LIGHT = '#eee';
	const FONT = '2em sans-serif';

	const canvas = Nucleus.$('canvas');
	//canvas.onclick = e => canvas.requestFullscreen();
	const ctx = canvas.getContext('2d');
	const store = new Urge.ComponentStore(ctx);

	function start() {
		init()
			.then(r => Nucleus.Clock.start(updateAndRender))
			.catch(e => console.error(e))
			.finally(() => console.log('Started'));
	}

	async function init() {
		const save = getSaveOrDefault();
		console.log('Save:', save);

		onResize();
		window.onresize = onResize;

		const assets = await preRender();

		const sf1 = new StarField(ctx, {
			image: assets.starField1,
			scrollSeconds: 30
		});
		const sf2 = new StarField(ctx, {
			image: assets.starField2,
			scrollSeconds: 24
		});
		const sf3 = new StarField(ctx, {
			image: assets.starField3,
			scrollSeconds: 21
		});
		store.put(sf1, sf2, sf3);

		const size = getSize();
		const startX = isPortrait() ? (canvas.width - size) / 2 : size;
        const startY = isPortrait() ? canvas.height - (size * 2) : (canvas.height - size) / 2;
        const ship = new Ship(ctx, startX, startY, size, save, receive);
        store.put(ship);
        console.log(ship);

		const timeLine = new TimeLine(ctx, receive);
		store.put(timeLine);

		const hud = new Hud(ctx, timeLine);
		store.put(hud);

		Nucleus.Keys.start();

		return assets;
	}

	function getSaveOrDefault() {
		const namespace = 'com.manodestra.rogue';
		console.log('Removing All Storage By Namespace...');
		Nucleus.Cryo.removeByNamespace(namespace);
		const model = Nucleus.Cryo.get('Save', namespace);
		if (!model) {
			console.log('Setting Default Model...');
			const defaultSave = {
				health: 100
			};
			Nucleus.Cryo.set('Save', defaultSave, namespace);
		}

		return Nucleus.Cryo.get('Save', namespace);
	}

	function receive(message) {
		switch (message) {
			case 'PLAYER_BULLET':
				{
					store.forEach(c => {
						if (c instanceof Ship) {
							const ship = c;
							const box = ship.getBoundingBox();
							const x = box.getX() + (isPortrait() ? box.getWidth() / 2 : box.getWidth());
							const y = box.getY() + (isPortrait() ? 0 : box.getHeight() / 2);
							const width = isPortrait() ? 5 : 20;
							const height = isPortrait() ? 20 : 5;
							const bullet = new PlayerBullet(this.getContext(), x, y, width, height);
							store.put(bullet);
						}
					});
				}

				break;
			case 'CELL':
				{
					const size = getSize();
					const x = isPortrait()
						? parseInt(Math.random() * (canvas.width - size))
						: canvas.width + (size / 2);
					const y = isPortrait()
						? (0 - (size / 2))
						: parseInt(Math.random() * (canvas.height - size));
					const cell = new Cell(this.getContext(), x, y, size, 100);
					store.put(cell);
				}

				break;
			default:
				throw new Error('Unsupported Message: ' + message);
		}
	}

	function isPortrait() {
		return canvas.width < canvas.height;
	}

	function getSize() {
		return (isPortrait() ? canvas.height : canvas.width) / 25;
	}

	async function preRender() {
		const [starField1, starField2, starField3] = await Promise.all([
			getStarField(250, 1, 2),
			getStarField(200, 1, 3.5),
			getStarField(150, 1, 5)
		]);
		return {
			starField1, starField2, starField3
		};
	}

	function getStarField(count = 250, minSize = 1, maxDelta = 3) {
		return generateImage({
			width: canvas.width,
			height: canvas.height,
			consumer: c => {
				c.strokeStyle = GREEN;
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
			}
		});
	}

	async function generateImage(options) {
		const {
			consumer: f,
			width : w = 256,
			height : h = 256,
			type : t = 'image/png',
			quality : q = 1.0
		} = options;

		const i = new Image();
		const c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		const x = c.getContext('2d');
		if (f) {
			f(x);
		}

		i.src = c.toDataURL();
		await i.decode();
		return i;
	}

	function onResize() {
		const b = document.body;
		canvas.width = b.clientWidth;
		canvas.height = b.clientHeight;
	}

	function clear() {
		ctx.fillStyle = DARK;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function updateAndRender(instant) {
		update(instant);
		render(instant);
	}

	function update(instant) {
		store.update(instant);

		store.forEach((c, id, map) => {
			if (c instanceof PlayerBullet) {
				const box = c.getBoundingBox();
				const portraitRemoval = isPortrait() && box.getY() + box.getHeight() < 0;
				const nonPortraitRemoval = !isPortrait() && box.getX() > canvas.width;
				if (portraitRemoval || nonPortraitRemoval) {
					console.log('Bullet Removed', performance.now());
					map.delete(id);
				}
			}

			if (c instanceof Enemy) {
				const box = c.getBoundingBox();
				const portraitRemoval = isPortrait() && box.getY() - (box.getHeight() / 2) > canvas.height;
				const nonPortraitRemoval = !isPortrait() && box.getX() + box.getWidth() < 0;
				if (portraitRemoval || nonPortraitRemoval) {
					console.log('Enemy Removed', performance.now());
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
									console.log('You be DEAD!');
									scMap.delete(scId);
								} else {
									console.log('Ship Health: ' + sc.getHealth());
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

	function render(instant) {
		clear();
		store.renderByTypes(instant, StarField, Ship, PlayerBullet, Enemy, Hud);
	}

	return {
		start
	};
})();


(async () => {
	const rogue = new Rogue();
	await rogue.start();
	console.log('Rogue:', rogue);
	console.log('Screen State:', Urge.ScreenState);
})();

//RogueEx.start();
