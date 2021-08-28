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
	const DARK = '#111';
	const GREEN = '#0a0';
	const LIGHT = '#eee';
	const FONT = '4em Segoe UI';

	const canvas = Nucleus.$('canvas');
	const ctx = canvas.getContext('2d');
	await init();

	async function init() {
		onResize();
		window.onresize = onResize;
		const images = await preRender();
		console.log('Generated Images:', images);
	}

	async function preRender() {
		const i = await generateImage({
			consumer: x => {
				x.fillStyle = 'cornflowerblue';
				//x.fillRect(8, 8, 48, 48);
				x.beginPath();
				x.arc(128, 128, 56, 0, Math.PI * 2);
				x.fill();
				x.closePath();
			}
		});
		return [i];
	}

	async function generateImage(options) {
		const f = options?.consumer;
		const w = options?.width ?? 256;
		const h = options?.height ?? 256;
		const t = options?.type ?? 'image/png';
		const q = options?.quality ?? 1;

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
		if (instant.frame == 5) {
			// DEBUG
		}

		update(instant);
		draw(instant);
	}

	function update(instant) {
	}

	function draw(instant) {
		clear();
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
