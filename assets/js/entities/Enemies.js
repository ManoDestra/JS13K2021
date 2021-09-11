class Enemy extends Urge.Sprite {
	#health;
	#velocity;

	constructor(context, x, y, width, height, health, velocity) {
		super(context, x, y, width, height);
		this.#health = health;
		this.#velocity = velocity;
	}

	getHealth() {
		return this.#health;
	}

	getVelocity() {
		return this.#velocity;
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
	#points = [];

	constructor(context, x, y, size, health, velocity) {
		super(context, x, y, size, size, health, velocity);
		const center = [200, 200];
		const minRadius = 40;
		const maxRadius = 70;
		const count = 18;
		for (let i = 0; i < count; i++) {
			const angle = Math.PI * 2 * i / count;
			const length = minRadius + (Math.random() * (maxRadius - minRadius));
			const x = Math.cos(angle) * length;
			const y = Math.sin(angle) * length;
			this.#points.push([x, y]);
		}
	}

	update(instant) {
		const movement = this.getWidth() * this.getVelocity() * (instant.elapsed() / 1000);
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
