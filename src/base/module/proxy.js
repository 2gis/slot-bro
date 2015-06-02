import { Module } from './index.js';

export class ProxyModule extends Module {
    constructor(...args) {
        super(...args);
        this._rootModule = null;
        this._bindHandlers();
    }

    __type() {
        return 'generic';
    }

    _bindHandlers() {
        kango.addMessageListener('sb_' + this.__type() + 'ModuleLoaded', (event) => {
            this._app.addModuleProxied(event.target.getId(), this._moduleId, event.data);
        });
    }

}
