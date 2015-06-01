import { Application } from "./index"
import * as _ from "lodash";

export class BackgroundApplication extends Application {
    constructor() {
        super();
        this._bindHandlers();
    }

    loadRootModule(moduleName) {
        if (this._rootModuleInitialized) {
            return null;
        }

        this._rootModuleInitialized = true;
        var rootModule = this.loadModule({
            parentId: 0,
            type: moduleName
        });

        rootModule.makeChild('sbContentProxy');
        rootModule.makeChild('sbPopupProxy');

        return rootModule;
    }

    _moduleIdPrefix() {
        return 'background';
    }

    getProxiedModuleId(windowId, moduleId) {
        return '_proxied:' + windowId + '_' + moduleId;
    }

    addModuleProxied(windowId, proxyModuleId, minimalDescriptor) {
        minimalDescriptor.isProxied = true;
        minimalDescriptor.proxyLink = this._moduleDescriptors[proxyModuleId].instance;
        var moduleId = this.getProxiedModuleId(windowId, minimalDescriptor.id);
        this._moduleDescriptors[moduleId] = minimalDescriptor;
        this._moduleDescriptors[minimalDescriptor.parentId || proxyModuleId].children.push(moduleId);
        this.emit('moduleLoaded', minimalDescriptor);
    }

    broadcast(moduleId, message) {
        var args = [].slice.call(arguments, 2),
            lastIndexOfDelim = message.lastIndexOf(':'),
            selector = message.substr(0, lastIndexOfDelim),
            action = message.substr(lastIndexOfDelim + 1);

        var moduleDescriptors = this._messageRouter.queryModules(moduleId, selector);
        _.each(moduleDescriptors, function(descriptor) {
            if (descriptor.isProxied) {
                descriptor.proxyLink.downcast(moduleId, message, args);
            } else {
                var moduleInstance = descriptor.instance;
                if (moduleInstance.interface) {
                    var handler = moduleInstance.interface[action] || _.noop;
                    handler.apply(moduleInstance.interface, args);
                }
            }
        });
    }
}

