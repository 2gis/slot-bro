import _ from "lodash";
import { Module } from "base/module";

export class HelloWorldChild extends Module {
    init(initData, onReady) {
        var a = this._app.getComponent('storage');
        // console.log(a);

        /*eslint-disable no-undef, no-console */
        console.log('Hello world from child!');
        /*eslint-enable no-undef, no-console */
        super.init(initData, onReady);
    }
}
