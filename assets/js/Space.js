const canvas = Nucleus.$('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
//canvas.onclick = e => canvas.requestFullscreen();

function handleResize(e) {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}

window.onresize = e => handleResize();

const context = canvas.getContext('2d');

const COLOR_FG = '#0a0';
const DARK = '#111';
const GREEN = '#0a0';
const LIGHT = '#eee';
const FONT = '4em Segoe UI';

Nucleus.KeyInputHandler.start();

const SpaceGame = (() => {
	const COUNT = 250;

	function randomStars() {
		for (let i = 0; i < COUNT; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			context.fillStyle = LIGHT;
			context.fillRect(x, y, 2, 2);
		}
	}

	function loop(instant) {
		context.fillStyle = DARK;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = GREEN;
		context.font = FONT;
		//context.fillText('Frame: ' + instant.frame, 50, 50);
		context.fillText('FPS: ' + instant.fps().toFixed(3), 20, 100);
		//context.fillText('Random: ' + Math.random(), 50, 100);

		randomStars();
	}

	return {
		randomStars,
		loop
	};
})();

Nucleus.Clock.start(SpaceGame.loop);
