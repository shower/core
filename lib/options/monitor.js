/**
 * @class Monitoring fields change.
 *
 * Changes monitoring in options.
 *
 * @name Monitor
 * @param {Options} options
 */
class Monitor {
    constructor(options) {
        this._options = options;
        this._optionsEvents = options.events.group()
            .on(['set', 'unset'], this._onOptionsChange, this);

        this._fieldsHanders = {};
    }

    destroy() {
        this._options = null;
        this._optionsEvents.offAll();
        this._fieldsHanders = null;
    }

    /**
     * @param {(string|string[])} field
     * @param {function} callback
     * @param {Object} [context]
     * @returns {Monitor} Self.
     */
    add(fields, callback, context) {
        [].concat(fields).forEach(field => {
            this._addHandler(field, callback, context);
        });

        return this;
    }

    /**
     * @param {(string|string[])} field
     * @param {function} callback
     * @param {object} [context]
     * @returns {Monitor} Self.
     */
    remove(fields, callback, context) {
        [].concat(fields).forEach(field => {
            this._removeHandler(field, callback, context);
        });

        return this;
    }

    /**
     * @returns {Options} Options.
     */
    getOptions() {
        return this._options;
    }

    _onOptionsChange(event) {
        const fieldsUpdated = event.get('type') === 'unset' ?
            [event.get('name')] :
            event.get('items');

        fieldsUpdated.forEach(field => {
            if (this._fieldsHanders.hasOwnProperty(field)) {
                this._fieldsHanders[field].forEach(handler => {
                    handler.callback.call(handler.context, this._options.get(field));
                });
            }
        });
    }

    _addHandler(field, callback, context) {
        const handler = {callback, context};

        if (this._fieldsHanders.hasOwnProperty(field)) {
            this._fieldsHanders[field].push(handler);
        } else {
            this._fieldsHanders[field] = [handler];
        }
    }

    _removeHandler(field, callback, context) {
        if (!this._fieldsHanders.hasOwnProperty(field)) {
            throw new Error(`Remove undefined handler for ${field} field`);
        }

        const handlers = this._fieldsHanders[field];
        const index = handlers.findIndex(handler => {
            return handler.callback === callback &&
                handler.context === context;
        });

        if (index === -1) {
            throw new Error(`Hanlder for ${field} not found.`);
        }

        handlers.splice(index, 1);
    }
}

export default Monitor;
