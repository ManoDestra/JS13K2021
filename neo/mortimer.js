class Screen extends RenderNode {
	constructor(game) {
		super(game);
		this.setActive(true);
		const rect = this.getRect();
		rect.position = {
			x: Math.random() * 0.95,
			y: Math.random() * 0.9
		};
		rect.bounds = {
			width: 0.05,
			height: 0.1
		};
		this.setOpacity(0.7);
		console.log(rect);
	}

	render() {
		const ctx = this.getContext();
		const r = this.#randomColor();
		const g = this.#randomColor();
		const b = this.#randomColor();
		const a = this.#randomColor();
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillRect(0, 0, 256, 256);
	}

	#randomColor() {
		return parseInt(Math.random() * 256);
	}
}

class StartScreen extends Screen {
}

class MenuScreen extends Screen {
}

class IntroScreen extends Screen {
}

class PlayScreen extends Screen {
}

class Game extends BaseGame {
	constructor(ctx, wCtx) {
		super(ctx, wCtx);
		const screens = [
			new StartScreen(this)
		];
		this.register(...screens);
	}
}
