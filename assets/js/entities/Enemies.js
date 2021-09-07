class Enemy extends Urge.Sprite {
	#health;

	constructor(context, x, y, width, height, health) {
		super(context, x, y, width, height);
		this.#health = health;
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
}

class Cell extends Enemy {
	constructor(context, x, y, size, health) {
		super(context, x, y, size, size, health);
	}

	update(instant) {
		const limit = this.isPortrait() ? this.getHeight() : this.getWidth();
		const movement = limit * instant.elapsed() * 2 / 1000;
		if (super.isPortrait()) {
			this.offsetY(movement);
		} else {
			this.offsetX(-movement);
		}
	}

	render(instant) {
		const ctx = super.getContext();
		const center = this.getBoundingBox().getCenter();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'darkred';
		ctx.beginPath();
		ctx.arc(center[0], center[1], this.getWidth() / 2, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
}
