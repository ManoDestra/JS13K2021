class Classy {
	static instantiate(clazz, args) {
		const c = clazz.constructor;
		let f = function(){}; // dummy function
		f.prototype = c.prototype; // reference same prototype
		let o = new f(); // instantiate dummy function to copy prototype properties
		c.apply(o, args); // call class constructor, supplying new object as context
		o.constructor = c; // assign correct constructor (not f)
		return o;
	}
}

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

class UpdateNode {
	#game;

	// TODO: change to state e.g. INACTIVE, INITIALIZING, ACTIVE, TERMINATING?
	#a = false;

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
	#ctx;
	#rect = new Rect(0, 0, 1, 1);
	#o = 0;
	#nodes = [];

	constructor(ctx) {
		super();
		if (!ctx) {
			throw new Error('Context Is Required');
		}

		this.#ctx = ctx;
	}

	getContext() {
		return this.#ctx;
	}

	getCanvas() {
		return this.getContext().canvas;
	}

	getRect() {
		return this.#rect;
	}

	getOpacity() {
		return this.#o;
	}

	setOpacity(o) {
		this.#o = o;
	}

	clear() {
		this.#nodes.length = 0;
	}

	add(...nodes) {
		if (!nodes.every(n => n instanceof UpdateNode)) {
			throw new Error('All Nodes Must Subclass UpdateNode', nodes);
		}

		console.log(nodes);

		this.#nodes.push(...nodes);
	}

	update(reader) {
		//const reader = new KeyReader(this.#sKey);
		const updateNodes = this.#nodes
			.filter(n => n instanceof UpdateNode)
			.filter(n => n.isActive());
		updateNodes.forEach(n => n.update(reader));
	}

	render() {
		this.#ctx.fillStyle = '#111';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		this.renderNodes();
		this.renderNodesToContext();
		this.renderToContext();
	}

	renderNodes() {
		const renderNodes = this.#getNodesForRender();
		renderNodes.forEach(n => n.render());
	}

	renderNodesToContext() {
		const renderNodes = this.#getNodesForRender();
		const ctx = this.#ctx;
		const { width: cw, height: ch } = ctx.canvas;
		ctx.save();
		renderNodes.forEach(n => {
			const c = n.getCanvas();
			const { x: rx, y: ry, width: rw, height: rh } = n.getRect();
			const x = rx * cw;
			const y = ry * ch;
			const w = rw * cw;
			const h = rh * ch;
			const o = n.getOpacity();
			ctx.globalAlpha = o;
			ctx.drawImage(c, x, y, w, h);
		});
		ctx.restore();
	}

	renderToContext() {
		// TODO: code
	}

	#getNodesForRender() {
		return this.#nodes
			.filter(n => n instanceof RenderNode)
			.filter(n => n.isActive())
			.filter(n => n.getOpacity() > 0);
	}

	static buildCanvas(width, height) {
		if (!document) {
			return null;
		}

		const canvas = document.createElement('canvas');
		Object.assign(canvas, { width, height });
		return canvas;
	}

	static buildOffscreenCanvas(width, height) {
		return new OffscreenCanvas(width, height);
	}
}

class RenderNodeEx extends UpdateNode {
	#ctx = null;
	#rect = new Rect(0, 0, 1, 1);
	#o = 1;

	constructor(game) {
		super(game);
		const c = this.getGame().isOffscreen()
			? RenderNode.buildOffscreenCanvas(256, 256)
			: RenderNode.buildCanvas(256, 256);

		this.#ctx = c.getContext('2d');

		// Works both on and off screen
		createImageBitmap(c).then(bm => {
			console.log('Bitmap:', bm);

			// Patterns work off either on or off context
			const pattern = this.#ctx.createPattern(bm, 'repeat-x');
			console.log('Pattern:', pattern);
		});
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

	getRect() {
		return this.#rect;
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

class BaseGame extends RenderNode {
	#wc;
	#nodes = [];
	#sKey = [];
	#pKey = [];

	constructor(ctx, wc = null) {
		super(ctx);
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

	resize(bounds) {
		Object.assign(this.getContext().canvas, bounds);
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
		const { width, height } = this.getContext().canvas;
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
		this.update();
		this.render();
		this.#resetState();
		this.#fire();
	}

	#fire() {
		requestAnimationFrame(t => this.#loop(t));
	}

	renderToContext() {
		const ctx = this.getContext();
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
