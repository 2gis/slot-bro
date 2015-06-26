import _ from "lodash";
import { ContentApplication } from "base/application/content";

var app = new ContentApplication();
var rootModule = app.loadRootModule('helloWorldContent');
rootModule.init({}, _.noop);
