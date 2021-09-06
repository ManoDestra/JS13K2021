class Hud extends Urge.RenderComponent {
	#tmp;

	constructor(context, tmp) {
		super(context);
		this.#tmp = tmp;
	}

	render(instant) {
		const GREEN = '#0a0';
		const FONT = '2em Segoe UI';
		const ctx = super.getContext();
		const canvas = super.getCanvas();
		ctx.fillStyle = GREEN;
		ctx.font = FONT;
		ctx.fillText('FPS: ' + parseInt(instant.fps()) + ', Total: ' + this.#tmp.getTotalMinutes() + ':' + this.#tmp.getSeconds(), 20, canvas.height - 20);
	}
}
