import { Application } from "./index"
import * as _ from "lodash";

export class BackgroundApplication extends Application {
    constructor(...args) {
        super(...args);

        kango.addMessageListener('sb_FrameworkMessageUp', (event) => {
            return this.notify(
                this.getProxiedModuleId(event.target.getId(), event.data.moduleId),
                event.data.messageName,
                event.data.params || []
            );
        });
    }

    loadRootModule(moduleName) {
        var rootModule = super.loadRootModule(moduleName);
        if (!rootModule) {
            return null;
        }

        rootModule.makeChild('sbContentProxy');
        rootModule.makeChild('sbPopupProxy');

        return rootModule;
    }

    _moduleIdPrefix() {
        return 'background';
    }

    getProxiedModuleId(windowId, moduleId) {
        if (moduleId.indexOf('_proxied') === 0) {
            return moduleId;
        }
        return `_proxied:${windowId}_${moduleId}`;
    }

    addModuleProxied(windowId, proxyModuleId, minimalDescriptor) {
        _.extend(minimalDescriptor, {
            isProxied: true,
            proxyLink: this._moduleDescriptors[proxyModuleId].moduleInstance,

            // rewrite id and parent id to match proxied naming
            id: this.getProxiedModuleId(windowId, minimalDescriptor.id),
            parentId: minimalDescriptor.parentId ? this.getProxiedModuleId(windowId, minimalDescriptor.parentId) : proxyModuleId
        });

        this._moduleDescriptors[minimalDescriptor.id] = minimalDescriptor;
        this._moduleDescriptors[minimalDescriptor.parentId].children.push(minimalDescriptor.id);
        this.emit('moduleLoaded', minimalDescriptor);
    }

    broadcast(moduleId, message, ...args) {
        var lastIndexOfDelim = message.lastIndexOf(':'),
            selector = message.substr(0, lastIndexOfDelim),
            action = message.substr(lastIndexOfDelim + 1);

        var moduleDescriptors = this._messageRouter.queryModules(moduleId, selector);
        _.each(moduleDescriptors, function(descriptor) {
            if (descriptor.isProxied) {
                descriptor.proxyLink.downcast(moduleId, message, args);
            } else {
                var moduleInstance = descriptor.instance;
                if (moduleInstance.interface && moduleInstance.interface[action]) {
                    moduleInstance.interface[action](...args);
                }
            }
        });
    }
}

