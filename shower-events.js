/**
 * Shower event bus and aspect weaver.
 *
 * @author Vladimir Kuznetsov <mistakster@gmail.com>
 * @license MIT license: github.com/shower/shower/wiki/MIT-License
 */
(function (s) {

	if (!s) {
		throw new Error('Shower not passed.');
	}

	var storage = {};

	var slice = [].slice;

	/**
	 * Subscribe to an event.
	 *
	 * @param {String} name of the event. Passing "all" will bind the callback to all events fired.
	 * @param {Function} callback to run when specified event will trigger
	 * @param {Object} [context] for callback
	 * @returns {Object} shower
	 */
	s.on = function (name, callback, context) {
		var events = storage[name] || (storage[name] = []);
		events.push({
			callback: callback,
			context: context,
			scope: context || this
		});
		return this;
	};

	/**
	 * Unsubscribe from event.
	 *
	 * @param {String} name of the event
	 * @param {Function} [callback] function previously attached for the event.
	 * @param {Object} [context]
	 * @returns {Object} shower
	 */
	s.off = function (name, callback, context) {
		var retain, ev, events, l, i;

		if (events = storage[name]) {
			storage[name] = retain = [];
			if (callback || context) {
				for (i = 0, l = events.length; i < l; i++) {
					ev = events[i];
					if ((callback && callback !== ev.callback) || (context && context !== ev.context)) {
						retain.push(ev);
					}
				}
			}
			if (!retain.length) {
				delete storage[name];
			}
		}

		return this;
	};

	/**
	 * Trigger event. Callbacks are passed the same arguments as trigger is, apart from the event name.
	 *
	 * @param {String} name of event to fire
	 * @returns {Object} shower
	 */
	s.trigger = function (name) {
		var events = storage[name],
			allEvents = storage.all;
		if (events) {
			triggerEvents(events, slice.call(arguments, 1));
		}
		if (allEvents) {
			triggerEvents(allEvents, arguments);
		}
		return this;
	};

	/**
	 * Run through events and invoke callback with passed arguments
	 *
	 * @param {Array} events to fire
	 * @param {*} args
	 */
	var triggerEvents = function (events, args) {
		var ev, i = -1, l = events.length;
		while (++i < l) {
			ev = events[i];
			ev.callback.apply(ev.scope, args);
		}
	};

	/**
	 * Aspect weaver. It wraps any shower method and add `before` and `after` aspects,
	 * which fires appropriate events.
	 * Example:
	 * shower.weaver('go');
	 * shower.on('go:before', function () { alert('before'); });
	 * shower.on('go:after', function () { alert('after'); });
	 * shower.go(1);
	 * shower.go(2);
	 *
	 * @param {String} method to be wrapped
	 * @returns {Object} shower
	 */
	s.weaver = function (method) {
		var original = s[method];
		if (!original) {
			throw new Error('Method "' + method + '" is not found.');
		}
		s[method] = function () {
			var args = slice.call(arguments);
			s.trigger.apply(s, [method + ':before'].concat(args));
			original.apply(this, args);
			s.trigger.apply(s, [method + ':after'].concat(args));
		};
		return this;
	};

}(window.shower));
