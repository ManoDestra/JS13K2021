class Screen extends RenderNode {
	constructor(game) {
		super(game);
	}

	render() {
		const ctx = this.getContext();
		const r = this.#randomColor();
		const g = this.#randomColor();
		const b = this.#randomColor();
		const a = this.#randomColor();
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillRect(0, 0, 256, 256);
		ctx.fillStyle = 'black';
		ctx.font = '24px Arial';
		if (ctx.fillText) {
			ctx.fillText(`FPS: ${parseInt(GameTime.fps())}`, 20, 50);
		}
	}

	#randomColor() {
		return parseInt(Math.random() * 256);
	}
}

class Game extends BaseGame {
	constructor(ctx, os) {
		super(ctx, os);
		const screen1 = new Screen(this);
		screen1.setConfig({
			x: 0,
			y: 0,
			w: 0.5,
			h: 0.5,
			o: 0.7
		});

		const screen2 = new Screen(this);
		screen2.setConfig({
			x: 0.5,
			y: 0,
			w: 0.5,
			h: 0.5,
			o: 0.7
		});

		const screen3 = new Screen(this);
		screen3.setConfig({
			x: 0,
			y: 0.5,
			w: 0.5,
			h: 0.5,
			o: 0.7
		});

		const screen4 = new Screen(this);
		screen4.setConfig({
			x: 0.5,
			y: 0.5,
			w: 0.5,
			h: 0.5,
			o: 0.7
		});
		this.register(screen1, screen2, screen3, screen4);
	}
}
