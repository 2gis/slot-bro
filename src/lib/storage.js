/**
 * Storage wrapper with some sugar
 */
export class Storage {
    constructor(storage) {
        this._storage = storage;
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    getItem(key) {
        if (key.indexOf('.') == -1) {
            return this._storage.getItem(key);
        }

        var item = this._storage.getItem(key.split('.')[0]);
        try {
            item = JSON.parse(item);
        } catch (e) {
            return null;
        }

        return Storage._findInTree(item, key.split('.').slice(1));
    }

    /**
     *
     * @param key
     * @param value
     * @returns {*}
     */
    setItem(key, value) {
        if (key.indexOf('.') == -1) {
            return this._storage.setItem(key, value);
        }

        var currentValue = this.getItem(key.split('.')[0]);
        Storage._setInTree(currentValue, key.split('.').slice(1), value);
        this._storage.setItem(key.split('.')[0], currentValue);
    }

    /**
     *
     * @param tree
     * @param pieces
     * @returns {*}
     * @private
     */
    static _findInTree(tree, pieces) {
        var result = tree;

        for (var i = 0; i < pieces.length; i++) {
            result = result[pieces[i]];
            if (result === undefined) {
                break;
            }
        }

        return result;
    }

    /**
     *
     * @param tree
     * @param pieces
     * @param value
     * @private
     */
    static _setInTree(tree, pieces, value) {
        var result = tree;

        for (var i = 0; i < pieces.length - 1; i++) {
            if (result[pieces[i]] === undefined) {
                result = result[pieces[i]] = {};
            } else {
                result = result[pieces[i]];
            }
        }

        result[pieces[pieces.length - 1]] = value;
    }
}
