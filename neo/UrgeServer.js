importScripts(`UrgeCore.js?r=${Math.random()}`);

class UrgeServer {
	#ctx;
	#active = true;

	constructor(osc) {
		this.#ctx = osc.getContext('2d');
	}

	start() {
		this.#fire();
	}

	set active(value) {
		this.#active = !!value;
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
	}

	#render(t) {
		this.#ctx.fillStyle = 'purple';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

		this.#ctx.font = '50px Segoe UI';
		this.#ctx.fillStyle = 'white';
		const text = `FPS: ${GameTime.fpsAsInt()} - ${GameTime.currentSeconds()} Seconds`;
		const size = this.#ctx.measureText(text);
		this.#ctx.fillText(text, 20, 60);
	}

	resize(bounds) {
		Object.assign(this.#ctx.canvas, bounds);
	}
}

let server = null;

self.onmessage = e => {
	const { type, request } = e.data;
	//console.log('Client Message:', e.data);
	//console.log('Client Message [Breakdown]:', type, request);

	switch (type) {
		case 'IMPORT':
			const reqToUse = Array.isArray(request) ? request : [request];
			importScripts(...request);
			break;
		case 'INIT':
			// TODO: handle assets or just initialize bespoke game class?

			const gameClass = eval(request);
			if (!gameClass) {
				throw new Error('Class Not Found: ' + request);
			}

			// TODO: fix interface, probably gameClass.start() or gameClass.init().
			const game = new gameClass();
			game.process();
			break;
		case 'START':
			server = new UrgeServer(request);
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
		case 'START':
			postMessage({
				type: 'START',
				request,
				response: {
					message: 'The game has been started'
				}
			});
			break;
		case 'IMPORT':
			const reqToUse = Array.isArray(request) ? request : [request];
			importScripts(...request);
			postMessage('IMPORTED');
			break;
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
};

self.onmessageerror = e => {
	console.error('Message Error:', e);
};

self.onerror = e => {
	console.error('Worker Error:', e);
};
