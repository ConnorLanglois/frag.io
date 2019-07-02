class EventManager {
	constructor (element) {
		this._element = element;

		this._listeners = {};
	}

	add(listener, event) {
		const handler = listener[event.name].bind(listener);

		if (this._listeners[event.type] === undefined) {
			this._listeners[event.type] = [];	
		}

		this._listeners[event.type].push({
			listener: listener,
			handler: handler
		});

		this._element.addEventListener(event.type, handler);
	}

	remove(listener, event) {
		const listeners = this._listeners[event.type];
		const index = this.indexOf(listener, event);

		this._element.removeEventListener(event.type, listeners[index].handler);
		listeners.splice(index, 1);
	}

	indexOf(listener, event) {
		const listeners = this._listeners[event.type];

		for (var i = 0; i < listeners.length; i++) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}
	}
}
