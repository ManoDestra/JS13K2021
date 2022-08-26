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

	hasChanged() {
		return this.#c != this.#p;
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

class Boundary {
	static #bounds = new Watch({
		width: 0,
		height: 0,
		maxWidth: 0,
		maxHeight: 0,
		orientationType: 'landscape-primary'
	});

	static get() {
		return { ...this.#bounds };
	}

	static set(bounds) {
		this.#bounds.set(bounds);
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
	#nodes = [];

	clear() {
		this.#nodes.length = 0;
	}

	add(...nodes) {
		this.#nodes.push(...nodes);
	}

	remove(...nodes) {
		throw new Error('To Be Implemented');
	}

	getChildren() {
		return [...this.#nodes];
	}
}

class UpdateNode extends UrgeNode {
	add(...nodes) {
		if (!nodes.every(n => n instanceof UpdateNode)) {
			throw new Error('All Nodes Must Subclass UpdateNode', nodes);
		}

		super.add(...nodes);
	}

	// TODO: change to state e.g. INACTIVE, INITIALIZING, ACTIVE, TERMINATING?
	#a = false;

	init() {
	}

	term() {
	}

	isActive() {
		return this.#a;
	}

	setActive(a) {
		this.#a = a;
	}

	update(reader) {
		const updateNodes = this.getChildren()
			.filter(n => n instanceof UpdateNode)
			.filter(n => n.isActive());
		updateNodes.forEach(n => n.update(reader));
	}
}

class RenderNode extends UpdateNode {
	#ctx;
	#rect = new Rect(0, 0, 1, 1);
	#o = 0;

	constructor(ctx) {
		super();
		if (!ctx) {
			throw new Error('Context Is Required');
		}

		this.#ctx = ctx;

		/*
		// Works both on and off screen
		createImageBitmap(c).then(bm => {
			console.log('Bitmap:', bm);

			// Patterns work off either on or off context
			const pattern = this.#ctx.createPattern(bm, 'repeat-x');
			console.log('Pattern:', pattern);
		});
		*/
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
		this.#ctx.fillStyle = '#111';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		this.renderChildren();
		this.renderChildrenToContext();
		this.renderNode();
	}

	renderChildren() {
		const renderNodes = this.#getNodesForRender();
		renderNodes.forEach(n => n.render());
	}

	renderChildrenToContext() {
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

	renderNode() {
	}

	#getNodesForRender() {
		return this.getChildren()
			.filter(n => n instanceof RenderNode)
			.filter(n => n.isActive())
			.filter(n => n.getOpacity() > 0);
	}
}

class BaseGame extends RenderNode {
	#wc;
	#sKey = [];
	#pKey = [];

	constructor(ctx, wc = null) {
		super(ctx);
		this.#wc = wc;
	}

	static buildOnscreenCanvas(width, height) {
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
		this.init();
		this.#fire();
	}

	buildCanvas(width = 0, height = 0) {
		const bounds = this.#bounds();
		const widthToUse = width ? width : bounds.width;
		const heightToUse = height ? height : bounds.height;
		return this.isOffscreen()
			? BaseGame.buildOffscreenCanvas(widthToUse, heightToUse)
			: BaseGame.buildOnscreenCanvas(widthToUse, heightToUse);
	}

	send(type, payload) {
		switch (type) {
			case 'SAVE':
				if (this.isOffscreen()) {
					this.#wc.postMessage({ type, payload });
				} else {
					const key = 'mortimer.save';
					Cryo.set(key, payload);
				}
			default:
				throw new Error(`Unsupported Type: ${type}`);
		}
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

	update(r) {
		const reader = new KeyReader(this.#sKey);
		super.update(reader);
	}

	renderNode() {
		const ctx = this.getContext();
		if (ctx.fillText) {
			ctx.font = '64px Courier New';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'left';
			//ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			//ctx.textBaseline = 'middle';
			const msg = `Frames Per Second (FPS): ${parseInt(GameTime.fps())}`;
			const measure = ctx.measureText(msg);
			//console.log('Measure:', measure);
			ctx.fillText(msg, 5, 5);
		}
	}
}
