import { Module } from './index.js';

export class ProxyModule extends Module {
    constructor() {
        super();
        this._rootModule = null;
        this._bindHandlers();
    }

    // This should be strictly synchronous initializer
    init(initData) {
        if (!initData.module) {
            throw new ReferenceError('Attempted to create proxy module without root module');
        }

        this._rootModule = this._loadModule({
            type: initData.module
        });

        return this._rootModule;
    }

    _bindHandlers() {
        kango.addMessageListener('sb_FrameworkMessageUp', (event) => {
            return this._app.notify(
                this._app.getProxiedModuleId(event.target.getId(), event.data.moduleId),
                event.data.messageName,
                event.data.params || []
            );
        });

        kango.addMessageListener('sb_moduleLoaded', (event) => {
            this._app.addModuleProxied(event.target.getId(), this._moduleId, event.data);
        });
    }

}
