class Rogue19Client extends UrgeClient {
	constructor(config) {
		super(config);
	}

	get title() {
		return 'Rogue-19';
	}

	get components() {
		return ['Rogue19Server.js'];
	}

	//async init() {
	//	console.log('Async Init');
	//}
}
