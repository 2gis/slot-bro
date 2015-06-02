import { ProxyModule } from 'base/module/proxy';
import * as _ from "lodash";

/**
 * Proxy module for content scripts,
 * resides inside of background.
 */
export class SbContentProxy extends ProxyModule {
    constructor(...args) {
        super(...args);
        this._knownSlaveScripts = [];
        kango.addMessageListener('sb_SlaveContentAppCreated', (event) => {
            this._knownSlaveScripts.push(event.target);
        });
    }

    __type() {
        return 'content';
    }

    downcast(moduleId, messageName, params) {
        _.each(this._knownSlaveScripts, function(target) {
            target.dispatchMessage('sb_FrameworkMessageDown', { moduleId, messageName, params });
        });
    }
}
