import * as _ from "lodash";
import { Module } from "base/module";

export class HelloWorld extends Module {
    init(initData, onReady) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello world!');
        /*eslint-enable no-undef, no-console */
        this.makeChild('helloWorldChild');
    }

    _waitForMessage(e, msg) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello from content: ' + msg);
        /*eslint-enable no-undef, no-console */
        this.broadcast('helloWorldContent:ping', 'Hello from background!');
    }

    _upcastHandlers() {
        return {
            '*:contentHello': this._waitForMessage
        };
    }
}
