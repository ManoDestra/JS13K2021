let pulse = null;

importScripts('urge-core.js?rnd=' + Math.random());

self.onmessage = e => {
	try {
		const { type, payload } = e.data;
		switch (type) {
			case 'INIT':
				const ctx = payload.getContext('2d');
				pulse = new Pulse(ctx);
				break;
			case 'START':
				pulse.start();
				break;
			case 'RESIZE':
				pulse.resize(payload);
				break;
			case 'KEYBOARD':
				pulse.setKeyState(payload);
				break;
			case 'GAMEPAD':
				pulse.setPadState(payload);
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
