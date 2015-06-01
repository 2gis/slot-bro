import { Module } from './index.js';
import * as _ from "lodash";

export class ProxyRoot extends Module {
    constructor() {
        super();

        this._app.on('moduleLoaded', function(descriptor) {
            kango.dispatchMessage('sb_moduleLoaded', _.pick(descriptor, ['id', 'type', 'parentId', 'children']));
        });

        kango.addMessageListener('sb_FrameworkMessageDown', (event) => {
            this._app.broadcast.call(this._app, [event.data.moduleId, event.data.messageName].concat(event.data.params || []));
        });

        this._rootModule = null;
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

    _upcastHandlers() {
        return {
            '*:*': function(event, ...args) {
                kango.dispatchMessage('sb_FrameworkMessageUp', {
                    moduleId: event.sender.id,
                    messageName: event.messageName,
                    params: args
                })
            }
        };
    }
}
