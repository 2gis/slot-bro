import { ProxyModule } from 'base/module/proxy';
import * as _ from "lodash";

/**
 * Proxy module for content scripts,
 * resides inside of background.
 */
export class sbContentProxy extends ProxyModule {
    constructor() {
        super();
        this._knownSlaveScripts = [];
        kango.addMessageListener('sb_SlaveContentAppCreated', (event) => {
            this._knownSlaveScripts.push(event.target);
        });
    }

    downcast(moduleId, message, args) {
        _.each(this._knownSlaveScripts, function(target) {
            target.dispatchMessage('sb_FrameworkMessageDown', {
                moduleId: moduleId,
                messageName: message,
                params: args
            });
        });
    }
}
