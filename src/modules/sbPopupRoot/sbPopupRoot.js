import { ProxyRoot } from 'base/module/proxyRoot';
import * as _ from "lodash";

/**
 * Content script root module
 */
export class sbPopupRoot extends ProxyRoot {
    constructor() {
        super();
        kango.dispatchMessage('sb_SlavePopupAppCreated', true);
    }
}
