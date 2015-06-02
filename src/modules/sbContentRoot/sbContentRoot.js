import { ProxyRoot } from 'base/module/proxyRoot';
import * as _ from "lodash";

/**
 * Content script root module
 */
export class SbContentRoot extends ProxyRoot {
    constructor(...args) {
        super(...args);
        kango.dispatchMessage('sb_SlaveContentAppCreated', 'true');
    }

    __type() {
        return 'content';
    }
}
