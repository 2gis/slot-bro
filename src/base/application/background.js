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

    getProxiedModuleId(tabId, moduleId) {
        if (moduleId.indexOf('_proxied') === 0) {
            return moduleId;
        }
        return `_proxied:${tabId}_${moduleId}`;
    }

    addModuleProxied(tabId, proxyModuleId, minimalDescriptor) {
        _.extend(minimalDescriptor, {
            isProxied: true,
            proxyLink: this._moduleDescriptors[proxyModuleId].moduleInstance,

            // rewrite id and parent id to match proxied naming
            id: this.getProxiedModuleId(tabId, minimalDescriptor.id),
            parentId: minimalDescriptor.parentId ? this.getProxiedModuleId(tabId, minimalDescriptor.parentId) : proxyModuleId
        });

        this._moduleDescriptors[minimalDescriptor.id] = minimalDescriptor;

        removeInconsistentChilds(this._moduleDescriptors[minimalDescriptor.parentId], minimalDescriptor);

        this._moduleDescriptors[minimalDescriptor.parentId].children.push(minimalDescriptor.id);
        this.emit('moduleLoaded', minimalDescriptor);

        function removeInconsistentChilds(parentDesc, minimalDesc) {
            var wrongChildId = _.last(minimalDesc.id.split('_'));
            parentDesc.children = _.remove(parentDesc.children, wrongChildId);
        }
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

