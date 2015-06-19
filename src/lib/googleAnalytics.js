import _ from 'lodash';
import { TimeoutQueue } from "../lib/timeoutQueue";

const userIdStorageKey = '_user_unique_id';
const analyticsId = ''; // TODO: to config!

export class GoogleAnalytics {
    constructor(storage, xhr) {
        this._analyticsId = analyticsId;
        this._userUniqueId = null;
        this._timeoutQueue = new TimeoutQueue(300);

        // should load page in 3 sec, else it will create new uniqid;
        // uniqid may be rewritten on window load
        this._userIdTimeout = setTimeout(() => {
            this._initUserUniqueId();
        }, 3000);

        this._storage = storage;
        this._xhr = xhr;
    }

    /**
     * Generate and store unique user id, or get it from storage
     * @todo unittest
     */
    _initUserUniqueId() {
        if (this._userUniqueId) {
            return;
        }

        var uniqueId = this._retrieveUniqueId();
        if (uniqueId) {
            this._userUniqueId = uniqueId;
        } else {
            this._userUniqueId = GoogleAnalytics._makeRandomId();
            this._storeUniqueId(this._userUniqueId);
        }
    }

    /**
     * Make random id used as user id
     * @returns {number}
     */
    static _makeRandomId() {
        return (1000000000 + Math.floor(Math.random() * (2147483647 - 1000000000)));
    }

    /**
     * Get user unique id
     * @returns {*}
     * @private
     */
    _retrieveUniqueId() {
        return this._storage.getItem(userIdStorageKey);
    }

    /**
     * TODO: должен быть способ установить его извне.
     *
     * Store unique identifier
     * @param uniqueId
     * @private
     */
    _storeUniqueId(uniqueId) {
        if (this._userIdTimeout) {
            clearTimeout(this._userIdTimeout);
        }
        this._userUniqueId = uniqueId;
        this._storage.setItem(userIdStorageKey, uniqueId);
    }

    _addRequest(category, action, label, value) {
        var url = "http://www.google-analytics.com/collect";
        var params = "v=1";
        params += "&tid=" + encodeURIComponent(this._analyticsId);
        params += "&cid=" + encodeURIComponent(this._userUniqueId);
        params += "&t=" + "event";

        if (category) {
            params += "&ec=" + encodeURIComponent(category);
        }
        if (action) {
            params += "&ea=" + encodeURIComponent(action);
        }
        if (label) {
            params += "&el=" + encodeURIComponent(label);
        }
        if (value) {
            params += "&ev=" + encodeURIComponent(value);
        }

        params += "&z=" + (1000000000 + Math.floor(Math.random() * (2147483647 - 1000000000)));

        this._timeoutQueue.add(() => {
            this._xhr.open("POST", url, true);
            this._xhr.send(params);
        });
    }

    /**
     * Send request to GA via measurement interface
     * @todo unittest
     * @param args
     * @private
     */
    send(...args) {
        // if (!DGExt._debug.useAnalytics) {
        //    DGExt.utils.log('Called analytics req with: [' + args.join(', ') + '] @ cid=' + this._userUniqueId);
        //    return;
        // }
        //

        if (this._userUniqueId) {
            this._addRequest(...args);
        }
    }
}
