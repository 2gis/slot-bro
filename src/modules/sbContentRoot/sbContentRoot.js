import { ProxyRoot } from 'base/module/proxyRoot';
import * as _ from "lodash";

/**
 * Content script root module
 */
export class sbContentRoot extends ProxyRoot {
    constructor() {
        super();
        kango.dispatchMessage('sb_SlaveContentAppCreated', true);
    }
}
