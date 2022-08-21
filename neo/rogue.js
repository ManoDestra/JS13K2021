class Background extends RenderNode {
	constructor(ctx) {
		super(ctx);
	}
}

class StartScreen extends RenderNode {
	constructor(ctx) {
		super(ctx);
	}
}

class Game extends BaseGame {
	constructor(ctx, wCtx) {
		super(ctx, wCtx);

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
		const screens = [
			new StartScreen(this)
		];
		this.register(...screens);

		// Activate screen, transition
	}
}
