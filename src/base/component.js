import _ from "lodash";

export class Component {
    constructor(application) {
        /**
         * @type Application
         */
        this._app = application;
    }

    init() {} // override me
}
