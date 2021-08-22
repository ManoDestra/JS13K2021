const Nucleus = (() => {
	function $(selector, root) {
		const rootElement = typeof(root) === 'string' ? $(root) : root;
		const rootToUse = rootElement ?? document;
		return rootToUse.querySelector(selector) ?? document.getElementById(selector);
	}

	return {
		$
	};
})();

Nucleus.Model = (() => {
	function isObject(obj) {
		return typeof(obj) === 'object';
	}

	function isNonNullObject(obj) {
		return isObject(obj) && obj !== null;
	}

	function isFunction(obj) {
		return typeof(obj) === 'function';
	}

	function isString(obj) {
		return typeof(obj) === 'string';
	}

	function isNumber(obj) {
		return typeof(obj) === 'number';
	}

	function isBoolean(obj) {
		return typeof(obj) === 'boolean';
	}

	function isIdentifiable(objComponent) {
		let valid = true;
		valid = valid && isNonNullObject(objComponent);
		valid = valid && isFunction(objComponent.getId);
		return valid;
	}

	function getEmptyArray(size) {
		let arr = [];
		arr.length = size;
		return arr;
	}

	function getEmptyArray2d(sizeX, sizeY) {
		let arr = getEmptyArray(sizeX);
		for (let i = 0; i < arr.length; i++) {
			arr[i] = getEmptyArray(sizeY);
		}

		return arr;
	}

	function getEmptyArray3d(sizeX, sizeY, sizeZ) {
		let arr = getEmptyArray(sizeX);
		for (let i = 0; i < arr.length; i++) {
			arr[i] = getEmptyArray(sizeY);
			for (let j = 0; j < arr[i].length; j++) {
				arr[i][j] = getEmptyArray(sizeZ);
			}
		}

		return arr;
	}

	function getBit(value, index) {
		return (value >> index & 1) == 1;
	}

	return {
		isObject,
		isNonNullObject,
		isFunction,
		isString,
		isNumber,
		isBoolean,
		isIdentifiable,
		getEmptyArray,
		getEmptyArray2d,
		getEmptyArray3d,
		getBit
	};
})();

Nucleus.Clock = (() => {
	const DEFAULT_FRAME_RATE = 30;
	let active = false;
	const instant = {
		frame: 0,
		tick: 0,
		lastTick: 0,
		elapsed() {
			return this.tick - this.lastTick;
		},
		fps() {
			const e = this.elapsed();
			return e > 0 ? (1000 / e) : 60;
		}
	};
	let hook = undefined;

	function raf(e) {
		const func = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(e) {
				return setTimeout(e, parseInt(1000 / DEFAULT_FRAME_RATE));
			};
		return func(e);
	}

	function start(callback) {
		if (!active) {
			active = true;
			if (callback) {
				if (Nucleus.Model.isFunction(callback)) {
					hook = callback;
				} else {
					hook = undefined;
					console.warn('Callback Must Be A Function:', callback);
				}
			} else {
				hook = undefined;
			}

			instant.lastTick = instant.tick;
			instant.frame = raf(loop);
			console.log('Clock Started');
		} else {
			console.warn('Clock Is Already Started');
		}
	}

	function stop() {
		if (active) {
			active = false;
			console.log('Clock Stopped');
		} else {
			console.warn('Clock Is Already Stopped');
		}
	}

	function loop(tick) {
		if (active) {
			instant.lastTick = instant.tick;
			instant.tick = tick;
			instant.frame = raf(loop);
			if (hook) {
				hook(instant);
			}
		}
	}

	function isActive() {
		return active;
	}

	function getInstant() {
		return instant;
	}

	return {
		start,
		stop,
		isActive,
		getInstant
	};
})();

Nucleus.KeyInputHandler = (() => {
	let keyBindings = null;

	function handleKeyDown(e) {
		keyBindings[e.keyCode] = e;
	}

	function handleKeyUp(e) {
		keyBindings[e.keyCode] = undefined;
	}

	function start() {
		keyBindings = Nucleus.Model.getEmptyArray(256);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	}

	function stop() {
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
		keyBindings = null;
	}

	function checkCode(keyCode) {
		return keyBindings[keyCode] != undefined;
	}

	function checkKey(key, ignoreCase) {
		const ignoreCaseToUse = !!ignoreCase || ignoreCase;
		return keyBindings.filter(function(element) {
			return element != undefined && (ignoreCaseToUse ? element.key.toLowerCase() === key.toLowerCase() : element.key == key);
		}).length > 0;
	}

	function isShift() {
		return checkCode(16);
	}

	function isControl() {
		return checkCode(17);
	}

	function isAlt() {
		return checkCode(18);
	}

	return {
		start,
		stop,
		checkCode,
		checkKey,
		isShift,
		isControl,
		isAlt
	};
})();

Nucleus.MouseInputHandler = (() => {
	// TODO: work on scroll offset.
	// TODO: implement touch handler.

	const CACHE_SIZE = 10;

	let canvas;
	let inside = false;
	let pressed = false;
	let leftPressed = false;
	let rightPressed = false;
	let middlePressed = false;
	const positions = [];

	function start(canvasElement) {
		canvas = Nucleus.$(canvasElement);
		canvas.onmouseenter = handleMouseEnter;
		canvas.onmouseleave = handleMouseLeave;
		canvas.onmousedown = handleMouseDown;
		canvas.onmouseup = handleMouseUp;
		canvas.onmousemove = handleMouseMove;
	}

	function stop() {
		canvas.onmouseenter = null;
		canvas.onmouseleave = null;
		canvas.onmousedown = null;
		canvas.onmouseup = null;
		canvas.onmousemove = null;
		canvas = null;
		positions.length = 0;
	}

	function isInside() {
		return inside;
	}

	function isLeftPressed() {
		return leftPressed;
	}

	function isRightPressed() {
		return rightPressed;
	}

	function isMiddlePressed() {
		return middlePressed;
	}

	function handleMouseEnter(event) {
		inside = true;
	}

	function handleMouseLeave(event) {
		inside = false;
		leftPressed = false;
		rightPressed = false;
		middlePressed = false;
	}

	function handleMouseDown(event) {
		leftPressed = (event.buttons & 1) > 0;
		rightPressed = (event.buttons & 2) > 0;
		middlePressed = (event.buttons & 4) > 0;
	}

	function handleMouseUp(event) {
		leftPressed = false;
		rightPressed = false;
		middlePressed = false;
	}

	function handleMouseMove(event) {
		const currentPosition = getPosition(event);
		positions.push(currentPosition);
		if (positions.length > CACHE_SIZE) {
			positions.shift();
		}
	}

	function getPosition(event) {
		return {
			x : event.clientX - canvas.offsetLeft,
			y : event.clientY - canvas.offsetTop,
			toString : () => { return '[' + this.x + ', ' + this.y + ']'; }
		};
	}

	function getCurrentPosition() {
		if (positions.length > 0) {
			return positions[positions.length - 1];
		}

		return null;
	}

	function toString() {
		let out = '';
		out += 'Inside: ' + inside + '\r\n';
		out += 'Left Pressed: ' + leftPressed + '\r\n';
		out += 'Right Pressed: ' + rightPressed + '\r\n';
		out += 'Middle Pressed: ' + middlePressed + '\r\n';
		for (let i = 0; i < positions.length; i++) {
			out += positions[i] + '\r\n';
		}

		return out;
	}

	return {
		start,
		stop,
		isInside,
		isLeftPressed,
		isRightPressed,
		isMiddlePressed,
		positions,
		getCurrentPosition,
		toString
	};
})();

Nucleus.PointerLock = (function() {
	let element = null;
	let changeHook = null;
	let movement = {
		x : 0,
		y : 0
	};

	function handleMouseMove(e) {
		movement = {
			x : e.movementX,
			y : e.movementY
		};
	}

	function handleClick(e) {
		if (element) {
			if (document.pointerLockElement == null) {
				element.requestPointerLock();
			} else {
				console.log('Click:', e);
			}
		}
	}

	function handleError(e) {
		console.error(e);
	}

	function handleChange(e) {
		const activated = document.pointerLockElement != null;
		if (activated) {
			element.addEventListener('mousemove', handleMouseMove, false);
		} else {
			movement = {
				x : 0,
				y : 0
			};
			element.removeEventListener('mousemove', handleMouseMove);
		}

		if (Nucleus.Model.isFunction(changeHook)) {
			changeHook(activated);
		}
	}

	function start(selector, changeHandler) {
		changeHook = changeHandler;
		element = Nucleus.$(selector);
		if (element && 'onclick' in element && document.pointerLockElement == null) {
			if ('onpointerlockerror' in document) {
				document.addEventListener('pointerlockerror', handleError, false);
			}

			if ('onpointerlockchange' in document) {
				document.addEventListener('pointerlockchange', handleChange, false);
			}

			element.addEventListener('click', handleClick, false);
		}
	}

	function stop() {
		if (document.pointerLockElement) {
			document.exitPointerLock();
		}
	}

	function getMovement() {
		const existingX = movement.x;
		const existingY = movement.y;
		movement = {
			x: 0,
			y: 0
		};
		return {
			x: existingX,
			y: existingY
		};
	}

	return {
		start,
		stop,
		getMovement
	};
})();
