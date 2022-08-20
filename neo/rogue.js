class Screen extends RenderNode {
	constructor(game) {
		super(game);
	}
}

class Background extends RenderNode {
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

class Game extends BaseGame {
	constructor(ctx, wCtx) {
		super(ctx, wCtx);
		const screens = [
			new StartScreen(this)
		];
		this.register(...screens);
		// Activate screen, transition
	}
}
