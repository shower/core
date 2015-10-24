modules.define('util.LocalStore', [
    'util.Store',
    'util.inherit'
], function (provide, Store, inherit) {

    /**
     * @class
     * @name util.LocalStore
     * @augment util.Store
     * @param {string} storeKey Local storage item key.
     * @param {object} [initData].
     */
    function LocalStore(storeKey, initData) {
        this._localStorageKey = storeKey;
        var data = this._loadFromLocalStorage() || initData;

        LocalStore.super.constructor.call(this, data);
    }

    inherit(LocalStore, Store, {
        set: function (key, value) {
            LocalStore.super.set.call(this, key, value);
            this._saveToLocalStorage();
        },

        unset: function (key) {
            LocalStore.super.unset.call(this, key);
            this._saveToLocalStorage();
        },

        _saveToLocalStorage: function () {
            window.localStorage.setItem(
                this._localStorageKey,
                JSON.stringify(this.getAll())
            );
        },

        _loadFromLocalStorage: function () {
            var store = window.localStorage.getItem(this._localStorageKey);
            return store && JSON.parse(store);
        }
    });

    provide(LocalStore);
});
