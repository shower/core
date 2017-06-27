import Store from './store';

const loadFromStorage = storeKey => {
    const store = sessionStorage.getItem(storeKey);
    return store && JSON.parse(store);
};

/**
 * @class
 * @name SessionStore
 * @augment Store
 * @param {string} storeKey Local storage item key.
 * @param {object} [initData].
 */
class SessionStore extends Store {
    constructor(storeKey, initData) {
        const data = loadFromStorage(storeKey) || initData;
        super(data);
        this._storeKey = storeKey;
    }

    set(key, value) {
        super.set(key, value);
        this._saveToStorage();
    }

    unset(key) {
        super.unset(key);
        this._saveToStorage();
    }

    _saveToStorage() {
        sessionStorage.setItem(
            this._storeKey,
            JSON.stringify(this.getAll())
        );
    }
}

export default SessionStore;
