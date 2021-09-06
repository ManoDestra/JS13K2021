/*
const Test = (() => {
	function foobar(clazz) {
		if (clazz.prototype instanceof Urge.Component) {
			const instance = new clazz();
			console.log('Instance:', instance);
		} else {
			console.log('Not A GameComponent:', clazz);
		}
	}

	return {
		foobar
	};
})();

const SpaceGame = (() => {
	let patternMoon = null;

	const ScreenState = {
		INACTIVE: 0,
		INITIALIZING: 1,
		ACTIVE: 2,
		TERMINATING: 3
	};
	Object.freeze(ScreenState);

	const SpaceState = {
		state: Screen.START,
		level: 1,
		player: {
			health: 100,
			shield: 0,
			xp: 0
		},
		skills: {
			health: 100,
			shield: 0,
			xp: 0
		}
	};

	function drawPlanets() {
		for (let i = 0; i < 5; i++) {
			const x = parseInt(Math.random() * canvas.width);
			const y = parseInt(Math.random() * canvas.height);
			const r = parseInt(Math.random() * 50) + 20;
			const g = context.createLinearGradient(x + r, y, x + r, y + (r * 1));
			g.addColorStop(0, '#333');
			g.addColorStop(0.5, '#fff');
			g.addColorStop(1, '#333');
			context.strokeStyle = LIGHT;
			//context.fillStyle = g;
			context.fillStyle = this.patternMoon;
			//context.fillStyle = 'url(assets/images/Moon01.jpg)';

			context.beginPath();
			context.arc(x, y, r, 0, Math.PI * 2);
			context.fill();
			context.closePath();
		}
	}
})();
*/
