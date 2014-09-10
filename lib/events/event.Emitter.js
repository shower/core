/**
 * @fileOverview
 * Event emitter.
 */
modules.define('event.Emitter', [
    'event.Event',
    'event.EventGroup',
    'util.extend'
], function (provide, Event, EventGroup, extend) {

    /**
     * @name event.Emitter
     * @param {Object} [parameters]
     * @param {Object} [parameters.context]
     */
    function EventEmitter (parameters) {
        this._parameters = parameters || {};
        this._parent = null;
        this._listeners = {};
    }

    extend(EventEmitter.prototype, /** @lends event.Emitter.prototype */ {

        /**
         * @param {String | String[]} types
         * @param {Function} callback
         * @param {Object} [context]
         * @returns {event.Emitter}
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
         * @param {String | String[]} types
         * @param {Function} callback
         * @param {Object} [context]
         * @returns {event.Emitter}
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
         * @param {String} eventType
         * @param {Function} callback
         * @param {Object} [context]
         * @returns {event.Emitter}
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
         * @param {String} eventType
         * @param {event.Event|Object} eventObject
         */
        emit: function (eventType, eventObject) {
            var event = eventObject;
            if (!event || typeof event.get != 'function') {
                event = this.createEventObject(eventType, eventObject, this._parameters.context);
            }

            if (!event.isPropagationStopped()) {
                if (this._listeners.hasOwnProperty(eventType)) {
                    this._callListeners(this._listeners[eventType], event);
                }

                if (this._parent && !event.isPropagationStopped()) {
                    this._parent.emit(eventType, event);
                }
            }
        },

        /**
         * @param {String} type
         * @param {Object} eventData
         * @param {Object} target
         */
        createEventObject: function (type, eventData, target) {
            var data = {
                target: target,
                type: type
            };

            return new Event(eventData ? extend(data, eventData) : data);
        },

        /**
         * @param {event.Emitter} parent
         */
        setParent: function (parent) {
            if (this._parent != parent) {
                this._parent = parent;
            }
        },

        /**
         * @returns {event.Emitter | Null}
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
                for (var i = 0, l = listeners.lenght; i < l; i++) {
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
         * @param {String} eventType
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
