class Background extends RenderNode {
	constructor(ctx) {
		super(ctx);
		this.setActive(true);
		this.setOpacity(1);
	}

	init() {
	}

	renderNode() {
		// TODO
	}
}

class StartScreen extends RenderNode {
	constructor(ctx) {
		super(ctx);
		this.setActive(true);
		const r = this.getRect();
		const o = {
			x: 0.25,
			y: 0.25,
			width: 0.5,
			height: 0.5
		};
		Object.assign(this.getRect(), o);
		this.setOpacity(1);
	}

	renderNode() {
		this.clearContext('darkred');
		//const ctx = this.getContext();
		//const { width, height } = ctx.canvas;
		//ctx.fillStyle = 'darkred';
		//ctx.fillRect(0, 0, width, height);
	}

	resizeNode(bounds) {
		super.resizeNode(bounds);
	}
}

class Quadrant extends RenderNode {
	#color;

	constructor(ctx, offX, offY) {
		super(ctx);
		const rect = this.getRect();
		rect.x = offX ? 0.5 : 0;
		rect.y = offY ? 0.5 : 0;
		rect.width = 0.5;
		rect.height = 0.5;
		this.setActive(true);
		this.setOpacity(1);

		const r = parseInt(Math.random() * 192);
		const g = parseInt(Math.random() * 128);
		const b = parseInt(Math.random() * 128);
		this.#color = `rgb(${r}, ${g}, ${b})`;
	}

	renderNode() {
		this.clearContext(this.#color);
	}
}

class QuadrantContainer extends RenderNode {
	constructor(ctx, offX, offY) {
		super(ctx);
		const rect = this.getRect();
		rect.x = offX ? 0.5 : 0;
		rect.y = offY ? 0.5 : 0;
		rect.width = 0.5;
		rect.height = 0.5;
		this.setActive(true);
		this.setOpacity(1);

		const pixels = 64;
		const topLeft = new Quadrant(BaseGame.buildOnscreenCanvas(pixels, pixels).getContext('2d'), false, false);
		const topRight = new Quadrant(BaseGame.buildOnscreenCanvas(pixels, pixels).getContext('2d'), true, false);
		const bottomLeft = new Quadrant(BaseGame.buildOnscreenCanvas(pixels, pixels).getContext('2d'), false, true);
		const bottomRight = new Quadrant(BaseGame.buildOnscreenCanvas(pixels, pixels).getContext('2d'), true, true);
		this.add(topLeft, topRight, bottomLeft, bottomRight);
	}
}

class Game extends BaseGame {
	init() {
		/*
		const c = this.buildCanvas().getContext('2d');
		const start = new StartScreen(c);
		const screens = [ start ];
		this.add(...screens);
		*/

		const pixels = 64;
		this.add(
			new QuadrantContainer(this.buildCanvas(pixels, pixels).getContext('2d'), false, false),
			new QuadrantContainer(this.buildCanvas(pixels, pixels).getContext('2d'), true, false),
			new QuadrantContainer(this.buildCanvas(pixels, pixels).getContext('2d'), false, true),
			new QuadrantContainer(this.buildCanvas(pixels, pixels).getContext('2d'), true, true)
		);
	}

	term() {
	}
}
