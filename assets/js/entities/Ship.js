class Ship extends Urge.Sprite {
	#active = false;
	#skills = null;
	#health = 0;
	#screen = null;
	#lastSpacePressed = false;

	constructor(context, x, y, size, skills, screen) {
		super(context, x, y, size, size);
		this.#skills = skills;
		this.#health = skills.health;
		this.#screen = screen;
	}

	isActive() {
		return this.#active;
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

	update(instant) {
		const delta = this.getWidth() * 4 * instant.elapsed() / 1000;
		const canvas = this.getCanvas();
		if (this.#active) {
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
			const canvas = this.getCanvas();
			if (super.isPortrait()) {
				this.setX(Math.min((canvas.width) - this.getWidth() - sideLimit, Math.max(sideLimit, this.getX())));
				this.setY(Math.max((canvas.height * 0.6), Math.min(canvas.height - this.getWidth() - sideLimit, this.getY())));
			} else {
				this.setX(Math.min((canvas.width * 0.4) - this.getWidth(), Math.max(sideLimit, this.getX())));
				this.setY(Math.min(canvas.height - this.getWidth() - sideLimit, Math.max(sideLimit, this.getY())));
			}

			// TODO: cap the fire rate
			const spacePressed = Nucleus.Keys.checkKey(' ');
			if (spacePressed && !this.#lastSpacePressed) {
				this.#screen.post(MessageType.PLAYER_BULLET);
			}

			this.#lastSpacePressed = spacePressed;
		} else {
			const size = this.getWidth();
			const slow = delta / 5;
			if (this.isPortrait()) {
				this.offsetY(-slow);
				const startY = this.isPortrait() ? canvas.height - (size * 3) : (canvas.height - size) / 2;
				if (this.getY() <= startY) {
					this.setY(startY);
					this.#active = true;
				}
			} else {
				this.offsetX(slow);
				const startX = this.isPortrait() ? (canvas.width - size) / 2 : size * 2;
				if (this.getX() >= startX) {
					this.setX(startX);
					this.#active = true;
				}
			}
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
