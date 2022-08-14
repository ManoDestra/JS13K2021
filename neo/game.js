class Screen extends RenderNode {
	constructor(game) {
		super(game);
		this.setConfig({
			x: Math.random(),
			y: Math.random(),
			w: 0.01,
			h: 0.05,
			o: 0.8
		});
	}

	render() {
		const ctx = this.getContext();
		const r = this.#randomColor();
		const g = this.#randomColor();
		const b = this.#randomColor();
		const a = this.#randomColor();
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillRect(0, 0, 256, 256);
	}

	#randomColor() {
		return parseInt(Math.random() * 256);
	}
}

class Game extends BaseGame {
	constructor(ctx, os) {
		super(ctx, os);
		// TODO: these are available inside Worker, so use them
		const p = new DOMPoint();
		const r = new DOMRect();
		console.log(p, r);

		const count = 80;
		const arr = new Array(count).fill(0);
		arr.forEach((e, i, a) => {
			const s = new Screen(this);
			this.register(s);
		});
	}
}
