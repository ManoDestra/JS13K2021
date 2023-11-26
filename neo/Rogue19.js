class Rogue19 extends UrgeGame {
	render() {
		this.ctx.fillStyle = '#111';
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.ctx.font = '50px Segoe UI';
		this.ctx.fillStyle = 'white';
		const text = `FPS: ${GameTime.fpsAsInt()} - ${GameTime.currentSeconds()} Seconds`;
		const size = this.ctx.measureText(text);
		this.ctx.fillText(text, 20, 60);
	}
}
