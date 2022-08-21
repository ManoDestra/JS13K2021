class Background extends RenderNode {
	constructor(ctx) {
		super(ctx);
	}
}

class StartScreen extends RenderNode {
	constructor(ctx) {
		super(ctx);
		this.setActive(true);
		this.setOpacity(1);
		this.getRect().x = 0.25;
		this.getRect().y = 0.25;
		this.getRect().width = 0.5;
		this.getRect().height = 0.5;
	}

	renderToContext() {
		const ctx = this.getContext();
		const { width, height } = ctx.canvas;
		ctx.fillStyle = 'darkred';
		ctx.fillRect(0, 0, width, height);
	}
}

class Game extends BaseGame {
	constructor(ctx, wCtx) {
		super(ctx, wCtx);

		const c = RenderNode.buildCanvas(256, 256).getContext('2d');
		const start = new StartScreen(c);
		const screens = [ start ];
		this.add(...screens);

		/*
		const img = new Image();
		console.log(img);
		img.src = 'https://files.worldwildlife.org/wwfcmsprod/images/African_Elephant_Kenya_112367/story_full_width/qxyqxqjtu_WW187785.jpg';
		img.decode().then(e => {
			console.log('Decoded: ', e, img);
		});
		*/

		//const o = Classy.instantiate(StartScreen, this);
		//console.log('Test:', o);
		//console.log('Is Offscreen:', o.isOffscreen());

		// Activate screen, transition
	}
}
