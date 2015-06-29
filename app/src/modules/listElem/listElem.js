import _ from 'lodash';
import { Module } from 'base/module';

export class ListElem extends Module {
    init(initData, onReady) {

        this.context = () => ({position: initData});

        super.init(initData, onReady);
    }
}
