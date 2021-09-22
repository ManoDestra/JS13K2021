class Monoculture extends Game {
	#transform = null;

	constructor() {
		super();
	}

	update(instant) {
		//this.debug(instant, 'Elapsed:', instant.elapsed(), instant.fps());
	}

	render(instant) {
		const canvas = this.getCanvas();
		const ctx = this.getContext();

		// TODO: this call could be automatic
		this.clearCanvas(canvas, ctx);

		const widthUnit = canvas.width / 10;
		const heightUnit = canvas.height / 10;
		const width = widthUnit * 8;
		const height = heightUnit * 8;

		ctx.save();

		//ctx.lineWidth = 0.02;
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'white';
		ctx.fillStyle = '#222';

		//ctx.translate(20, 30);
		//ctx.scale(canvas.width, canvas.height);

		//ctx.strokeRect(0.1, 0.1, 0.8, 0.8);
		//ctx.fillRect(0.1, 0.1, 0.8, 0.8);

		//ctx.globalAlpha = 0.7;
		ctx.strokeRect(widthUnit, heightUnit, width, height);
		ctx.fillRect(widthUnit, heightUnit, width, height);

		ctx.textAlign = 'center';
		ctx.font = '48px Segoe UI';
		ctx.lineWidth = 1.5;
		ctx.fillStyle = 'white';
		ctx.fillText('FPS: ' + Math.floor(instant.fps() * 1000) / 1000, canvas.width / 2, canvas.height / 2);

		ctx.restore();
	}
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.init();
	game.start();

	//console.log(DOMPoint);
	//console.log(DOMRect);
	//console.log(DOMQuad);
	//console.log(DOMMatrix);

	const point = new DOMPoint(3, 4, 5);
	console.log(point);
	console.log(point.toJSON());
	console.log(JSON.stringify(point.toJSON()));

	const matrix = new DOMMatrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1]);
	console.log(matrix);
	console.log(matrix.toFloat32Array());
	console.log(matrix.toFloat64Array());

	const transformed = point.matrixTransform(matrix);
	console.log(transformed);
	console.log(point);

	const box1 = new Box(55, 55, 45, 45);
	const box2 = new Box(100, 100, 50, 50);
	console.log(box1);
	console.log(box2);
	console.log(box1.intersects(box2));
	console.log(box2.intersects(box1));
});
