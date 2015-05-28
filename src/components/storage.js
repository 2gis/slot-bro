import { Component } from 'baseComponent';

/**
 * Storage wrapper with some sugar
 */
export class Storage extends Component {
    constructor(...args) {
        super(...args);
        var StorageBase = this._app.getLib('storage').Storage;
        this._storage = new StorageBase(kango.storage);
    }

    getItem(...args) {
        return this._storage.getItem(...args);
    }

    setItem(...args) {
        this._storage.setItem(...args);
    }
}
