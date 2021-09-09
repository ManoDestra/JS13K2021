class IntroScreen extends Urge.Screen {
	#totalElapsed = 0;
	#lastSpacePressed = false;
	#lines = [
		'Citizens Of Planet Tran!',
		'We Are Under Attack!',
		'Chemical Warfare, Waged From A Distant Galaxy!',
		'Scramble The Clone Pilots To Their Ships!',
		'Protect The Planet At All Costs From Space-Born Pathogens!',
		'Infectious Agents Of Unknown Origin Incoming!',
		'Be Strong, Clone Warriors!',
		'We Will Overcome These Personal Space Invaders!',
		'Avoid Infection! Practice Spatial Distancing!',
		'Never Fear! A New Clone Will Replace You When You Die',
		'Each New Clone Benefits From Your Experience',
		'With Enhanced Abilities And Skills',
		'Use W/S/A/D To Move',
		'Press SPACE To Shoot',
		'Now, Get Out There, Clone Warrior!',
		'Save Our Planet From This Nefarious Viral Attack!'
	];

	constructor(game, state) {
		super(game, state);
	}

	init() {
		super.init();
		const store = this.getStore();
		const state = this.getState();
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const x = canvas.width / 2;
		const y = canvas.height * 1.1;
		const width = canvas.width / 3;
		const height = canvas.height / 5;
		const sf1 = new StarField(ctx, {
			image: state.assets.starFields[0],
			scrollSeconds: 300
		});
		const sf2 = new StarField(ctx, {
			image: state.assets.starFields[1],
			scrollSeconds: 180
		});
		store.put(sf1, sf2);
		for (let i = 0; i < this.#lines.length; i++) {
			const text = this.#lines[i];
			const delay = (i * 2 + 1) * 1000;
			const slogan = new Slogan(ctx, x, y, width, height, text, delay);
			store.put(slogan);
		}
	}

	update(instant) {
		const store = this.getStore();
		store.update(instant);
		const spacePressed = Nucleus.Keys.checkKey(' ');
		if (this.getScreenState() == Urge.ScreenState.ACTIVE && spacePressed && !this.#lastSpacePressed) {
			this.navigate(PlayingScreen);
		}

		this.#lastSpacePressed = spacePressed;
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		super.render(instant);
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const store = this.getStore();
		store.render(instant);
		const text = 'Press SPACE To Begin';

		ctx.fillStyle = '';
		ctx.font = '48px sans-serif';
		ctx.textAlign = 'center';
		const measured = ctx.measureText(text);
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'darkgreen';
		ctx.fillRect(((canvas.width - measured.width) / 2) - 10, 50, measured.width + 20, 58);
		ctx.fillStyle = 'white';
		ctx.fillText(text, canvas.width / 2, 98);
	}
}
