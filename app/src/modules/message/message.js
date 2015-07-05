import _ from 'lodash';
import { Module } from 'base/module';

export class Message extends Module {
    init(initData, onReady) {
        console.log('Hello from message module');

        super.init(initData, onReady);
    }

    context() {
        return {
            some: `Style from ${this.type} module`
        };
    }
}
