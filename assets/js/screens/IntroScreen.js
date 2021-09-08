class IntroScreen extends Urge.Screen {
	#totalElapsed = 0;
	#lastSpacePressed = false;
	#lines = [
		'Under Attack!',
		'Chemical Warfare Attack!',
		'Scramble The Clone Pilots To Their Ships!',
		'Protect The Planet At All Costs From These Space-Born Pathogens!',
		'Infectious Agents Of Unknown Origin Incoming!',
		'Be Strong, Clone Warriors!',
		'We Will Overcome These Personal Space Invaders!',
		'Avoid Infection! Practice Spatial Distancing!',
		'Please Remember That Another Clone Will Replace You If You Die...',
		'The Clone That Replaces You Will Benefit From Your Experience...',
		'With Enhanced Abilities And Skills...',
		'Use W|S|A|D To Move, Space To Fire',
		'Now, Get Out There And Save Our Race From Infection!'
	];
	#spawned;

	constructor(game, state) {
		super(game, state);
		this.#spawned = this.#lines.map(e => false);
		console.log(this.#spawned);
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
			const delay = i * 1000;
			const slogan = new Slogan(ctx, x, y, width, height, text, delay);
			store.put(slogan);
		}

		store.forEach(c => {
			console.log('Component:', c);
		});
	}

	update(instant) {
		const store = this.getStore();
		store.update(instant);
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		const ctx = this.getContext();
		const store = this.getStore();
		store.render(instant);
		//store.renderByTypes(instant, Slogan);

		/*
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkred';
		ctx.strokeRect(100, 100, 100, 100);
		ctx.fillRect(100, 100, 100, 100);
		*/
	}

	term() {
	}
}
