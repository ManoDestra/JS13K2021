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

/*
// Doesn't look right
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
*/
