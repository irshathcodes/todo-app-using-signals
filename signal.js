// Global variable to keep track of the currently accessed computed value
let currentAccessed = null;
const effectQueue = [];

class Signal {
	constructor(initialValue) {
		this._value = initialValue;
		this._dependents = [];
	}

	get value() {
		if (currentAccessed) {
			this._addDependent(currentAccessed);
		}
		return this._value;
	}

	set value(newValue) {
		if (this._value !== newValue) {
			this._value = newValue;
			this._notifyDependents();
			runEffects();
		}
	}

	_addDependent(computed) {
		if (!this._dependents.includes(computed)) {
			this._dependents.push(computed);
		}
	}

	_removeDependent(computed) {
		this._dependents = this._dependents.filter((dep) => dep !== computed);
	}

	_notifyDependents() {
		for (const dependent of this._dependents) {
			dependent._update();
		}
	}
}

export function createSignal(initialValue) {
	return new Signal(initialValue);
}

class Computed {
	constructor(computeFn) {
		this._computeFn = computeFn;
		this._value = undefined;
		this._isStale = true;
	}

	get value() {
		if (this._isStale) {
			currentAccessed = this;
			this._recomputeValue();
			currentAccessed = null;
		}
		return this._value;
	}

	_recomputeValue() {
		this._value = this._computeFn();
		this._isStale = false;
	}

	_update() {
		this._isStale = true;
	}
}
export function createComputed(computeFn) {
	return new Computed(computeFn);
}

class Effect {
	constructor(effectFn) {
		this._effectFn = effectFn;
		this._isStale = true;
		this._execute();
	}

	_execute() {
		if (this._isStale) {
			currentAccessed = this;
			this._effectFn();
			currentAccessed = null;
		}
		this._isStale = false;
	}

	_update() {
		this._isStale = true;
		effectQueue.push(this);
	}
}

function runEffects() {
	while (effectQueue.length > 0) {
		const effect = effectQueue.shift();
		effect._execute();
	}
}

export function createEffect(effectFn) {
	return new Effect(effectFn);
}
