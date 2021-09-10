class Hud extends Urge.RenderComponent {
	#t;

	constructor(context, t) {
		super(context);
		this.#t = t;
	}

	render(instant) {
		const GREEN = '#0a0';
		const FONT = '2em sans-serif';
		const ctx = super.getContext();
		const canvas = super.getCanvas();
		ctx.fillStyle = GREEN;
		ctx.font = FONT;
		const fps = parseInt(instant.fps());
		const m = this.#t.getTotalMinutes();
		const s = this.#t.getSeconds();
		const display = `FPS: ${fps}, Total: ${m}:${s}`;
		ctx.fillText(display, 20, canvas.height - 20);
	}
}
