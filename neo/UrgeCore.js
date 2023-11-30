class Watch {
	#v;
	#p;

	constructor(v) {
		this.#v = v;
		this.#p = v;
	}

	get value() {
		return this.#v;
	}

	set value(v) {
		this.#p = this.#v;
		this.#v = v;
	}

	get previousValue() {
		return this.#p;
	}

	get changed() {
		return this.#v !== this.#p;
	}
}

class GameTime {
	static #s = new Watch(0);

	static current() {
		return GameTime.#s.value;
	}

	static currentSeconds() {
		return parseInt(GameTime.current() / 1000);
	}

	static previous() {
		return GameTime.#s.previousValue;
	}

	static previousSeconds() {
		return parseInt(GameTime.previous() / 1000);
	}

	static secondsChanged() {
		return GameTime.currentSeconds() !== GameTime.previousSeconds();
	}

	static elapsed() {
		return GameTime.current() - GameTime.previous();
	}

	static fps() {
		const elapsed = GameTime.elapsed();
		return elapsed == 0 ? 0 : (1000 / elapsed);
	}

	static fpsAsInt() {
		return parseInt(GameTime.fps());
	}

	static update(t) {
		GameTime.#s.value = t;
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

class Rect extends DOMRect {
	constructor(x, y, width, height) {
		super(x, y, width, height);
	}

	get position() {
		const { x, y } = this;
		return { x, y };
	}

	set position({ x, y }) {
		this.x = x;
		this.y = y;
	}

	get bounds() {
		const { width, height } = this;
		return { width, height };
	}

	set bounds({ width, height }) {
		this.width = width;
		this.height = height;
	}
}

class UrgeNode {
	#tag = '';
	#nodes = [];

	constructor(tag) {
		this.#tag = tag;
	}

	get tag() {
		return this.#tag;
	}

	get children() {
		return [...this.#nodes];
	}

	clear() {
		this.#nodes.length = 0;
	}

	add(...nodes) {
		this.#nodes.push(...nodes);
	}

	remove(...nodes) {
		throw new Error('To Be Implemented');
	}
}

class UpdateNode extends UrgeNode {
	#a;

	constructor() {
		super();
	}

	get active() {
		return !!this.#a;
	}

	set active(a) {
		this.#a = !!a;
	}

	update() {
	}
}

class RenderNode extends UpdateNode {
	#ctx;

	constructor(tag, ctx) {
		super(tag);
		this.#ctx = Object.freeze(ctx);
	}

	get ctx() {
		return this.#ctx;
	}

	get canvas() {
		return this.#ctx.canvas;
	}

	render() {
	}
}

class UrgeGame extends RenderNode {
	constructor(ctx) {
		super('Game', ctx);
	}

	async init() {
	}

	update() {
		super.update();
	}

	render() {
		this.clearContext();
	}

	clearContext(color = '#111') {
		const { width, height } = this.ctx.canvas;
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, width, height);
	}
}
