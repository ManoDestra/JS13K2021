class PlayerBullet extends Urge.Sprite {
	constructor(context, x, y, width, height) {
		super(context, x, y, width, height);
	}

	update(instant) {
		const bulletSpeed = 40;
		const ratio = bulletSpeed * instant.elapsed() / 1000;
		if (super.isPortrait()) {
			this.offsetY(-this.getHeight() * ratio);
		} else {
			this.offsetX(this.getWidth() * ratio);
		}
	}

	render(instant) {
		const ctx = super.getContext();
		ctx.fillStyle = 'yellow';
		if (super.isPortrait()) {
			ctx.fillRect(this.getX() - this.getWidth(), this.getY() - this.getHeight(), this.getWidth(), this.getHeight());
		} else {
			ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
		}
	}
}
