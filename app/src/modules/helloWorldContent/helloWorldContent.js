import * as _ from 'lodash';
import { Module } from 'base/module';

export class HelloWorldContent extends Module {
    init(initData, onReady) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello world from content!');
        /*eslint-enable no-undef, no-console */

        setTimeout(() => {
            this.notify('contentHello', 'This was transferred as message from content!');
        }, 500);
    }

    _waitForReply(msg) {
        /*eslint-disable no-undef, no-console */
        console.log('Reply from background: ' + msg);
        /*eslint-enable no-undef, no-console */
    }

    _downcastHandlers() {
        return {
            'ping': this._waitForReply
        };
    }
}
