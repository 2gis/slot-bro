import _ from 'lodash';
import { Module } from 'base/module';

export class ListElem extends Module {
    init(initData, onReady) {

        this.set('position', initData);

        super.init(initData, onReady);
    }

    context() {
        return {
            position: this.get('position')
        };
    }
}
