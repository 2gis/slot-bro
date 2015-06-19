import { Module } from './index.js';
import * as _ from "lodash";

export class ProxyRoot extends Module {
    constructor(...args) {
        super(...args);

        this._app.on('moduleLoaded', (descriptor) => {
            kango.dispatchMessage('sb_' + this.__type() + 'ModuleLoaded', _.pick(descriptor, ['id', 'type', 'parentId', 'children']));
        });

        kango.addMessageListener('sb_FrameworkMessageDown', (event) => {
            this._app.broadcast.apply(this._app, [event.data.moduleId, event.data.messageName].concat(event.data.params || []));
        });

        this._rootModule = null;
    }

    __type() {
        return 'generic';
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

    _childHandlers() {
        return {
            '*:*': (event, ...args) => {
                var message = {
                    moduleId: event.sender.id,
                    messageName: event.messageName,
                    params: args
                };
                kango.dispatchMessage('sb_FrameworkMessageUp', message);
            }
        };
    }
}
