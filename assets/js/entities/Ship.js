class Ship extends Urge.Sprite {
	#skills = null;
	#health = 0;
	#send = null;

	constructor(context, x, y, size, skills, send) {
		super(context, x, y, size, size);
		this.#skills = skills;
		this.#health = skills.health;
		this.#send = send;
	}

	getHealth() {
		return this.#health;
	}

	reduceHealth(damage) {
		this.#health -= Math.abs(damage);
		this.#health = Math.max(0, this.#health);
	}

	isAlive() {
		return this.getHealth() > 0;
	}

	getSize() {
		return (super.isPortrait() ? super.getCanvas().height : super.getCanvas().width) / 25;
	}

	update(instant) {
		this.size = this.getSize();
		const delta = this.getWidth() * 4 * instant.elapsed() / 1000;
		if (Nucleus.Keys.checkKey('w')) {
			this.offsetY(-delta);
		}

		if (Nucleus.Keys.checkKey('s')) {
			this.offsetY(delta);
		}

		if (Nucleus.Keys.checkKey('a')) {
			this.offsetX(-delta);
		}

		if (Nucleus.Keys.checkKey('d')) {
			this.offsetX(delta);
		}

		const sideLimit = 10;
		const canvas = super.getCanvas();
		if (super.isPortrait()) {
			this.setX(Math.min((canvas.width) - this.getWidth() - sideLimit, Math.max(sideLimit, this.getX())));
			this.setY(Math.max((canvas.height * 0.6), Math.min(canvas.height - this.getWidth() - sideLimit, this.getY())));
		} else {
			this.setX(Math.min((canvas.width * 0.4) - this.getWidth(), Math.max(sideLimit, this.getX())));
			this.setY(Math.min(canvas.height - this.getWidth() - sideLimit, Math.max(sideLimit, this.getY())));
		}

		// TODO: handle the fire rate
		// TODO: change to user controller firing, rather than hold to fire?
		if (Nucleus.Keys.checkKey(' ') && instant.frame % 30 == 0) {
			this.#send('PLAYER_BULLET');
		}
	}

	render(instant) {
		const points = super.isPortrait() ? [
			[this.getX() + this.getWidth(), this.getY() + this.getWidth()],
			[this.getX() + (this.getWidth() / 2), this.getY() + (this.getWidth() * 2 / 3)],
			[this.getX(), this.getY() + this.getWidth()],
			[this.getX() + (this.getWidth() / 2), this.getY()]
		] : [
			[this.getX(), this.getY() + this.getWidth()],
			[this.getX() + (this.getWidth() / 3), this.getY() + (this.getWidth() / 2)],
			[this.getX(), this.getY()],
			[this.getX() + this.getWidth(), this.getY() + (this.getWidth() / 2)]
		];
		const ctx = super.getContext();
		ctx.strokeStyle = 'cornflowerblue';
		ctx.lineWidth = 3;
		ctx.fillStyle = 'darkgreen';
		ctx.beginPath();
		ctx.moveTo(points[3][0], points[3][1]);
		points.forEach(p => {
			ctx.lineTo(p[0], p[1]);
			ctx.stroke();
		});
		ctx.fill();
		ctx.closePath();
	}
}
