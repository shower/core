/**
 * Shower event bus and aspect weaver.
 *
 * @author Vladimir Kuznetsov <mistakster@gmail.com>
 * @license MIT license: github.com/shower/shower/wiki/MIT-License
 */
(function (s) {

	var storage = {};

	/**
	 * Subscribe to an event.
	 *
	 * @param {String} name of the event. Passing "all" will bind the callback to all events fired.
	 * @param {Function} callback to run when specified event will trigger
	 * @param {Object} [context] for callback
	 * @returns {Object} execution context
	 */
	s.on = function(name, callback, context) {
		var events = storage[name] || (storage[name] = []);
		events.push({callback: callback, context: context, ctx: context || this});
		return this;
	};

	/**
	 * Unsubscribe from event.
	 *
	 * @param {String} name of the event
	 * @param {Function} [callback]
	 * @param {Object} [context]
	 * @returns {Object} execution context
	 */
	s.off = function(name, callback, context) {
		var retain, ev, events, i, j;

		if (events = storage[name]) {
			storage[name] = retain = [];
			if (callback || context) {
				for (j = 0, i = events.length; j < i; j++) {
					ev = events[j];
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
	 * @returns {Object} execution context
	 */
	s.trigger = function (name) {
		var args = slice.call(arguments, 1);
		var events = storage[name];
		var allEvents = storage.all;
		if (events) {
			triggerEvents(events, args);
		}
		if (allEvents) {
			triggerEvents(allEvents, arguments);
		}
		return this;
	};

	var slice = [].slice;

	var triggerEvents = function(events, args) {
		var ev, i = -1, l = events.length;
		while (++i < l) {
			ev = events[i];
			ev.callback.apply(ev.ctx, args);
		}
	};


	/**
	 * Aspect weaver. It wraps any shower method with `before` and `after` aspects, which fires appropriate events.
	 * Example:
	 * shower.weaver('go');
	 * shower.on('go:before', function () { alert('before'); });
	 * shower.on('go:after', function () { alert('after'); });
	 * shower.go(1);
	 * shower.go(2);
	 *
	 * @param {String} method to be wrapped
	 * @returns {Object} execution context
	 */
	s.weaver = function (method) {
		var original = s[method];
		s[method] = function () {
			s.trigger(method + ':before');
			original.apply(this, arguments);
			s.trigger(method + ':after');
		};
		return this;
	}

}(window.shower));