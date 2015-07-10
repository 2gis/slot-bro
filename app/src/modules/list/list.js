import _ from 'lodash';
import { Module } from 'base/module';

export class List extends Module {
    init(initData, onReady) {

        let positions = [
            'first',
            'second',
            'last'
        ];

        let childs = _.map(positions, (position) => this.makeChild('listElem', position));

        this.set('childs', childs);

        super.init(initData, onReady);
    }

    context() {
        return {
            childs: this.get('childs')
        };
    }
}
