import _ from "lodash";
import { BackgroundApplication } from "base/application/background";

var app = new BackgroundApplication();
var rootModule = app.loadRootModule('helloWorld');
rootModule.init({}, _.noop);
