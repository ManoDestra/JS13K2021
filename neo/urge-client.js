class Feature {
	static canWorker() {
		return !!window.Worker;
	}

	static canOffscreenCanvas() {
		return !!window.OffscreenCanvas;
	}

	static canTransferControl() {
		return !!((document.createElement('canvas')).transferControlToOffscreen);
	}

	static canStructuredClone() {
		return !!window.structuredClone;
	}
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

	static #clear(handler = null) {
		KeyWriter.#store.forEach((e, i, a) => {
			a[i] = [false, false];
		});
		KeyWriter.#handler = handler;
	}

	static start(handler = null) {
		// TODO: create KeyEvent constants if they don't exist
		//console.log('KeyEvent:', window?.KeyEvent);
		//console.log('KeyEvent.DOM_VK_0:', window?.KeyEvent?.DOM_VK_0);

		KeyWriter.#clear(handler);
		window.addEventListener('keydown', KeyWriter.#down, false);
		window.addEventListener('keyup', KeyWriter.#up, false);
	}

	static stop() {
		window.removeEventListener('keydown', KeyWriter.#down, false);
		window.removeEventListener('keyup', KeyWriter.#up, false);
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
		window.addEventListener('gamepadconnected', Pads.#onConnect, false);
		window.addEventListener('gamepaddisconnected', Pads.#onDisconnect, false);
		Pads.#active = true;
		Pads.#handler = handler;
		requestAnimationFrame(Pads.#loop);
	}

	static stop() {
		window.removeEventListener('gamepadconnected', Pads.#onConnect, false);
		window.removeEventListener('gamepaddisconnected', Pads.#onDisconnect, false);
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

class Urge {
	static #canOffscreen() {
		return Feature.canWorker() &&
			Feature.canOffscreenCanvas() &&
			Feature.canTransferControl() &&
			Feature.canStructuredClone();
	}

	static init() {
		Urge.#setTitle();
		Urge.#setStyle();
		Urge.#buildBody();
		if (Urge.#canOffscreen()) {
			console.log('Offscreen');
			Urge.#initOffscreen();
		} else {
			console.log('Onscreen');
			Urge.#initOnscreen();
		}
	}

	static #setTitle() {
		document.title = 'JS13K';
	}

	static #setStyle() {
		Object.assign(document.body.style, {
			backgroundColor: '#111',
			color: '#fff',
			margin: '0px',
			padding: '0px',
			height: '100%',
			overflow: 'hidden'
		});
	}

	static #buildBody() {
		document.body.innerHTML = '';
		const c = document.createElement('canvas');
		document.body.appendChild(c);
	}

	static #initOnscreen() {
		const ctx = document.querySelector('canvas').getContext('2d');
		const game = new Game(ctx);
		if (!(game instanceof BaseGame)) {
			throw new Error('Game Class Must Subclass BaseGame');
		}

		const r = () => {
			const bounds = Urge.#getBounds();
			//console.log('OnScreen Bounds:', bounds);
			game.resize(bounds);
			Boundary.set(bounds);
		};
		Urge.#bindResize(r);
		game.start();

		KeyWriter.start(e => game.setKeyState(e));
		Pads.start();
	}

	static #initOffscreen() {
		const w = new Worker('urge-server.js?r=' + Math.random());
		w.onmessage = e => {
			console.log('Received From Server:', e.data);
			Cryo.set('mortimer.save', e.data);
		};

		const osc = document.querySelector('canvas').transferControlToOffscreen();
		w.postMessage({
			type: 'INIT',
			payload: osc
		}, [osc]);

		if (crossOriginIsolated) {
			const shared = new SharedArrayBuffer(8);
			const array = new Uint8Array(shared);
			console.log('Array:', array, array.length);
		} else {
			console.warn('You can only use a SharedArrayBuffer in a secure context');
		}

		const r = () => {
			const payload = Urge.#getBounds();
			//console.log('Offscreen Bounds:', payload);
			w.postMessage({
				type: 'RESIZE',
				payload
			});
		};
		Urge.#bindResize(r);
		w.postMessage({
			type: 'START'
		});

		KeyWriter.start(e => {
			w.postMessage({
				type: 'KEYBOARD',
				payload: e
			});
		});
		Pads.start(e => {
			w.postMessage({
				type: 'GAMEPAD',
				payload: e
			});
		});
	}

	static #getBounds() {
		const { width, height } = window.visualViewport;
		const { availWidth: maxWidth, availHeight: maxHeight, orientation: { angle = 0, type: orientationType } = {} } = screen;
		return { width, height, maxWidth, maxHeight, angle, orientationType };
	}

	static #bindResize(r) {
		r();
		window.visualViewport.addEventListener('resize', r, false);
		window.visualViewport.addEventListener('scroll', r, false);
	}
}

Urge.init();
