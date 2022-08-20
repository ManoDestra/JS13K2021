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

class Ship extends RenderNode {
}

class Bullet extends RenderNode {
}

class Alien extends RenderNode {
}

class Boss extends RenderNode {
}

class StartScreen extends Screen {
}

class MenuScreen extends Screen {
}

class IntroScreen extends Screen {
}

class PlayScreen extends Screen {
}

class SaveTest extends UpdateNode {
	constructor(game) {
		super(game);
	}

	update(reader) {
		if (reader.isFire()) {
			console.warn('Fire:', performance.now());
			//this.getGame().send('BLEH', { id: 717 });
		}
	}
}

class Game extends BaseGame {
	constructor(ctx, wCtx) {
		super(ctx, wCtx);

		const screens = [
			new StartScreen(this),
			new MenuScreen(this),
			new IntroScreen(this),
			new PlayScreen(this)
		];
		this.register(...screens);

		// TODO: these are available inside Worker, so use them
		const p = new DOMPoint();
		const r = new DOMRect();
	}
}
