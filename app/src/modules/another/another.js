import _ from 'lodash';
import { Module } from 'base/module';

export class Another extends Module {
    init(initData, onReady) {
        console.log('Hello from another module');

        super.init(initData, onReady);
    }

    context() {
        var msg = 'Style from another module';
        return {
            msg
        };
    }
}
