import _ from 'lodash';
import { Component } from "base/component";

const userIdStorageKey = '_user_unique_id';

export class Analytics extends Component {
    init() {
        this._storage = this._app.getComponent('storage');
        this._xhr = this._app.getComponent('request').getXhr();
        var GoogleAnalytics = this._app.getLib('googleAnalytics').GoogleAnalytics;
        this._googleAnalyticsLib = new GoogleAnalytics(this._storage, this._xhr);
    }

    /**
     * Send request to GA via measurement interface
     * @param args
     * @private
     */
    ga(...args) {
        this._googleAnalyticsLib.send(...args);
    }
}
