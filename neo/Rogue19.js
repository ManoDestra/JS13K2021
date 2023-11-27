class Rogue19 extends UrgeGame {
	async init() {
	}

	render() {
		super.render();

		this.ctx.font = '50px Segoe UI';
		this.ctx.fillStyle = 'white';
		const text = `FPS: ${GameTime.fpsAsInt()} - ${GameTime.currentSeconds()} Seconds`;
		const size = this.ctx.measureText(text);
		this.ctx.fillText(text, 20, 60);
	}
}
