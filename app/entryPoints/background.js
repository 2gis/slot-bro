import * as _ from "lodash";
import { Application } from "app";

var app = new Application();

var rootModule = app.loadModule({
    parentId: 0,
    type: 'helloWorld'
});

rootModule.init();
