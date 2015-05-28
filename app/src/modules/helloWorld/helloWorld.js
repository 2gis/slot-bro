import * as _ from "lodash";
import { Module } from "baseModule";

export class HelloWorld extends Module {
    init(initData, onReady) {
        /*eslint-disable no-undef, no-console */
        console.log('Hello world!');
        /*eslint-enable no-undef, no-console */
        this.makeChild('helloWorldChild');
    }
}
