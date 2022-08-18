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
	#game;
	// TODO: change to state e.g. INACTIVE, INITIALIZING, ACTIVE, TERMINATING?
	#a = false;

	constructor(game) {
		this.#game = game;
	}

	getGame() {
		return this.#game;
	}

	isActive() {
		return this.#a;
	}

	setActive(a) {
		this.#a = a;
	}

	update(reader) {
		// TODO: code
	}
}

class RenderNode extends UpdateNode {
	#ctx = null;
	#x = 0;
	#y = 0;
	#w = 1;
	#h = 1;
	#o = 1;

	constructor(game) {
		super(game);
		const c = this.getGame().isOffscreen() ? this.buildOffscreenCanvas() : this.buildCanvas();
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
		return this.getGame().isOffscreen();
	}

	getContext() {
		return this.#ctx;
	}

	getCanvas() {
		return this.getContext().canvas;
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

	getPosition() {
		return { x: this.#x, y: this.#y };
	}

	setPosition({x, y}) {
		this.#x = x;
		this.#y = y;
	}

	getDimensions() {
		return { w: this.#w, h: this.#h };
	}

	setDimensions({ w, h }) {
		this.#w = w;
		this.#h = h;
	}

	getConfig() {
		return {
			x: this.#x,
			y: this.#y,
			w: this.#w,
			h: this.#h,
			o: this.#o,
		};
	}

	setConfig({x, y, w, h, o}) {
		this.setPosition({ x, y });
		this.setDimensions({ w, h });
		this.setOpacity(o);
	}

	render() {
	}
}

class BaseGame {
	#ctx;
	#wc;
	#nodes = [];
	#sKey = [];
	#pKey = [];

	constructor(ctx, wc = null) {
		console.log('BaseGame Construction:', ctx, wc);
		this.#ctx = ctx;
		this.#wc = wc;
	}

	send(type, payload) {
		if (this.isOffscreen()) {
			this.#wc.postMessage({ type, payload });
		} else {
			Cryo.set('mortimer.save', payload);
		}
	}

	isOffscreen() {
		return !!this.#wc;
	}

	register(...nodes) {
		if (!nodes.every(n => n instanceof UpdateNode)) {
			throw new Error('All Nodes Must Subclass UpdateNode', nodes);
		}

		this.#nodes.push(...nodes);
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
		const reader = new KeyReader(this.#sKey);
		const updateNodes = this.#nodes
			.filter(n => n instanceof UpdateNode)
			.filter(n => n.isActive());
		updateNodes.forEach(n => n.update(reader));
	}

	#render() {
		this.#ctx.fillStyle = '#111';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		const renderNodes = this.#nodes
			.filter(n => n instanceof RenderNode)
			.filter(n => n.isActive())
			.filter(n => n.getOpacity() > 0);
		console.log('To Render:', renderNodes.length);
		const ctx = this.#ctx;
		const { width: cw, height: ch } = ctx.canvas;
		renderNodes.forEach(n => n.render());
		ctx.save();
		renderNodes.forEach(n => {
			const c = n.getCanvas();
			const cfg = n.getConfig();
			const x = cfg.x * cw;
			const y = cfg.y * ch;
			const w = cfg.w * cw;
			const h = cfg.h * ch;
			const { o } = cfg;
			ctx.globalAlpha = o;
			ctx.drawImage(c, x, y, w, h);
		});
		ctx.restore();

		// FPS Output
		if (ctx.fillText) {
			ctx.font = '36px Arial';
			ctx.fillStyle = 'white';
			ctx.fillText(`FPS: ${parseInt(GameTime.fps())}`, 50, 50);
		} else {
			if (parseInt(GameTime.previous() / 1000) != parseInt(GameTime.current() / 1000)) {
				console.log('FPS:' + GameTime.fps());
			}
		}
	}
}
