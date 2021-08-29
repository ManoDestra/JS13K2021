/*
const canvas = Nucleus.$('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
//canvas.onclick = e => canvas.requestFullscreen();

const context = canvas.getContext('2d');

const COLOR_FG = '#0a0';
const DARK = '#111';
const GREEN = '#0a0';
const LIGHT = '#eee';
const FONT = '4em Segoe UI';

Nucleus.KeyInputHandler.start();

const SpaceGame = (() => {
	const COUNT_STARS = 250;
	const COUNT_PLANETS = 5;
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

	class GameComponent {
		constructor() {
		}

		update(context, instant) {
		}
	}

	class DrawableGameComponent extends GameComponent {
		constructor() {
			super();
		}

		draw(instant) {
		}
	}

	class Screen extends DrawableGameComponent {
		constructor() {
			super();
		}

		init() {
		}

		term() {
		}
	}

	class StartScreen extends Screen {
		constructor() {
			super();
		}

		init() {
			console.log('Initializing Start Screen...')
		}
	}

	class MenuScreen extends Screen {
		constructor() {
			super();
		}

		init() {
			console.log('Initializing Menu Screen...')
		}
	}

	class SkillsScreen extends Screen {
		constructor() {
			super();
		}

		init() {
			console.log('Initializing Skills Screen...')
		}
	}

	class PlayingScreen extends Screen {
		constructor() {
			super();
		}

		init() {
			console.log('Initializing Playing Screen...')
		}
	}

	const startScreen = new StartScreen();
	const menuScreen = new MenuScreen();
	const skillsScreen = new SkillsScreen();
	const playingScreen = new PlayingScreen();
	const Screens = [startScreen, menuScreen, skillsScreen, playingScreen];

	const ScreenManager = (() => {
		let current = GameScreen.START;
		let context = null;

		function getScreenState() {
			return current;
		}

		function clearDisplay() {
			context.fillStyle = DARK;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		function init(context) {
			this.context = context;
		}

		function update(instant) {
		}

		function draw(instant) {
			clearDisplay();
		}

		return {
			getScreenState,
			init,
			update,
			draw
		};
	})();

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

	async function init() {

	}

	function onResize() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
	}

	function clearDisplay() {
		context.fillStyle = DARK;
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	function drawStars() {
		context.strokeStyle = GREEN;
		context.fillStyle = LIGHT;
		for (let i = 0; i < COUNT_STARS; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			const size = parseInt(Math.random() * 4) + 1;
			context.fillRect(x, y, size, size);
		}
	}

	function drawPlanets() {
		for (let i = 0; i < COUNT_PLANETS; i++) {
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

	function drawHud(instant) {
		context.fillStyle = GREEN;
		context.font = FONT;
		context.fillText('FPS: ' + instant.fps().toFixed(3), 20, canvas.height - 20);
	}

	function update(instant) {
	}

	function draw(instant) {
		clearDisplay();
		drawStars();
		drawPlanets();
		drawHud(instant);
	}

	function loop(instant) {
		ScreenManager.update(instant);
		ScreenManager.draw(instant);
		//update(instant);
		//draw(instant);
	}

	return {
		init,
		onResize,
		loop
	};
})();
*/

const Rogue = (async () => {
	class GameComponent {
		constructor() {
		}

		update(context, instant) {
		}

		debug(instant, message) {
			if (instant.frame % 60 == 0) {
				console.log(message);
			}
		}
	}

	class DrawableGameComponent extends GameComponent {
		constructor() {
			super();
		}

		draw(instant) {
		}
	}

	class StarFieldComponent extends DrawableGameComponent {
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

		draw(instant) {
			ctx.drawImage(this.image, this.x + this.offsetX, this.y + this.offsetY, canvas.width, canvas.height);
			if (isPortrait()) {
				ctx.drawImage(this.image, this.x + this.offsetX, this.y + this.offsetY - canvas.height, canvas.width, canvas.height);
			} else {
				ctx.drawImage(this.image, this.x + this.offsetX + canvas.width, this.y + this.offsetY, canvas.width, canvas.height);
			}
		}
	}

	class ShipComponent extends DrawableGameComponent {
		constructor() {
			super();
			this.x = 0;
			this.y = 0;
			this.size = (isPortrait() ? canvas.height : canvas.width) / 15;
		}

		update(instant) {
			this.size = (isPortrait() ? canvas.height : canvas.width) / 15;
			const delta = this.size * 4 * instant.elapsed() / 1000;
			super.debug(instant, delta);
			if (Nucleus.KeyInputHandler.checkKey('w', true)) {
				this.y -= delta;
			}

			if (Nucleus.KeyInputHandler.checkKey('s', true)) {
				this.y += delta;
			}

			if (Nucleus.KeyInputHandler.checkKey('a', true)) {
				this.x -= delta;
			}

			if (Nucleus.KeyInputHandler.checkKey('d', true)) {
				this.x += delta;
			}

			if (isPortrait()) {
				this.x = Math.min((canvas.width) - this.size, Math.max(0, this.x));
				this.y = Math.max((canvas.height * 0.6), Math.min(canvas.height - this.size, this.y));
			} else {
				this.x = Math.min((canvas.width * 0.4) - this.size, Math.max(0, this.x));
				this.y = Math.min(canvas.height - this.size, Math.max(0, this.y));
			}

			if (Nucleus.KeyInputHandler.checkKey(' ')) {
				// TODO: code fire button code, add bullet components for rendering
			}
		}

		draw(instant) {
			//ctx.fillStyle = 'cornflowerblue';
			//ctx.fillRect(this.x, this.y, this.size, this.size);
			ctx.fillStyle = 'darkgreen';
			ctx.beginPath();
			ctx.arc(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 2, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		}
	}

	const DARK = '#111';
	const GREEN = '#0a0';
	const LIGHT = '#eee';
	const FONT = '4em Segoe UI';
	const COUNT_STARS = 250;

	const canvas = Nucleus.$('canvas');
	const ctx = canvas.getContext('2d');
	let assets = await init();

	const components = [];
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
	components.push(new ShipComponent());

	async function init() {
		onResize();
		window.onresize = onResize;
		Nucleus.KeyInputHandler.start();
		const assets = await preRender();
		console.log('Generated Assets:', assets);
		//document.body.appendChild(assets.starField);
		return assets;
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
					const size = parseInt(Math.random() * 4) + 1;
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

	function updateAndDraw(instant) {
		update(instant);
		draw(instant);
	}

	function update(instant) {
		components.filter(c => c instanceof GameComponent).forEach(c => c.update(instant));
	}

	function draw(instant) {
		clear();
		components.filter(c => c instanceof DrawableGameComponent).forEach(c => c.draw(instant));
		drawHud(instant);
	}

	function drawHud(instant) {
		ctx.fillStyle = GREEN;
		ctx.font = FONT;
		ctx.fillText('FPS: ' + instant.fps().toFixed(3), 20, canvas.height - 20);
	}

	return {
		updateAndDraw
	};
})();

(async () => {
	//await SpaceGame.init();
	//window.onresize = SpaceGame.onResize;
	//SpaceGame.loop({
	//	fps: () => 60
	//});

	const r = await Rogue;
	Nucleus.Clock.start(r.updateAndDraw);
})();
