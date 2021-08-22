const canvas = Nucleus.$('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const context = canvas.getContext('2d');
console.log('Context:', context);

//canvas.onclick = e => canvas.requestFullscreen();
Nucleus.Clock.start(instant => {
	context.fillStyle = 'cornflowerblue';
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);
});
