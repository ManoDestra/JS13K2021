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
	let patternMoon = null;

	async function init() {
		const moon = new Image();
		moon.src = 'assets/images/Moon01.jpg';
		await moon.decode();
		this.patternMoon = context.createPattern(moon, 'repeat');
		console.log(this.patternMoon);
	}

	function onResize() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
	}

	function drawStars() {
		context.strokeStyle = GREEN;
		context.fillStyle = LIGHT;
		for (let i = 0; i < COUNT_STARS; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			const size = parseInt(Math.random() * 3) + 1;
			context.fillRect(x, y, size, size);
		}
	}

	function drawPlanets() {
		for (let i = 0; i < COUNT_PLANETS; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			const r = parseInt(Math.random() * 30) + 20;
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

	function loop(instant) {
		context.fillStyle = DARK;
		context.fillRect(0, 0, canvas.width, canvas.height);

		drawStars();
		drawPlanets();

		context.fillStyle = GREEN;
		context.font = FONT;
		//context.fillText('Frame: ' + instant.frame, 50, 50);
		//context.fillText('Random: ' + Math.random(), 50, 100);
		context.fillText('FPS: ' + instant.fps().toFixed(3), 20, canvas.height - 20);
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
