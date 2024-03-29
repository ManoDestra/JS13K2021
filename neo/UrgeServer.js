importScripts(`UrgeCore.js?r=${Math.random()}`);

class UrgeServer {
	#ctx;
	#active = true;
	#components = [];

	constructor(ctx) {
		this.#ctx = Object.freeze(ctx);
	}

	get ctx() {
		return this.#ctx;
	}

	start() {
		this.#fire();
	}

	set active(value) {
		this.#active = !!value;
	}

	add(...c) {
		this.#components.push(...c);
	}

	resize(bounds) {
		Object.assign(this.#ctx.canvas, bounds);
	}

	#fire() {
		requestAnimationFrame(t => this.#loop(t));
	}

	#loop(t) {
		if (this.#active) {
			this.#update(t);
			this.#render(t);
		}

		this.#fire(t);
	}

	#update(t) {
		GameTime.update(t);

		// TODO: active only
		// TODO: will depend on if it's an update component, or only allow UpdateNodes to be added
		this.#components.forEach(c => c.update());
	}

	#render(t) {
		// TODO: active only
		// TODO: will depend on if it's a render component
		this.#components.forEach(c => c.render());
	}
}

class Handler {
	static async onMessage(e) {
		const { type, request } = e.data;

		switch (type) {
			case 'ADD':
				const { path = '', classes } = request;
				if (path && Array.isArray(classes) && classes.length) {
					importScripts(`${path}?r=${Math.random()}`);
					const components = classes.map(c => {
						if (['.', ';', ' '].includes(c)) {
							throw new Error('Invalid Character: ' + c);
						}

						const componentClass = eval(c);
						if (!componentClass) {
							throw new Error('Class Not Found: ' + c);
						}

						console.log('Component Class Name:', componentClass.name);
						return new componentClass(server.ctx);
					});
					const results = await Promise.all(components.map(c => c.init()));
					console.log('Results:', results);
					server.add(...components);
				}

				break;
			case 'START':
				const ctx = request.getContext('2d');
				server = new UrgeServer(ctx);
				server.start();
				break;
			case 'RESIZE':
				server.resize(request);
				break;
			case 'VISIBILITY':
				server.active = request;
				break;
			case 'KEYBOARD':
				break;
			case 'GAME_PAD':
				break;
			default:
				throw new Error('Unsupported Message Type: ' + type);
		}

		//postMessage(`${type}: Complete ${performance.now()}`);

		/*
		if (type === 'IMG') {
			console.log(request.width + 'x' + request.height);
			createImageBitmap(request).then(img => {
				console.log('IMG:', img, img.width, img.height);
			});
		}
		*/

		/*
		switch (type) {
			case 'INIT':
				for (let c of request) {
					if (['.', ';', ' '].includes(c)) {
						throw new Error('Invalid Character: ' + c);
					}
				}

				// Normally, eval should be avoided, but there's no way round it here, hence the above validation.
				const gameClass = eval(request);
				if (!gameClass) {
					throw new Error('Class Not Found: ' + request);
				}

				// TODO: fix interface, probably gameClass.start() or gameClass.init().
				const game = new gameClass();
				game.process();

				postMessage('INITIALIZED');

				break;
			default:
				throw new Error(`Unsupported Type: ${type}`);
		}
		*/
	}

	static onMessageError() {
		console.error('Server Message Error:', e);
	}

	static onError(e) {
		console.error('Server Error:', e);
	}
}

let server = null;
self.onmessage = Handler.onMessage;
self.onmessageerror = Handler.onMessageError;
self.onerror = Handler.onError;
