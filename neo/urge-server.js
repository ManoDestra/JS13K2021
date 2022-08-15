let game = null;

importScripts('urge-core.js?r=' + Math.random());
importScripts('game.js?r=' + Math.random());

console.log('Worker Self:', self);

self.onmessage = e => {
	try {
		const { type, payload } = e.data;
		switch (type) {
			case 'INIT':
				const ctx = payload.getContext('2d');
				game = new Game(ctx, this);
				if (!(game instanceof BaseGame)) {
					throw new Error('Game Class Must Subclass BaseGame');
				}

				break;
			case 'START':
				game.start();
				break;
			case 'RESIZE':
				game.resize(payload);
				break;
			case 'KEYBOARD':
				game.setKeyState(payload);
				break;
			case 'GAMEPAD':
				game.setPadState(payload);
				break;
			case 'MOUSE':
				// TODO: code
				break;
			case 'TOUCH':
				// TODO: code
				break;
			default:
				throw new Error('Unsupported Type: ' + type);
		}
	} catch(e) {
		console.error(e);
	}
};