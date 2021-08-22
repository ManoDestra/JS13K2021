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
	const COUNT_PLANETS = 10;

	let GRADIENT_LIGHT = context.createLinearGradient(0, 0, 0, canvas.height);
	GRADIENT_LIGHT.addColorStop(0, 'darkred');
	GRADIENT_LIGHT.addColorStop(0.5, GREEN);
	GRADIENT_LIGHT.addColorStop(1, 'darkred');

	function onResize() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
	}

	function randomStars() {
		context.strokeStyle = GREEN;
		context.fillStyle = LIGHT;
		for (let i = 0; i < COUNT_STARS; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			context.fillRect(x, y, 3, 3);
		}
	}

	function randomPlanets() {
		for (let i = 0; i < COUNT_PLANETS; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			const r = parseInt(Math.random() * 30) + 20;
			const g = context.createLinearGradient(x + r, y, x + r, y + (r * 1));
			g.addColorStop(0, 'darkred');
			g.addColorStop(0.5, GREEN);
			g.addColorStop(1, 'darkred');
			context.fillStyle = g;

			context.beginPath();
			context.arc(x, y, r, 0, Math.PI * 2);
			context.fill();
			context.closePath();
		}
	}

	function loop(instant) {
		context.fillStyle = DARK;
		context.fillRect(0, 0, canvas.width, canvas.height);

		randomStars();
		randomPlanets();

		context.fillStyle = GREEN;
		context.font = FONT;
		//context.fillText('Frame: ' + instant.frame, 50, 50);
		//context.fillText('Random: ' + Math.random(), 50, 100);
		context.fillText('FPS: ' + instant.fps().toFixed(3), 20, canvas.height - 20);
	}

	return {
		onResize,
		loop
	};
})();

window.onresize = SpaceGame.onResize;
Nucleus.Clock.start(SpaceGame.loop);
