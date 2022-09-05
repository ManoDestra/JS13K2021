class Background extends RenderNode {
	constructor(ctx) {
		super(ctx);
		this.setActive(true);
		this.setOpacity(1);
	}

	init() {
	}

	renderNode() {
	}
}

class StartScreen extends RenderNode {
	constructor(ctx) {
		super(ctx);
		this.setActive(true);
		//Object.assign(this.getRect(), {
		//	x: 0.25,
		//	y: 0.25,
		//	width: 0.5,
		//	height: 0.5
		//});
		this.setOpacity(1);
	}

	renderNode() {
		//const ctx = this.getContext();
		//const { width, height } = ctx.canvas;
		//ctx.fillStyle = 'darkred';
		//ctx.fillRect(0, 0, width, height);
	}
}

class Game extends BaseGame {
	init() {
		const c = this.buildCanvas().getContext('2d');
		const start = new StartScreen(c);
		const screens = [ start ];
		this.add(...screens);
	}

	term() {
	}
}
