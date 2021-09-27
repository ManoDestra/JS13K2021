class StartScreen extends Layer {
	constructor(dimensions) {
		super(dimensions, { x: 0, y: 0, w: 0.5, h: 1 });
	}

	render(instant) {
		const { width, height } = this.renderTarget;
		const deltaWidth = width / 10;
		const deltaHeight = height / 10;
		this.renderContext.fillStyle = 'darkred';
		this.renderContext.fillRect(deltaWidth, deltaHeight, deltaWidth * 8, deltaHeight * 8);
		this.renderContext.strokeStyle = 'white';
		this.renderContext.strokeRect(0, 0, width, height);
	}
}

class IntroScreen extends Layer {
	constructor(dimensions) {
		super(dimensions, { x: 0.5, y: 0, w: 0.5, h: 1 });
	}

	render(instant) {
		const { width, height } = this.renderTarget;
		const deltaWidth = width / 10;
		const deltaHeight = height / 10;
		this.renderContext.fillStyle = 'darkblue';
		this.renderContext.fillRect(deltaWidth, deltaHeight, deltaWidth * 8, deltaHeight * 8);
		this.renderContext.strokeStyle = 'yellow';
		this.renderContext.strokeRect(0, 0, width, height);
	}
}

class Monoculture extends Game {
	#transform = null;

	constructor() {
		super();
	}

	loadAssets() {
		const canvas = this.getCanvas();
		const { width, height } = canvas;
		const dimensions = { width, height };
		const start = new StartScreen(dimensions);
		const intro = new IntroScreen(dimensions);
		this.addLayers(start, intro);
		this.advanceLayers(start, intro);
	}

	/*
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
		ctx.textBaseline = 'middle';
		//ctx.font = '48px Segoe UI';
		ctx.font = '8em Segoe UI';
		const text = 'FPS: ' + Math.floor(instant.fps() * 1000) / 1000;

		const measure = ctx.measureText(text);
		//this.debug(instant, measure);

		ctx.save();
		ctx.lineWidth = 1.5;
		ctx.fillStyle = 'white';
		ctx.shadowOffsetX = 15;
		ctx.shadowOffsetY = 15;
		ctx.shadowColor = '#666';
		ctx.shadowBlur = 3;
		ctx.fillText(text, canvas.width / 2, canvas.height / 2);
		ctx.restore();

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'cornflowerblue';
		ctx.strokeRect(
			(canvas.width - measure.width) / 2,
			(canvas.height / 2) - measure.actualBoundingBoxAscent,
			measure.width,
			measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
		);

		ctx.restore();
	}
	*/
}

window.addEventListener('load', async () => {
	const game = new Monoculture();
	await game.start();

	//console.log(DOMPoint);
	//console.log(DOMRect);
	//console.log(DOMQuad);
	//console.log(DOMMatrix);

	/*
	const point = new DOMPoint(3, 4, 5);
	console.log(point);
	console.log(point.toJSON());

	const matrix = new DOMMatrix([
		2, 0, 0, 0,
		0, 2, 0, 0,
		0, 0, 2, 0,
		0, 0, 0, 1
	]);
	console.log(matrix);
	console.log(matrix.toFloat32Array());
	console.log(matrix.toFloat64Array());

	const transformed = point.matrixTransform(matrix);
	console.log(transformed);
	*/
});
