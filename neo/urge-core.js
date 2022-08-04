class GameTime {
	static #c = 0;
	static #p = 0;

	static current() {
		return GameTime.#c;
	}

	static previous() {
		return GameTime.#p;
	}

	static elapsed() {
		return GameTime.current() - GameTime.previous();
	}

	static fps() {
		const elapsed = GameTime.elapsed();
		return elapsed == 0 ? 0 : (1000 / elapsed);
	}

	static update(t) {
		GameTime.#p = GameTime.#c;
		GameTime.#c = t;
	}
}

class KeyReader {
	#state = [];

	constructor(state) {
		this.#state = state;
	}

	raw() {
		return structuredClone(this.#state);
	}

	isShift() {
		return this.#state?.[16]?.[0];
	}

	isCtrl() {
		return this.#state?.[17]?.[0];
	}

	isAlt() {
		return this.#state?.[18]?.[0];
	}

	isLeft() {
		return this.#state?.[65]?.[0] || this.#state?.[37]?.[0];
	}

	isRight() {
		return this.#state?.[68]?.[0] || this.#state?.[39]?.[0];
	}

	isUp() {
		return this.#state?.[87]?.[0] || this.#state?.[38]?.[0];
	}

	isDown() {
		return this.#state?.[83]?.[0] || this.#state?.[40]?.[0];
	}

	isFire() {
		return (this.#state?.[32]?.[0] && !this.#state?.[32]?.[1])
			|| (this.#state?.[13]?.[0] && !this.#state?.[13]?.[1]);
	}
}

class Pulse {
	#ctx;
	#keyState = [];

	constructor(ctx) {
		this.#ctx = ctx;
	}

	resize(bounds) {
		Object.assign(this.#ctx.canvas, bounds);
	}

	#bounds() {
		const { width, height } = this.#ctx.canvas;
		return { width, height };
	}

	setKeyState(payload) {
		this.#keyState = payload;
	}

	setPadState(payload) {
		//console.log(payload);
	}

	start() {
		this.#fire();
	}

	#resetKeyState() {
		this.#keyState.forEach(e => {
			e[1] = e[0];
		});
	}

	#loop(tick) {
		GameTime.update(tick);
		this.#update();
		this.#render();
		this.#fire();
	}

	#fire() {
		requestAnimationFrame(t => this.#loop(t));
	}

	#update() {
	}

	#render() {
		this.#ctx.fillStyle = '#111';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

		const x = this.#ctx.canvas.width / 3;
		const y = this.#ctx.canvas.height / 3;

		this.#ctx.fillStyle = 'darkred';
		const { state } = this.#keyState;

		const reader = new KeyReader(this.#keyState);
		if (reader.isFire()) {
			// TODO: fix this, as input state needs to update with the pulse clock, not based on what comes in
			// the clock is faster than the event updates
			//console.log('Fire', performance.now(), reader.raw());
		}

		const dX = reader.isLeft() ? -x : (reader.isRight() ? x : 0);
		const dY = reader.isUp() ? -y : (reader.isDown() ? y : 0);
		this.#ctx.fillRect(x + dX, y + dY, x, y);

		if (this.#ctx.fillText) {
			this.#ctx.fillStyle = 'cornflowerblue';
			this.#ctx.font = 'bold 48px Segoe UI';
			const fps = `FPS: ${parseInt(GameTime.fps())}`;
			const tick = `Tick: ${parseInt(GameTime.current() / 1000)}`;
			const b = this.#ctx.measureText(fps);
			this.#ctx.fillText(fps, 100, 100);
			this.#ctx.fillText(tick, 100, 200);
		}

		this.#resetKeyState();
	}
}
