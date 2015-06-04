import { ProxyRoot } from 'base/module/proxyRoot';
import * as _ from "lodash";

/**
 * Content script root module
 */
export class SbPopupRoot extends ProxyRoot {
    constructor(...args) {
        super(...args);
        kango.dispatchMessage('sb_SlavePopupAppCreated', true);
    }

    __type() {
        return 'popup';
    }
}
