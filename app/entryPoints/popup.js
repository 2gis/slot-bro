import * as _ from "lodash";
import { PopupApplication } from "base/application/popup";

var app = new PopupApplication();
var rootModule = app.loadRootModule('helloPopup');
rootModule.init();
