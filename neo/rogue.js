class Background extends RenderNode {
	constructor(ctx) {
		super('BG', ctx);
		this.setActive(true);
		this.setOpacity(1);
	}

	init() {
	}

	renderNode() {
		// TODO
	}
}

class Screen extends RenderNode {
	constructor(tag, ctx) {
		super(tag, ctx);
		//this.setOpacity(1);
		//this.setActive(true);
	}

	renderNode() {
		this.clearContext('indigo');
	}
}

class StartScreen extends Screen {
	constructor(ctx) {
		super('START', ctx);
	}
}

class Game extends BaseGame {
	init() {
		const ctx = this.buildCanvas().getContext('2d');
		const start = new StartScreen(ctx);
		const screens = [ start ];
		this.add(...screens);
	}
}
