import { Application } from "./index"

export class PopupApplication extends Application {
    _moduleIdPrefix() {
        return 'popup';
    }

    loadRootModule(moduleName, onReady) {
        if (this._rootModuleInitialized) {
            return null;
        }
        this._rootModuleInitialized = true;

        var module = this.loadModule({
            parentId: 0,
            type: 'sbPopupRoot'
        });

        return module.init({
            module: moduleName
        });
    }
}
