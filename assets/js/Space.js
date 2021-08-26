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

	class GameComponent {
		constructor() {
		}

		update(instant) {
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

	class PlayingScreen extends Screen {
		constructor() {
			super();
		}

		init() {
			console.log('Initializing Playing Screen...')
		}
	}

	const ScreenState = {
		START: 0,
		PLAYING: 1
	};

	const Screens = [new StartScreen(), new PlayingScreen()];
	console.log(Screens);
	Screens[ScreenState.START].init();
	Screens[ScreenState.PLAYING].init();

	Object.freeze(ScreenState);
	console.log(ScreenState);

	const ScreenManager = (() => {
		let current = ScreenState.START;

		function getScreenState() {
			return current;
		}

		return {
			getScreenState
		};
	})();
	console.log(ScreenManager);
	console.log("Manager: Screen State: " + ScreenManager.getScreenState());

	const GameState = {
		START: 0,
		INTRO: 1,
		PLAYING: 2,
		PAUSED: 3,
		DEATH: 4,
		GAME_OVER: 5
	};
	Object.freeze(GameState);
	console.log(GameState);

	const SpaceState = {
		state: GameState.START,
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
	console.log(SpaceState);

	async function init() {
		const moon = new Image();
		moon.src = 'assets/images/Moon01.jpg';
		await moon.decode();
		this.patternMoon = context.createPattern(moon, 'repeat');
		console.log('Moon Pattern:', this.patternMoon);
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
		update(instant);
		draw(instant);
	}

	return {
		init,
		onResize,
		loop
	};
})();

(async () => {
	await SpaceGame.init();
	window.onresize = SpaceGame.onResize;
	SpaceGame.loop({
		fps: () => 60
	});
	//Nucleus.Clock.start(SpaceGame.loop);
})();
