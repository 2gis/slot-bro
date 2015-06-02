import { Application } from "./index"
var modulePrefix = 'content' + Math.random().toString(36).substr(2, 5); // generated once and persists until app is done

export class ContentApplication extends Application {
    _moduleIdPrefix() {
        return modulePrefix;
    }

    loadRootModule(moduleName, onReady) {
        var module = super.loadRootModule('sbContentRoot');
        if (!module) {
            return null;
        }

        return module.init({
            module: moduleName
        });
    }
}
