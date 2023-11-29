class Rogue19 extends UrgeGame {
	async init() {
	}

	render() {
		super.render();

		const opacity = 100;
		Object.assign(this.ctx, {
			font: 'bold 48px Segoe UI',
			strokeStyle: 'white',
			lineWidth: 2,
			//lineJoin: 'round',
			shadowColor: 'silver',
			shadowBlur: 5,
			shadowOffsetX: 5,
			shadowOffsetY: 5,
			fillStyle: 'white',
			textAlign: 'left',
			textBaseline: 'top',
			filter: `opacity(${opacity}%)`
		});

		if (GameTime.secondsChanged()) {
			console.log(GameTime.currentSeconds() + ' = ' + GameTime.fps());
		}

		const text = `FPS: ${GameTime.fpsAsInt()} - ${GameTime.currentSeconds()} Seconds`;
		const size = this.ctx.measureText(text);
		const border = 16;
		this.ctx.strokeText(text, border, border);
		//this.ctx.fillText(text, border, border);
	}
}
