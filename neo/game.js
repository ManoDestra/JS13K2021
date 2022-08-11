class Screen extends RenderNode {
	constructor(os) {
		super(os);
	}
}

class Game extends BaseGame {
	constructor(ctx, os) {
		super(ctx, os);
		// TODO: add test node
		const screen = new Screen(this.isOffscreen());
		console.log('Screen:', screen);
		console.log('Canvas:', screen.getCanvas());
	}
}
