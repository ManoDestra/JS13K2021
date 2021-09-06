class StarField extends Urge.RenderComponent {
	constructor(context, options) {
		super(context);
		this.x = 0;
		this.y = 0;
		this.image = options.image;
		this.scrollSeconds = options?.scrollSeconds ?? 10;
	}

	update(instant) {
		const portrait = super.isPortrait();
		const pixelCount = parseFloat((portrait ? super.getCanvas().height : super.getCanvas().width) / this.scrollSeconds);
		const pixelsToMove = pixelCount * instant.elapsed() / 1000;
		if (portrait) {
			this.x = 0;
			this.y += pixelsToMove;
		} else {
			this.y = 0;
			this.x -= pixelsToMove;
		}

		while (this.x < -super.getCanvas().width) {
			this.x += super.getCanvas().width;
		}

		while (this.y > super.getCanvas().height) {
			this.y -= super.getCanvas().height;
		}
	}

	render(instant) {
		super.getContext().drawImage(this.image, this.x, this.y, super.getCanvas().width, super.getCanvas().height);
		if (super.isPortrait()) {
			super.getContext().drawImage(this.image, this.x, this.y - super.getCanvas().height, super.getCanvas().width, super.getCanvas().height);
		} else {
			super.getContext().drawImage(this.image, this.x + super.getCanvas().width, this.y, super.getCanvas().width, super.getCanvas().height);
		}
	}
}
