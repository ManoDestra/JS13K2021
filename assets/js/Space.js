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

const COLOR_BG = '#111';
const COLOR_FG = '#0a0';
const FONT = '1.2em Segoe UI';

Nucleus.KeyInputHandler.start();

Nucleus.Clock.start(instant => {
	context.fillStyle = COLOR_BG;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = COLOR_FG;
	context.font = FONT;
	//const fps = parseInt(1000 / instant.elapsed);
	context.fillText('FPS: ' + instant.fps().toFixed(3), 50, 50);
});
