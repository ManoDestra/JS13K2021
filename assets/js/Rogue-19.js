/*
const Test = (() => {
	function foobar(clazz) {
		if (clazz.prototype instanceof Urge.Component) {
			const instance = new clazz();
			console.log('Instance:', instance);
		} else {
			console.log('Not A GameComponent:', clazz);
		}
	}

	return {
		foobar
	};
})();

const SpaceGame = (() => {
	let patternMoon = null;

	const GameScreen = {
		START: 0,
		MENU: 1,
		SKILLS: 2,
		PLAYING: 3,
		PAUSED: 4,
		GAME_OVER: 5
	};
	Object.freeze(GameScreen);
	const ScreenState = {
		INACTIVE: 0,
		INITIALIZING: 1,
		ACTIVE: 2,
		TERMINATING: 3
	};
	Object.freeze(ScreenState);

	const SpaceState = {
		state: Screen.START,
		level: 1,
		player: {
			health: 100,
			shield: 0,
			xp: 0
		},
		skills: {
			health: 100,
			shield: 0,
			xp: 0
		}
	};

	function drawPlanets() {
		for (let i = 0; i < 5; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			const r = parseInt(Math.random() * 50) + 20;
			const g = context.createLinearGradient(x + r, y, x + r, y + (r * 1));
			g.addColorStop(0, '#333');
			g.addColorStop(0.5, '#fff');
			g.addColorStop(1, '#333');
			context.strokeStyle = LIGHT;
			//context.fillStyle = g;
			context.fillStyle = this.patternMoon;
			//context.fillStyle = 'url(assets/images/Moon01.jpg)';

			context.beginPath();
			context.arc(x, y, r, 0, Math.PI * 2);
			context.fill();
			context.closePath();
		}
	}
})();
*/

const Rogue = (() => {
	const GameScreen = {
		START: 0,
		INTRO: 1,
		PLAYING: 2,
		PAUSED: 3,
		GAME_OVER: 4
	};

	class StarField extends Urge.RenderComponent {
		constructor(options) {
			super();
			this.x = 0;
			this.y = 0;
			this.image = options.image;
			this.scrollSeconds = options?.scrollSeconds ?? 10;
			this.offsetX = options?.offsetX ?? 0;
			this.offsetY = options?.offsetY ?? 0;
		}

		update(instant) {
			const portrait = isPortrait();
			const pixelCount = parseFloat((portrait ? canvas.height : canvas.width) / this.scrollSeconds);
			const pixelsToMove = pixelCount * instant.elapsed() / 1000;
			if (portrait) {
				this.x = 0;
				this.y += pixelsToMove;
			} else {
				this.y = 0;
				this.x -= pixelsToMove;
			}

			while (this.x < -canvas.width) {
				this.x += canvas.width;
			}

			while (this.y > canvas.height) {
				this.y -= canvas.height;
			}
		}

		render(instant) {
			ctx.drawImage(this.image, this.x + this.offsetX, this.y + this.offsetY, canvas.width, canvas.height);
			if (isPortrait()) {
				ctx.drawImage(this.image, this.x + this.offsetX, this.y + this.offsetY - canvas.height, canvas.width, canvas.height);
			} else {
				ctx.drawImage(this.image, this.x + this.offsetX + canvas.width, this.y + this.offsetY, canvas.width, canvas.height);
			}
		}
	}

	class Ship extends Urge.Sprite {
		#send = null;

		constructor(x, y, size, send) {
			super(x, y, size, size);
			this.#send = send;
		}

		update(instant) {
			this.size = getSize();
			const delta = this.getWidth() * 4 * instant.elapsed() / 1000;
			if (Nucleus.KeyInputHandler.checkKey('w', true)) {
				this.offsetY(-delta);
			}

			if (Nucleus.KeyInputHandler.checkKey('s', true)) {
				this.offsetY(delta);
			}

			if (Nucleus.KeyInputHandler.checkKey('a', true)) {
				this.offsetX(-delta);
			}

			if (Nucleus.KeyInputHandler.checkKey('d', true)) {
				this.offsetX(delta);
			}

			const sideLimit = 10;
			if (isPortrait()) {
				this.setX(Math.min((canvas.width) - this.getWidth() - sideLimit, Math.max(sideLimit, this.getX())));
				this.setY(Math.max((canvas.height * 0.6), Math.min(canvas.height - this.getWidth() - sideLimit, this.getY())));
			} else {
				this.setX(Math.min((canvas.width * 0.4) - this.getWidth(), Math.max(sideLimit, this.getX())));
				this.setY(Math.min(canvas.height - this.getWidth() - sideLimit, Math.max(sideLimit, this.getY())));
			}

			//TODO: handle the fire rate
			if (Nucleus.KeyInputHandler.checkKey(' ') && instant.frame % 30 == 0) {
				this.#send('PLAYER_BULLET');
			}
		}

		render(instant) {
			const points = isPortrait() ? [
				[this.getX() + this.getWidth(), this.getY() + this.getWidth()],
				[this.getX() + (this.getWidth() / 2), this.getY() + (this.getWidth() * 2 / 3)],
				[this.getX(), this.getY() + this.getWidth()],
				[this.getX() + (this.getWidth() / 2), this.getY()]
			] : [
				[this.getX(), this.getY() + this.getWidth()],
				[this.getX() + (this.getWidth() / 3), this.getY() + (this.getWidth() / 2)],
				[this.getX(), this.getY()],
				[this.getX() + this.getWidth(), this.getY() + (this.getWidth() / 2)]
			];
			ctx.strokeStyle = 'cornflowerblue';
			ctx.lineWidth = 3;
			ctx.fillStyle = 'darkgreen';
			ctx.beginPath();
			ctx.moveTo(points[3][0], points[3][1]);
			points.forEach(p => {
				ctx.lineTo(p[0], p[1]);
				ctx.stroke();
			});
			ctx.fill();
			ctx.closePath();
		}
	}

	class PlayerBullet extends Urge.Sprite {
		constructor(x, y, width, height) {
			super(x, y, width, height);
		}

		update(instant) {
			const bulletSpeed = 40;
			const ratio = bulletSpeed * instant.elapsed() / 1000;
			if (isPortrait()) {
				this.offsetY(-this.getHeight() * ratio);
			} else {
				this.offsetX(this.getWidth() * ratio);
			}
		}

		render(instant) {
			ctx.fillStyle = 'yellow';
			if (isPortrait()) {
				ctx.fillRect(this.getX() - this.getWidth(), this.getY() - this.getHeight(), this.getWidth(), this.getHeight());
			} else {
				ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
			}
		}
	}

	class TimeLine extends Urge.Component {
		#totalElapsed;
		#send;

		constructor(send) {
			super();
			this.#totalElapsed = 0;
			this.#send = send;
		}

		update(instant) {
			this.#totalElapsed += instant.elapsed();

			// TODO: add enemy spawn logic here via this.#send
			if (instant.frame % 180 == 120) {
				this.#send('CELL');
			}
		}

		getTotalElapsed() {
			return this.#totalElapsed;
		}

		getTotalSeconds() {
			return Math.floor(this.#totalElapsed / 1000);
		}

		getTotalMinutes() {
			return Math.floor(this.getTotalSeconds() / 60);
		}

		getSeconds() {
			return this.getTotalSeconds() % 60;
		}
	}

	class Enemy extends Urge.Sprite {
		#health;

		constructor(x, y, width, height, health) {
			super(x, y, width, height);
			this.#health = health;
		}

		getHealth() {
			return this.#health;
		}

		reduceHealth(damage) {
			this.#health -= Math.abs(damage);
			this.#health = Math.max(0, this.#health);
		}

		isAlive() {
			return this.getHealth() > 0;
		}
	}

	class Cell extends Enemy {
		constructor(x, y, size, health) {
			super(x, y, size, size, health);
		}

		update(instant) {
			const movement = this.getWidth() * instant.elapsed() * 2 / 1000;
			if (isPortrait()) {
				this.offsetY(movement);
			} else {
				this.offsetX(-movement);
			}
		}

		render(instant) {
			const center = this.getBoundingBox().getCenter();
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'red';
			ctx.fillStyle = 'darkred';
			ctx.beginPath();
			ctx.arc(center[0], center[1], this.getWidth() / 2, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		}
	}

	class Hud extends Urge.RenderComponent {
		#tmp;

		constructor(tmp) {
			super();
			this.#tmp = tmp;
		}

		render(instant) {
			ctx.fillStyle = GREEN;
			ctx.font = FONT;
			ctx.fillText('FPS: ' + instant.fps().toFixed(3) + ', Total: ' + this.#tmp.getTotalMinutes() + ':' + this.#tmp.getSeconds() + ': ' + store.count(), 20, canvas.height - 20);
		}
	}

	// 13,312 Bytes Max Limit For Zipped File
	const DARK = '#111';
	const GREEN = '#0a0';
	const LIGHT = '#eee';
	const FONT = '2em Segoe UI';

	const canvas = Nucleus.$('canvas');
	//canvas.onclick = e => canvas.requestFullscreen();
	const ctx = canvas.getContext('2d');
	const store = new Urge.ComponentStore();

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
		const sf1 = new StarField({
			image: assets.starField1,
			scrollSeconds: 12
		});
		const sf2 = new StarField({
			image: assets.starField2,
			scrollSeconds: 11
		});
		const sf3 = new StarField({
			image: assets.starField3,
			scrollSeconds: 10
		});
		store.put(sf1, sf2, sf3);

		const size = getSize();
		const startX = isPortrait() ? (canvas.width - size) / 2 : size;
        const startY = isPortrait() ? canvas.height - (size * 2) : (canvas.height - size) / 2;
        const ship = new Ship(startX, startY, size, receive);
        store.put(ship);

		const timeLine = new TimeLine(receive);
		store.put(timeLine);

		const hud = new Hud(timeLine);
		store.put(hud);

		Nucleus.KeyInputHandler.start();

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
							const bullet = new PlayerBullet(x, y, width, height);
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
					const cell = new Cell(x, y, size, 100);
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
			getStarField(250),
			getStarField(200),
			getStarField(150)
		]);
		return {
			starField1, starField2, starField3
		};
	}

	function getStarField(count = 250) {
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
					const size = parseInt(Math.random() * 3) + 1;
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
					store.forEach((b, bulletId, bulletMap) => {
						if (b instanceof PlayerBullet) {
							if (b.getBoundingBox().intersects(c.getBoundingBox())) {
								bulletMap.delete(bulletId);

								c.reduceHealth(25);
								if (!c.isAlive()) {
									// TODO: enemy explosion/death effect?
									map.delete(id);
								}
							}
						}

						if (b instanceof Ship) {
							if (b.getBoundingBox().intersects(c.getBoundingBox())) {
								// TODO: this would be a GAME OVER scenario
								console.log('Ship Collided With Enemy:', b, c);
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
		store.renderByType(instant, StarField);
		store.renderByType(instant, Ship);
		store.renderByType(instant, PlayerBullet);
		store.renderByType(instant, Enemy);
		store.renderByType(instant, Hud);
	}

	return {
		start
	};
})();

Rogue.start();
