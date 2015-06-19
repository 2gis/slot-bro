import * as _ from "lodash";
import { Module } from "base/module";

export class HelloPopup extends Module {
    init(initData, onReady) {
        console.log('Hello world from popup', arguments);

        setTimeout(() => this.notify('popupHello', 'This was transferred message from popup'), 1000);
    }

    _parentHandlers() {
        return {
            'ping': msg => console.log('Reply from background:', msg)
        };
    }
}
