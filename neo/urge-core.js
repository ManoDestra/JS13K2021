/*
*** DESIGN ***
Urge-client On Its Own For Onscreen
Urge-client/Urge-server for Offscreen

Either the client or the server instantiates Game

UrgeNode
UpdateNode
RenderNode

Game is a RenderNode
**************
*/

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

	static fpsAsInt() {
		return parseInt(GameTime.fps());
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
	#sizeType = 0;
	#rect = new Rect(0, 0, 1, 1);
	#o = 0;

	constructor(ctx) {
		super();
		if (!ctx) {
			throw new Error('Context Is Required');
		}

		this.#ctx = ctx;

		/*
		// Works both on/off screen
		createImageBitmap(c).then(bm => {
			console.log('Bitmap:', bm);

			// Patterns work on/off screen
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

	getSizeType() {
		return this.#sizeType;
	}

	setSizeType(sizeType) {
		this.#sizeType = sizeType;
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
		const isLandscape = cw >= ch;

		ctx.save();
		renderNodes.forEach(n => {
			const t = n.getSizeType();

			// TODO: we're using rect at present, but we may need to separate that out?
			const { x: rx, y: ry, width: rw, height: rh } = n.getRect();
			const x = rx * cw;
			const y = ry * ch;

			// TODO: simplify?
			let w;
			let h;
			switch (t) {
				case 0:
					w = rw * cw;
					h = rh * ch;
					break;
				case 1:
					if (isLandscape) {
						h = rh * ch;
						w = rw * h;
					} else {
						w = rw * cw;
						h = rh * w;
					}

					break;
				case 2:
					if (isLandscape) {
						w = rw * cw;
						h = rh * w;
					} else {
						h = rh * ch;
						w = rw * h;
					}

					break;
				default:
					throw new Error('Invalid Size Type: ' + t);
			}

			ctx.globalAlpha = n.getOpacity();
			ctx.drawImage(n.getCanvas(), x, y, w, h);
		});
		ctx.restore();
	}

	renderNode() {
	}

	resize(bounds) {
		this.resizeNode(bounds);
		this.#getNodesForRender().forEach(n => n.resize(bounds));
	}

	resizeNode(bounds) {
		Object.assign(this.getContext().canvas, bounds);
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
			// TOP-LEFT
			const fontSize = 36;
			const fontName = 'Segoe UI';
			const mX = 10;
			const mY = 10;
			ctx.font = `${fontSize}px ${fontName}`;

			ctx.fillStyle = 'white';

			const msg = `FPS: ${GameTime.fpsAsInt()}`;
			const measure = ctx.measureText(msg);

			// TOP-LEFT
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillText(msg, mX, mY);

			// TOP-RIGHT
			ctx.textAlign = 'right';
			ctx.textBaseline = 'top';
			ctx.fillText('Memento Mori (Mortimer\'s Eternal Return)', this.getCanvas().width - mX, mY);

			// BOTTOM-LEFT
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			ctx.fillText('Score: 0', mX, this.getCanvas().height - mY);

			// BOTTOM-RIGHT
			ctx.textAlign = 'right';
			ctx.textBaseline = 'bottom';
			ctx.fillText('v0.0.0.1-ALPHA', this.getCanvas().width - mX, this.getCanvas().height - mY);
		}
	}
}
