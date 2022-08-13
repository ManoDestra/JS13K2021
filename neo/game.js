class Screen extends RenderNode {
	constructor(os) {
		super(os);
	}

	render() {
		const ctx = this.getContext();
		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, 256, 256);
	}
}

class Game extends BaseGame {
	constructor(ctx, os) {
		super(ctx, os);
		const screen = new Screen(this.isOffscreen());
		screen.setConfig({
			x: 0.25,
			y: 0.25,
			w: 0.5,
			h: 0.5,
			o: 1
		});
		this.register(screen);
	}
}
