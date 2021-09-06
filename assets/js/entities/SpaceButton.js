class SpaceButton extends Urge.Sprite {
	constructor(context) {
		super(context);
	}

	update(instant) {
	}

	render(instant) {
		const portrait = this.isPortrait();
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		const width = portrait ? canvas.width / 2 : canvas.width / 3;
		const height = portrait ? width / 3 : width / 3;
		const x = (canvas.width - width) / 2;
		const y = (canvas.height - height) / 2;
		ctx.lineWidth = 10;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'black';
		ctx.strokeRect(x, y, width, height);
		ctx.fillRect(x, y, width, height);

		ctx.lineWidth = 5;
		ctx.strokeStyle = 'silver';
		ctx.fillStyle = 'white';
		const fontSize = parseInt(height * 2 / 3);
		const text = 'SPACE';
		ctx.font = fontSize + 'px Segoe UI';
		const textSize = ctx.measureText(text);
		if (instant.frame % 120 == 0) {
			console.log(textSize);
		}
		const offsetX = (width - textSize.width) / 2
		const offsetY = fontSize + ((height - fontSize) / 2);
		ctx.strokeText(text, x + offsetX, y + offsetY);
	}
}
