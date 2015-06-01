import { ProxyModule } from 'base/module/proxy';
import * as _ from "lodash";

/**
 * Proxy module for content scripts,
 * resides inside of background.
 */
export class sbPopupProxy extends ProxyModule {
    constructor() {
        super();
        this._popupScript = null;
        kango.addMessageListener('sb_SlavePopupAppCreated', (event) => {
            this._popupScript = event.target;
        });
    }

    downcast(moduleId, message, args) {
        this._popupScript.dispatchMessage('sb_FrameworkMessageDown', {
            moduleId: moduleId,
            messageName: message,
            params: args
        });
    }
}
