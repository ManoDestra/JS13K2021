class Background extends RenderNode {
	constructor(ctx) {
		super(ctx);
	}
}

class StartScreen extends RenderNode {
	constructor(ctx) {
		super(ctx);
		this.setActive(true);
		this.getRect().x = 0.25;
		this.getRect().y = 0.25;
		this.getRect().width = 0.5;
		this.getRect().height = 0.5;
		this.setOpacity(1);
	}

	renderNode() {
		const ctx = this.getContext();
		const { width, height } = ctx.canvas;
		ctx.fillStyle = 'darkred';
		ctx.fillRect(0, 0, width, height);
	}
}

class Game extends BaseGame {
	constructor(ctx, wCtx) {
		super(ctx, wCtx);
		// Activate screen, transition
	}

	init() {
		const c = this.buildCanvas().getContext('2d');
		const start = new StartScreen(c);
		const screens = [ start ];
		this.add(...screens);
	}

	term() {
	}
}
