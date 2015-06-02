import { ProxyModule } from 'base/module/proxy';
import * as _ from "lodash";

/**
 * Proxy module for content scripts,
 * resides inside of background.
 */
export class SbPopupProxy extends ProxyModule {
    constructor(...args) {
        super(...args);
        this._popupScript = null;
        kango.addMessageListener('sb_SlavePopupAppCreated', (event) => {
            this._popupScript = event.target;
        });
    }

    __type() {
        return 'popup';
    }

    downcast(moduleId, messageName, params) {
        this._popupScript.dispatchMessage('sb_FrameworkMessageDown', { moduleId, messageName, params });
    }
}
