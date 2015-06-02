import { Application } from "./index"

export class PopupApplication extends Application {
    _moduleIdPrefix() {
        return 'popup';
    }

    loadRootModule(moduleName, onReady) {
        var module = super.loadRootModule('sbPopupRoot');
        if (!module) {
            return null;
        }

        return module.init({
            module: moduleName
        });
    }
}
