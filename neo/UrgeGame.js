function $(selector, root = document) {
	const rootToUse = typeof(root) === 'string' ? $(root) : root;
	return rootToUse.querySelector(selector);
}

function $$(selector, root = document) {
	const rootToUse = typeof(root) === 'string' ? $(root) : root;
	return rootToUse.querySelectorAll(selector);
}

class Cryo {
	static #PREFIX = 'com.manodestra.';

	static list() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			console.log('Key:', key);
		}
	}

	static get(key) {
		const keyToUse = Cryo.#getKey(key);
		const text = localStorage.getItem(keyToUse);
		return JSON.parse(text);
	}

	static set(key, o) {
		const keyToUse = Cryo.#getKey(key);
		const text = JSON.stringify(o);
		localStorage.setItem(keyToUse, text);
	}

	static remove(key) {
		const keyToUse = Cryo.#getKey(key);
		localStorage.removeItem(keyToUse);
	}

	static clear(prefix = '') {
		const prefixToUse = Cryo.#getKey(prefix);
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith(prefixToUse)) {
				localStorage.removeItem(key);
			}
		}
	}

	static #getKey(key) {
		return Cryo.#PREFIX + key;
	}
}

class KeyWriter {
	static #store = (new Array(256)).fill(null);
	static #handler = null;

	static #clear(handler) {
		KeyWriter.#store.forEach((e, i, a) => {
			a[i] = [false, false];
		});
		KeyWriter.#handler = handler;
	}

	static start(handler) {
		// TODO: create KeyEvent constants if they don't exist
		//console.log('KeyEvent:', window?.KeyEvent);
		//console.log('KeyEvent.DOM_VK_0:', window?.KeyEvent?.DOM_VK_0);

		KeyWriter.#clear(handler);
		addEventListener('keydown', KeyWriter.#down, false);
		addEventListener('keyup', KeyWriter.#up, false);
	}

	static stop() {
		removeEventListener('keydown', KeyWriter.#down, false);
		removeEventListener('keyup', KeyWriter.#up, false);
		KeyWriter.#clear();
	}

	static state() {
		return structuredClone(KeyWriter.#store);
	}

	static check(...keyCodes) {
		return !!keyCodes.find(k => KeyWriter.#store[k]);
	}

	static #down(e) {
		KeyWriter.#process(e, true);
	}

	static #up(e) {
		KeyWriter.#process(e, false);
	}

	static #process(e, isDown) {
		const { keyCode } = e;
		const existing = KeyWriter.#store?.[keyCode];
		if (existing) {
			existing[1] = existing[0];
			existing[0] = isDown;
			KeyWriter.#fireHandler();
		}
	}

	static #fireHandler() {
		if (KeyWriter.#handler) {
			KeyWriter.#handler(KeyWriter.state());
		}
	}
}

class Pads {
	static #active = false;
	static #handler = null;

	static get() {
		const [ a = null, b = null, c = null, d = null ] = navigator.getGamepads();
		const pads = [ a, b, c, d ];
		return pads.map(p => {
			if (p) {
				const { id, axes, buttons: existingButtons, connected } = p;
				const buttons = existingButtons.map(b => {
					const { pressed, touched, value } = b;
					return { pressed, touched, value };
				});
				return { id, axes, buttons, connected };
			} else {
				return null;
			}
		});
	}

	static start(handler = null) {
		addEventListener('gamepadconnected', Pads.#onConnect, false);
		addEventListener('gamepaddisconnected', Pads.#onDisconnect, false);
		Pads.#active = true;
		Pads.#handler = handler;
		requestAnimationFrame(Pads.#loop);
	}

	static stop() {
		removeEventListener('gamepadconnected', Pads.#onConnect, false);
		removeEventListener('gamepaddisconnected', Pads.#onDisconnect, false);
		Pads.#active = false;
		Pads.#handler = null;
	}

	static #onConnect(e) {
		console.log('Pad Connect:', e);
		const { gamepad: pad } = e;
		console.log('Pad:', pad);

		const pads = Pads.get();
		console.log(pads);
	}

	static #onDisconnect(e) {
		console.log('Pad Disconnect:', e);
		const { gamepad: pad } = e;
		console.log('Pad:', pad);
		console.log('Pads:', Pads.get());
	}

	static #loop(tick) {
		if (Pads.#handler) {
			Pads.#handler(Pads.get());
		}

		if (Pads.#active) {
			requestAnimationFrame(t => Pads.#loop(t));
		}
	}
}

class UrgeGame {
	#server = null;
	#title = null;

	constructor(config = {}) {
		const { server = 'UrgeServer.js', title = 'Game' } = config;
		this.#title = title;
		this.#server = new Worker(`${server}?r=${Math.random()}`);
		this.#server.onmessage = this.#handleMessage;
	}

	async init() {
		// initialize assets, etc.
	}

	start() {
		document.title = this.#title;
		document.body.innerText = '';
		this.#setStyle();
		this.#buildBody();

		this.#bindResize();
		this.#bindVisibility();

		KeyWriter.start(e => {
			this.#server.postMessage({
				type: 'KEYBOARD',
				request: e
			});
		});
		Pads.start(e => {
			this.#server.postMessage({
				type: 'GAME_PAD',
				request: e
			});
		});

		/*
		// Sending ImageData objects to the server works
		const imageData = new ImageData(1024, 768);
		this.#server.postMessage({
			type: 'IMG',
			request: imageData
		});
		*/
	}

	#handleMessage(e) {
		console.log('Server Message:', e.data);
	}

	#handleResize() {
		const request = this.#getBounds();
		this.#server.postMessage({
			type: 'RESIZE',
			request
		});
	}

	#handleVisibility() {
		this.#server.postMessage({
			type: 'VISIBILITY',
			request: !document.hidden
		});
	}

	#setStyle() {
		Object.assign(document.body.style, {
			backgroundColor: '#111',
			color: '#fff',
			margin: '0px',
			padding: '0px',
			height: '100%',
			overflow: 'hidden'
		});
	}

	#buildBody() {
		const { body } = document;
		body.innerText = '';
		const c = document.createElement('canvas');
		body.append(c);
		const osc = c.transferControlToOffscreen();
		this.#server.postMessage({
			type: 'START',
			request: osc
		}, [osc]);
	}

	#getBounds() {
		const { width, height } = window.visualViewport;
		const {
			availWidth: maxWidth,
			availHeight: maxHeight,
			orientation: {
				angle = 0,
				type: orientationType
			} = {}
		} = screen;
		return { width, height, maxWidth, maxHeight, angle, orientationType };
	}

	#bindResize() {
		const r = () => this.#handleResize();

		// This additional call is to get round an issue where Chrome does not fire the initial event.
		r();
		visualViewport.addEventListener('resize', r, false);
		visualViewport.addEventListener('scroll', r, false);
	}

	#bindVisibility() {
		const r = () => this.#handleVisibility();
		addEventListener('visibilitychange', r, false);
	}
}
