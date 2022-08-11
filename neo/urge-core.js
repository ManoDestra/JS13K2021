class Watch {
	#c;
	#p;

	constructor(c) {
		this.#p = c;
		this.#c = c;
	}

	current() {
		return this.#c;
	}

	previous() {
		return this.#p;
	}

	set(c) {
		this.#p = this.#c;
		this.#c = c;
	}
}

class GameTime {
	static #s = new Watch(0);

	static current() {
		return GameTime.#s.current();
	}

	static previous() {
		return GameTime.#s.previous();
	}

	static elapsed() {
		return GameTime.current() - GameTime.previous();
	}

	static fps() {
		const elapsed = GameTime.elapsed();
		return elapsed == 0 ? 0 : (1000 / elapsed);
	}

	static update(t) {
		GameTime.#s.set(t);
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

class UpdateNode {
	#a = false;

	constructor() {
		// TODO: code
	}

	isActive() {
		return this.#a;
	}

	setActive(a) {
		this.#a = a;
	}

	update() {
		// TODO: code
	}
}

class RenderNode extends UpdateNode {
	#os;
	#ctx = null;
	#x = 0;
	#y = 0;
	#w = 1;
	#h = 1;
	#o = 1;

	constructor(os) {
		super();
		this.#os = os;
		const c = os ? this.buildOffscreenCanvas() : this.buildCanvas();
		this.#ctx = c.getContext('2d');
	}

	buildOffscreenCanvas() {
		return new OffscreenCanvas(256, 256);
	}

	buildCanvas() {
		if (!document) {
			return null;
		}

		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		return canvas;
	}

	isOffscreen() {
		return this.#os;
	}

	getCanvas() {
		return this.#ctx.canvas;
	}

	getX() {
		return this.#x;
	}

	setX(x) {
		this.#x = x;
	}

	getY() {
		return this.#y;
	}

	setY(y) {
		this.#y = y;
	}

	getWidth() {
		return this.#w;
	}

	setWidth(w) {
		this.#w = w;
	}

	getHeight() {
		return this.#h;
	}

	setHeight(h) {
		this.#h = h;
	}

	getOpacity() {
		return this.#o;
	}

	setOpacity(o) {
		this.#o = o;
	}

	render() {
	}
}

class BaseGame {
	#ctx;
	#os;
	#nodes = [];
	#sKey = [];
	#pKey = [];

	constructor(ctx, os) {
		this.#ctx = ctx;
		this.#os = os;
	}

	isOffscreen() {
		return this.#os;
	}

	resize(bounds) {
		Object.assign(this.#ctx.canvas, bounds);
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

	#bounds() {
		const { width, height } = this.#ctx.canvas;
		return { width, height };
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
		// TODO: possibly pass the KeyReader to the nodes?
		const reader = new KeyReader(this.#sKey);
		const isUp = reader.isUp();
		const isDown = reader.isDown();
		const isLeft = reader.isLeft();
		const isRight = reader.isRight();
		const isFire = reader.isFire();
		this.#nodes.filter(n => n instanceof UpdateNode).forEach(n => n.update());
	}

	#render() {
		this.#ctx.fillStyle = '#6f0000';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		this.#nodes.filter(n => n instanceof RenderNode).forEach(n => n.render());

		/*
		const reader = new KeyReader(this.#sKey);

		this.#ctx.fillStyle = '#111';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

		const x = this.#ctx.canvas.width / 3;
		const y = this.#ctx.canvas.height / 3;

		this.#ctx.fillStyle = 'darkred';
		const { state } = this.#sKey;

		if (reader.isFire()) {
			console.log('Fire', performance.now());
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
		*/
	}
}
