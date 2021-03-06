import { ProxyModule } from 'base/module/proxy';
import _ from "lodash";

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

    _bindHandlers() {
        kango.addMessageListener('sb_' + this.__type() + 'ModuleLoaded', (event) => {
            if (!event.target.getId) {
                event.target.getId = () => "Popup";
                // todo: fix popup window identification
            }
            this._app.addModuleProxied(event.target.getId(), this._moduleId, event.data);
        });
    }
}
