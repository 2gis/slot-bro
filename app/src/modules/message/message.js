import _ from 'lodash';
import { Module } from 'base/module';

export class Message extends Module {
    init(data, onReady) {
        console.log('Hello from message module');
    }

    context() {
        var msg = 'Message from message module';
        return {
            some: msg
        };
    }
}
