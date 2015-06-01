import { Application } from "./index"
var modulePrefix = 'content' + Math.random().toString(36).substr(2, 5); // generated once and persists until app is done

export class ContentApplication extends Application {
    _moduleIdPrefix() {
        return modulePrefix;
    }

    loadRootModule(moduleName, onReady) {
        if (this._rootModuleInitialized) {
            return null;
        }
        this._rootModuleInitialized = true;

        var module = this.loadModule({
            parentId: 0,
            type: 'sbContentRoot'
        });

        return module.init({
            module: moduleName
        });
    }
}
