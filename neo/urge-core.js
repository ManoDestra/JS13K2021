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
	#s = [];

	constructor(s) {
		this.#s = s;
	}

	raw() {
		return structuredClone(this.#s);
	}

	isShift() {
		return this.#s?.[16]?.[0];
	}

	isCtrl() {
		return this.#s?.[17]?.[0];
	}

	isAlt() {
		return this.#s?.[18]?.[0];
	}

	isLeft() {
		return this.#s?.[65]?.[0] || this.#s?.[37]?.[0];
	}

	isRight() {
		return this.#s?.[68]?.[0] || this.#s?.[39]?.[0];
	}

	isUp() {
		return this.#s?.[87]?.[0] || this.#s?.[38]?.[0];
	}

	isDown() {
		return this.#s?.[83]?.[0] || this.#s?.[40]?.[0];
	}

	isFire() {
		return (this.#s?.[32]?.[0] && !this.#s?.[32]?.[1])
			|| (this.#s?.[13]?.[0] && !this.#s?.[13]?.[1]);
	}
}

class Pulse {
	#ctx;
	#sKey = [];
	#pKey = [];

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

	setKeyState(s) {
		this.#sKey = s;
	}

	setPadState(s) {
		this.#pKey = s;
	}

	start() {
		this.#fire();
	}

	#resetState() {
		this.#sKey.forEach(e => {
			e[1] = e[0];
		});
		// TODO: reset pad state
	}

	#loop(tick) {
		GameTime.update(tick);
		this.#update();
		this.#render();
		this.#resetState();
		this.#fire();
	}

	#fire() {
		requestAnimationFrame(t => this.#loop(t));
	}

	#update() {
	}

	#render() {
		// TODO: move to #update()
		const reader = new KeyReader(this.#sKey);

		this.#ctx.fillStyle = '#111';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

		const x = this.#ctx.canvas.width / 3;
		const y = this.#ctx.canvas.height / 3;

		this.#ctx.fillStyle = 'darkred';
		const { state } = this.#sKey;

		if (reader.isFire()) {
			console.log('Fire', performance.now(), reader.raw());
		}

		const dx = (reader.isLeft() ? -x : 0) + (reader.isRight() ? x : 0);
		const dy = (reader.isUp() ? -y : 0) + (reader.isDown() ? y : 0);
		this.#ctx.fillRect(x + dx, y + dy, x, y);

		if (this.#ctx.fillText) {
			this.#ctx.fillStyle = 'cornflowerblue';
			this.#ctx.font = 'bold 48px Segoe UI';
			const fps = `FPS: ${parseInt(GameTime.fps())}`;
			const tick = `Tick: ${parseInt(GameTime.current() / 1000)}`;
			const b = this.#ctx.measureText(fps);
			this.#ctx.fillText(fps, 100, 100);
			this.#ctx.fillText(tick, 100, 200);
		}
	}
}
