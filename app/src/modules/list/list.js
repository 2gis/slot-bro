import _ from 'lodash';
import { Module } from 'base/module';

export class List extends Module {
    init(initData, onReady) {

        let listElems = [
            'first',
            'second',
            'last'
        ];

        _.each(listElems, (initData, i, listElems) => listElems[i] = this.makeChild('listElem', initData));

        this.context = () => ({childs: listElems});

        super.init(initData, onReady);
    }
}
