import _ from 'lodash';
import { Module } from 'base/module';

export class Message extends Module {
    init(initData, onReady) {
        console.log('Hello from message module');

        super.init(initData, onReady);
    }

    context() {
        var msg = 'Style from message module';
        return {
            some: msg
        };
    }
}
