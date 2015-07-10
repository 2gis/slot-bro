import _ from "lodash";
import { Module } from "base/module";

export class HelloPopup extends Module {
    init(initData, onReady) {
        this.makeChild('message');
        this.makeChild('another');
        this.makeChild('list');

        console.log('Hello world from popup');

        setTimeout(() => {
            this.notify('popupHello', 'This was transferred message from popup');
        }, 1000);

        super.init(initData, onReady);
    }

    _parentHandlers() {
        return {
            'ping': msg => console.log('Reply from background:', msg)
        };
    }

    context() {
        return {
            helloPopupMessage: `good from ${this.type}`
        };
    }
}
