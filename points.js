		const minRadius = 40;
		const maxRadius = 70;
		const count = 18;
		for (let i = 0; i < count; i++) {
			const angle = Math.PI * 2 * i / count;
			const length = minRadius + (Math.random() * (maxRadius - minRadius));
			const x = 200 + Math.cos(angle) * length;
			const y = 200 + Math.sin(angle) * length;
			this.#points.push([x, y]);
		}

		ctx.moveTo(this.#points[0][0], this.#points[0][1]);
		for (let i = 0; i < this.#points.length; i++) {
			const nextIndex = (i + 1) % this.#points.length;
			const x_mid = (this.#points[i][0] + this.#points[nextIndex][0]) / 2;
			const y_mid = (this.#points[i][1] + this.#points[nextIndex][1]) / 2;
			const cp_x1 = (x_mid + this.#points[i][0]) / 2;
			const cp_x2 = (x_mid + this.#points[nextIndex][0]) / 2;
			ctx.quadraticCurveTo(cp_x1, this.#points[i][1], x_mid, y_mid);
			ctx.quadraticCurveTo(cp_x2, this.#points[nextIndex][1], this.#points[nextIndex][0], this.#points[nextIndex][1]);
		}

		ctx.stroke();
