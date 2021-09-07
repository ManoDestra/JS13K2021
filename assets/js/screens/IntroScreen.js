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

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
	}

	update(instant) {
		const store = this.getStore();
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		const ctx = this.getContext();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkred';
		ctx.strokeRect(100, 100, 100, 100);
		ctx.fillRect(100, 100, 100, 100);
	}

	term() {
	}
}
