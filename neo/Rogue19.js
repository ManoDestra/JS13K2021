class Rogue19 extends UrgeGame {
	async init() {
	}

	render() {
		super.render();

		Object.assign(this.ctx, {
			font: 'bold 48px Segoe UI',
			strokeStyle: 'silver',
			lineWidth: 2,
			fillStyle: 'white',
			textAlign: 'left',
			textBaseline: 'top'
		});

		if (GameTime.currentSeconds() !== GameTime.previousSeconds()) {
			console.log(GameTime.fps());
		}

		const text = `FPS: ${GameTime.fpsAsInt()} - ${GameTime.currentSeconds()} Seconds`;
		const size = this.ctx.measureText(text);
		const border = 10;
		this.ctx.strokeText(text, border, border);
	}
}
