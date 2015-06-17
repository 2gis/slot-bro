import * as _ from "lodash";
import { Module } from "base/module";

export class HelloWorld extends Module {
    init(initData, onReady) {
        var childs = ['helloWorldChild', 'popupButton'];

        /*eslint-disable no-undef, no-console */
        console.log('Hello world!');
        /*eslint-enable no-undef, no-console */

        _.each(childs, child => this.makeChild(child));
    }

    _waitForContentMessage(e, msg) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello from child: ' + msg);
        /*eslint-enable no-undef, no-console */
        this.broadcast('helloWorldContent:ping', 'Hello from background after content message!');
        this.broadcast('popupButton:popup', {url: 'popup.html'});
        this.broadcast('popupButton:icon', 'static/toolbar_button/active.png');
    }

    _waitForPopupMessage(e, msg) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello from child: ' + msg);
        /*eslint-enable no-undef, no-console */
        this.broadcast('helloWorldContent:ping', 'Hello from background after popup msg!');
    }

    _upcastHandlers() {
        return {
            '*:contentHello': this._waitForContentMessage,
            '*:popupHello': this._waitForPopupMessage
        };
    }
}
