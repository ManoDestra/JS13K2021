class IntroScreen extends Urge.Screen {
	#totalElapsed = 0;
	#lastSpacePressed = false;
	#lines = [
		'We Are Under Attack!',
		'Chemical Warfare!!',
		'Scramble The Clone Pilots To Their Ships!',
		'Protect The Planet At All Costs From Space-Born Pathogens!',
		'Infectious Agents Of Unknown Origin Incoming!',
		'Be Strong, Clone Warriors!',
		'We Will Overcome These Personal Space Invaders!',
		'Avoid Infection! Practice Spatial Distancing!',
		'Remember That Another Clone Will Replace You When You Die...',
		'Each Clone Benefits From Your Experience Upon Your Death...',
		'With Enhanced Abilities And Skills...',
		'Use W|S|A|D To Move, Space To Fire',
		'Now, Get Out There And Save Our Race From Infection!'
	];

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
		const store = this.getStore();
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const x = canvas.width / 2;
		const y = canvas.height * 0.9;
		const width = canvas.width / 3;
		const height = canvas.height / 5;
		for (let i = 0; i < this.#lines.length; i++) {
			const text = this.#lines[i];
			const delay = (i * 3 + 1) * 1000;
			const slogan = new Slogan(ctx, x, y, width, height, text, delay);
			store.put(slogan);
		}
	}

	update(instant) {
		const store = this.getStore();
		store.update(instant);
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		super.render(instant);
		const ctx = this.getContext();
		const store = this.getStore();
		store.render(instant);
	}

	term() {
	}
}
