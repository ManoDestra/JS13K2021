class Hud extends Urge.RenderComponent {
	#health = 0;
	#score = 0;
	#remainingMiles = 0;

	constructor(context) {
		super(context);
	}

	setHealth(health) {
		this.#health = health;
	}

	setScore(score) {
		this.#score = score;
	}

	setRemainingMiles(remainingMiles) {
		this.#remainingMiles = remainingMiles;
	}

	render(instant) {
		const GREEN = '#0a0';
		const FONT = '2em sans-serif';
		const ctx = super.getContext();
		const canvas = super.getCanvas();
		ctx.fillStyle = GREEN;
		ctx.font = FONT;
		const fps = parseInt(instant.fps());
		const h = this.#health;
		const sc = this.#score;
		const m = parseInt(this.#remainingMiles);
		const display = `FPS: ${fps}, Health: ${h}, Score: ${sc}, Remaining Miles: ${m}`;
		ctx.fillText(display, 20, canvas.height - 20);
	}
}
