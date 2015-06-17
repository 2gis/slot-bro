import * as _ from "lodash";
import { Module } from "base/module";

export class HelloPopup extends Module {
    init(initData, onReady) {
        console.log('Hello world from popup');

        setTimeout(() => this.notify('popupHello', 'This was transferred message from popup'), 1000);
    }

    _upcastHandlers() {
        return {
            '*:ping': (e, msg) => {
                console.log(`hello from popup and msg: ${msg} from background`, e);
            }
        }
    }

    _downcastHandlers() {
        return {
            'ping': msg => console.log('Reply from background:', msg)
        };
    }
}
