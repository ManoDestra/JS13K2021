/*
const Test = (() => {
	function foobar(clazz) {
		if (clazz.prototype instanceof Pure.Component) {
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
*/

/*
const canvas = Nucleus.$('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
//canvas.onclick = e => canvas.requestFullscreen();

const context = canvas.getContext('2d');

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
	class BoundingBox {
		#x;
		#y;
		#width;
		#height;

		constructor(x, y, width, height) {
			this.#x = x;
			this.#y = y;
			this.#width = width;
			this.#height = height;
		}

		getX() {
			return this.#x;
		}

		getY() {
			return this.#y;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
		}
	}

	class StarFieldComponent extends Pure.RenderComponent {
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

	class SpriteComponent extends Pure.RenderComponent {
		#x = 0;
		#y = 0;
		#width = 0;
		#height = 0;

		constructor(x, y, width, height) {
			super();
			this.#x = x;
			this.#y = y;
			this.#width = width;
			this.#height = height;
		}

		getX() {
			return this.#x;
		}

		setX(x) {
			this.#x = x;
		}

		offsetX(delta) {
			this.#x += delta;
		}

		getY() {
			return this.#y;
		}

		setY(y) {
			this.#y = y;
		}

		offsetY(delta) {
			this.#y += delta;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
		}

		getBoundingBox() {
			return new BoundingBox(this.#x, this.#y, this.#width, this.#height);
		}
	}

	class ShipComponent extends SpriteComponent {
		#send = null;

		constructor(send) {
			super(0, 0, (isPortrait() ? canvas.height : canvas.width) / 15, (isPortrait() ? canvas.height : canvas.width) / 15);
			this.#send = send;
		}

		update(instant) {
			this.size = (isPortrait() ? canvas.height : canvas.width) / 15;
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
			ctx.fillStyle = 'darkred';
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

	class PlayerBulletComponent extends SpriteComponent {
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

	class EnemyComponent extends Pure.RenderComponent {
		constructor() {
			super();
		}

		update(instant) {
		}

		render(instant) {
		}
	}

	class HudComponent extends Pure.RenderComponent {
		constructor() {
			super();
		}

		render(instant) {
			ctx.fillStyle = GREEN;
			ctx.font = FONT;
			ctx.fillText('FPS: ' + instant.fps().toFixed(3) + ', Comps: ' + components.length, 20, canvas.height - 20);
		}
	}

	const DARK = '#111';
	const GREEN = '#0a0';
	const LIGHT = '#eee';
	const FONT = '4em Segoe UI';
	const COUNT_STARS = 250;

	const canvas = Nucleus.$('canvas');
	const ctx = canvas.getContext('2d');
	const components = [];

	function start() {
		console.log('Start');
		init()
			.then(r => Nucleus.Clock.start(updateAndRender))
			.catch(e => console.error(e))
			.finally(() => console.log('Started'));
	}

	async function init() {
		onResize();
		window.onresize = onResize;
		Nucleus.KeyInputHandler.start();
		const assets = await preRender();
		components.push(new StarFieldComponent({
			image: assets.starField1,
			scrollSeconds: 12
		}));
		components.push(new StarFieldComponent({
			image: assets.starField2,
			scrollSeconds: 11
		}));
		components.push(new StarFieldComponent({
			image: assets.starField3,
			scrollSeconds: 10
		}));
		components.push(new ShipComponent(receive));
		components.push(new HudComponent());

		return assets;
	}

	function receive(message) {
		switch (message) {
			case 'PLAYER_BULLET':
				const player = components.filter(c => c instanceof ShipComponent)[0];
				const box = player.getBoundingBox();
				const x = box.getX() + (isPortrait() ? box.getWidth() / 2 : box.getWidth());
				const y = box.getY() + (isPortrait() ? 0 : box.getHeight() / 2);
				const width = isPortrait() ? 5 : 20;
				const height = isPortrait() ? 20 : 5;
				components.push(new PlayerBulletComponent(x, y, width, height));
				break;
			default:
		}
	}

	function isPortrait() {
		return canvas.width < canvas.height;
	}

	async function preRender() {
		const [starField1, starField2, starField3] = await Promise.all([
			getStarField(),
			getStarField(),
			getStarField()
		]);
		return {
			starField1, starField2, starField3
		};
	}

	function getStarField() {
		return generateImage({
			width: canvas.width,
			height: canvas.height,
			consumer: c => {
				c.strokeStyle = GREEN;
				//c.fillStyle = LIGHT;
				c.fillStyle = 'cornflowerblue';
				for (let i = 0; i < COUNT_STARS; i++) {
					const r = parseInt(Math.random() * 256);
					const g = parseInt(Math.random() * 256);
					const b = parseInt(Math.random() * 128) + 128;
					c.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
					const x = parseInt(Math.random() * canvas.width);
					const y = parseInt(Math.random() * canvas.height);
					const size = parseInt(Math.random() * 3) + 1;
					c.fillRect(x, y, size, size);
				}

				//x.fillRect(8, 8, 48, 48);

				/*
				x.beginPath();
				x.arc(128, 128, 56, 0, Math.PI * 2);
				x.fill();
				x.closePath();
				*/
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
		// TODO: process bullet collisions with enemies
		// TODO: remove any components that are no longer required
		//		- bullets off screen
		//		- bullets that have collided with enemies
		//		- enemies that have been killed

		components.filter(c => c instanceof Pure.Component).forEach(c => c.update(instant));

		for (let i = components.length - 1; i >= 0; i--) {
			const c = components[i];
			if (c instanceof PlayerBulletComponent) {
				const box = c.getBoundingBox();
				const portraitRemoval = isPortrait() && box.getY() + box.getHeight() < 0;
				const nonPortraitRemoval = !isPortrait() && box.getX() > canvas.width;
				if (portraitRemoval || nonPortraitRemoval) {
					components.splice(i, 1);
				}
			}
		}
	}

	function render(instant) {
		clear();
		components.filter(c => c instanceof Pure.RenderComponent).forEach(c => c.render(instant));
	}

	return {
		start
	};
})();

Rogue.start();
