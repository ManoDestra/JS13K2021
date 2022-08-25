let game = null;

importScripts('urge-core.js?r=' + Math.random());
importScripts('rogue.js?r=' + Math.random());

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
				Boundary.set(payload);
				break;
			case 'KEYBOARD':
				game.setKeyState(payload);
				break;
			case 'GAMEPAD':
				game.setPadState(payload);
				break;
			case 'MOUSE':
				throw new Error('To Be Implemented');
				break;
			case 'TOUCH':
				throw new Error('To Be Implemented');
				break;
			default:
				throw new Error('Unsupported Type: ' + type);
		}
	} catch(e) {
		console.error(e);
	}
};
