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
	function isFunction(obj) {
		return typeof(obj) === 'function';
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
		isFunction,
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
		return keyBindings.filter(element => {
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

Nucleus.Cryo = class {
	constructor() {
	}

	static getAll(namespace = '', persist = true) {
		const prefix = namespace ? namespace + '.' : '';
		const storage = Nucleus.Cryo.#getStorage(persist);
		const all = {};
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			const value = storage.getItem(key);
			const model = JSON.parse(value);
			all[key] = model;
		}

		return all;
	}

	static get(key, namespace = '', persist = true) {
		const keyToUse = Nucleus.Cryo.#getKey(key, namespace);
		const storage = Nucleus.Cryo.#getStorage(persist);
		const value = storage.getItem(keyToUse);
		return JSON.parse(value);
	}

	static set(key, model, namespace = '', persist = true) {
		const keyToUse = Nucleus.Cryo.#getKey(key, namespace);
		const storage = Nucleus.Cryo.#getStorage(persist);
		const value = JSON.stringify(model);
		storage.setItem(keyToUse, value);
	}

	static remove(key, namespace = '', persist = true) {
		const keyToUse = Nucleus.Cryo.#getKey(key, namespace);
		const storage = Nucleus.Cryo.#getStorage(persist);
		storage.removeItem(keyToUse);
	}

	static removeByNamespace(namespace = '', persist = true) {
		//TODO: code
	}

	static removeAll(persist = true) {
		const storage = Nucleus.Cryo.#getStorage(persist);
		storage.clear();
	}

	static #getStorage(persist = true) {
		return persist ? localStorage : sessionStorage;
	}

	static #getKey(key, namespace = '') {
		const prefix = namespace ? namespace + '.' : '';
		return prefix + key;
	}
};

Nucleus.Storage = (() => {
	function get(id, persist) {
		let objOut;
		const storage = getStorage(persist);
		if (storage) {
			const strOut = storage.getItem(id);
			if (Nucleus.Model.isString(strOut)) {
				objOut = JSON.parse(strOut);
			}
		}

		if (!Nucleus.Model.isObject(objOut)) {
			objOut = null;
		}

		return objOut;
	}

	function set(id, value, persist) {
		const storage = getStorage(persist);
		if (storage) {
			const strValue = JSON.stringify(value);
			storage.setItem(id, strValue);
		}
	}

	function remove(id, persist) {
		const storage = getStorage(persist);
		if (storage) {
			storage.removeItem(id);
		}
	}

	function clear(persist) {
		const storage = getStorage(persist);
		if (storage) {
			storage.clear();
		}
	}

	function getStorage(persist = true) {
		const storage = persist ? localStorage : sessionStorage;
		return storage ? storage : null;
	}

	return {
		get,
		set,
		remove,
		clear
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

	return {
		start,
		stop,
		isInside,
		isLeftPressed,
		isRightPressed,
		isMiddlePressed,
		positions,
		getCurrentPosition
	};
})();

Nucleus.PointerLock = (() => {
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
