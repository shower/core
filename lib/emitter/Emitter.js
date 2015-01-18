/**
 * @file Event emitter.
 */
modules.define('Emitter', [
    'emitter.Event',
    'emitter.EventGroup',
    'util.extend'
], function (provide, EmitterEvent, EventGroup, extend) {

    /**
     * @class
     * @name emitter.Emitter
     *
     * Event emitter. Handle events, emit custom events and other.
     *
     * @param {object} [parameters]
     * @param {object} [parameters.context]
     * @param {object} [parameters.parent]
     */
    function EventEmitter (parameters) {
        parameters = parameters || {};

        this._context = parameters.context;
        this._parent = parameters.parent;

        this._listeners = {};
    }

    extend(EventEmitter.prototype, /** @lends Emitter.prototype */ {

        /**
         * Add event (events) listener.
         *
         * @param {(string | string[])} types Event name or array of event names.
         * @param {function} callback
         * @param {object} [context] Callback context.
         * @returns {Emitter}
         */
        on: function (types, callback, context) {
            if (typeof types == 'string') {
                this._addListener(types, callback, context);
            } else {
                for (var i = 0, l = types.length; i < l; i++) {
                    this._addListener(types[i], callback, context);
                }
            }
            return this;
        },

        /**
         * Remove event (events) listener.
         *
         * @param {(string|string[])} types Event name or array of event names.
         * @param {function} callback
         * @param {object} [context] Callback context.
         * @returns {Emitter}
         */
        off: function (types, callback, context) {
            if (typeof types == 'string') {
                this._removeListener(types, callback, context);
            } else {
                for (var i = 0, l = types.length; i < l; i++) {
                    this._removeListener(types[i], callback, context);
                }
            }

            return this;
        },

        /**
         * Add event listener. Callback will run once and after remove auto.
         *
         * @param {(string|string[])} eventType Event name or array of event names.
         * @param {function} callback
         * @param {object} [context] Callback context.
         * @returns {Emitter}
         */
        once: function (eventType, callback, context) {
            var handler = function (event) {
                this.off(eventType, handler, this);
                if (context) {
                    callback.call(context, event);
                } else {
                    callback(event);
                }
            };
            this.on(eventType, handler, this);
            return this;
        },

        /**
         * Fire all handlers who listen that event type.
         *
         * @param {string} eventType
         * @param {(event.Event|object)} eventObject
         */
        emit: function (eventType, eventObject) {
            var event = eventObject,
                listeners = this._listeners;

            if (!event || typeof event.get != 'function') {
                event = this.createEventObject(eventType, eventObject, this._context);
            }

            if (!event.isPropagationStopped()) {
                if (listeners.hasOwnProperty(eventType)) {
                    this._callListeners(listeners[eventType], event);
                }

                if (this._parent && !event.isPropagationStopped()) {
                    this._parent.emit(eventType, event);
                }
            }
        },

        /**
         * @param {string} type
         * @param {object} eventData
         * @param {object} target
         */
        createEventObject: function (type, eventData, target) {
            var data = {
                target: target,
                type: type
            };

            return new EmitterEvent(eventData ? extend(data, eventData) : data);
        },

        /**
         * @param {Emitter} parent
         */
        setParent: function (parent) {
            if (this._parent != parent) {
                this._parent = parent;
            }
        },

        /**
         * @returns {(Emitter|null)}
         */
        getParent: function () {
            return this._parent;
        },

        group: function () {
            return new EventGroup(this);
        },

        _addListener: function (eventType, callback, context) {
            var listener = {
                callback: callback,
                context: context
            };

            if (this._listeners[eventType]) {
                this._listeners[eventType].push(listener);
            } else {
                this._listeners[eventType] = [listener];
            }
        },

        _removeListener: function (eventType, callback, context) {
            var listeners = this._listeners[eventType];
            if (listeners) {
                var foundIndex = -1;
                for (var i = 0, l = listeners.length; i < l; i++) {
                    if (listeners[i].callback == callback && listeners[i].context == context) {
                        foundIndex = i;
                    }
                }

                if (foundIndex != -1) {
                    if (listeners.length == 1) {
                        this._clearType(eventType);
                    } else {
                        listeners.slice(foundIndex, 1);
                    }
                }
            }
        },

        /**
         * @ignore
         * @param {string} eventType
         */
        _clearType: function (eventType) {
            if (this._listeners.hasOwnProperty(eventType)) {
                delete this._listeners[eventType];
            }
        },

        _callListeners: function (listeners, event) {
            var i = listeners.length - 1;

            while (i >= 0 && !event.defaultPrevented()) {
                var listener = listeners[i];
                if (listener) {
                    if (listener.context) {
                        listener.callback.call(listener.context, event);
                    } else {
                        listener.callback(event);
                    }
                }
                i--;
            }
        }
    });

    provide(EventEmitter);
});
