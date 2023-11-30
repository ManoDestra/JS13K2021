class Rogue19 extends UrgeGame {
	#img;

	async init() {
		const imageData = new ImageData(192 * 16 / 9, 192);
		const { data } = imageData;
		for (let i = 0; i < data.length; i += 4) {
			data[i] = 192;
			data[i + 1] = 0;
			data[i + 2] = 0;
			data[i + 3] = 255;
		}

		const test = await fetch('Landscape.jpg').then(s => s.blob()).then(createImageBitmap);
		const test2 = await createImageBitmap(imageData);
		this.img = test;
		return this.img;
	}

	render() {
		super.render();

		this.ctx.save();

		//const opacity = 100;
		//const value = 100 - parseInt(GameTime.current() / 100);
		const value = parseInt(GameTime.current() / 100);
		Object.assign(this.ctx, {
			font: 'bold 48px Segoe UI',
			strokeStyle: 'cornflowerblue',
			lineWidth: 2,
			//lineJoin: 'round',
			shadowColor: 'silver',
			shadowBlur: 5,
			shadowOffsetX: 5,
			shadowOffsetY: 5,
			fillStyle: 'white',
			textAlign: 'left',
			textBaseline: 'top',
			filter: `sepia(${value}%)`
		});

		if (GameTime.secondsChanged()) {
			console.log(GameTime.currentSeconds() + ' = ' + GameTime.fps());
		}

		const text = `FPS: ${GameTime.fpsAsInt()} - ${GameTime.currentSeconds()} Seconds`;
		const size = this.ctx.measureText(text);
		const border = 8;

		this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
		this.ctx.strokeText(text, border, border);
		//this.ctx.fillText(text, border, border);

		this.ctx.restore();

		//this.ctx.drawImage(this.img, 512, 128);
	}
}
