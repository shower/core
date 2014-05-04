/**
 * @fileOverview
 * Event emitter.
 */
modules.define('event.Emitter', [
    'event.Event'
], function (provide) {

    /**
     * 
     * @param {event.Emitter} parent
     */
    function EventEmitter (parent) {
        this._parent = parent;
        this._listeners = {};
    }

    EventEmitter.prototype = {
        /**
         * @param {String | String[]} types
         * @param {Function} callback
         * @param {Object} [context]
         * @returns {event.Emitter}
         */
        add: function (types, callback, context) {
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
        remove: function (types, callback, context) {
            if (typeof types == 'string') {
                this._removeListener(types, callback, context);
            } else {
                for (var i = 0, l = types.length; i < l; i++) {
                    this._removeLIstener(types[i], callback, context);
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
                this.remove(eventType, handler, this);
                if (context) {
                    callback.call(context, event);
                } else {
                    callback(event);
                }
            };
            this.add(eventType, handler, this);
            return this;
        }

        /**
         * @param {Object} data
         */
        fire: function (eventType, data) {
            var event = new Event(data);
            if (this._listeners.hasOwnProperty(eventType)) {
                var listeners = this._listeners[eventType];
                for (var i = 0, l = listeners.length; i < l; i++) {
                    var listener = listeners[i];
                    if (listener.context) {
                        listener.callback.call(listener.context, event);
                    } else {
                        listener.callback(event);
                    }
                }
            }

            if (this._parent && !event.defaultPrevented()) {
                this._parent.fire(eventType, event);
            }
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
            if (this._listeners.hasOwnProperty(type)) {
                delete this._listeners[type];
            }
        }
    };

    provide(EventEmitter);
});
