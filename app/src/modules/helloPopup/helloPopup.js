import * as _ from "lodash";
import { Module } from "base/module";

export class HelloPopup extends Module {
    init(initData, onReady) {
        console.log('Hello world from popup');

        setTimeout(() => this.notify('popupHello', 'This was transfered message from popup'), 1000);
    }

    _upcastHandlers() {
        return {
            '*:ping': (e, msg) => {
                console.log(`hello from popup and msg: ${msg} from background`, e);
            }
        }
    }
}
