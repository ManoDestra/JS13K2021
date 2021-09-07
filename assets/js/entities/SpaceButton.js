class SpaceButton extends Urge.Sprite {
	#totalElapsed = 0;
	#delay = 3000;
	#duration = 5000;

	constructor(context) {
		super(context);
	}

	update(instant) {
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		if (this.#totalElapsed > this.#delay) {
			const portrait = this.isPortrait();
			const canvas = this.getCanvas();
			const ctx = this.getContext();
			const width = portrait ? canvas.width / 2 : canvas.width / 3;
			const height = portrait ? width / 3 : width / 3;
			const x = (canvas.width - width) / 2;
			const y = (canvas.height - height) / 2;
			const fontName = 'sans-serif';
			const fontSize = parseInt(height * 2 / 3);
			const text = 'SPACE';

			const ratio = Math.min(1, (this.#totalElapsed - this.#delay) / this.#duration);

			const white = 'rgba(255, 255, 255, ' + ratio + ')';
			const black = 'rgba(0, 0, 0, ' + ratio + ')';
			const silver = 'rgba(192, 192, 192, ' + ratio + ')';

			ctx.lineWidth = 10;
			ctx.strokeStyle = white;
			ctx.fillStyle = black;
			ctx.strokeRect(x, y, width, height);
			ctx.fillRect(x, y, width, height);

			ctx.lineWidth = 5;
			ctx.strokeStyle = silver;
			ctx.fillStyle = white;
			ctx.font = fontSize + 'px ' + fontName;
			const textSize = ctx.measureText(text);
			const offsetX = (width - textSize.width) / 2
			const offsetY = fontSize + ((height - fontSize) / 2);
			ctx.strokeText(text, x + offsetX, y + offsetY);
		}
	}
}