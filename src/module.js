"use strict";
import * as _ from "lodash";

const STAGE_INITING = 1;
const STAGE_INITED = 2;
const STAGE_KILLED = 4;
const STAGE_DISPOSED = 8;
const STAGE_ALIVE = 3; // = STAGE_INITING | STAGE_INITED
const STAGE_NOT_ALIVE = 12; // = STAGE_DISPOSED | STAGE_KILLED

export class Module {
    constructor(application, moduleId, moduleName) {
        /**
         * @type Application
         */
        this._app = application;
        this._moduleId = moduleId;
        this._moduleName = moduleName;
        this._stage = STAGE_INITING;
        this._modules = {};
    }

    init(initData, callback) {
        callback();
    }

    dispose() {}

    block() {
        return this._app.block(this._moduleId);
    }

    element(selector) {
        return this._app.element(this._moduleId, selector);
    }

    mod(modifiers, value) {
        return this._app.mod(this._moduleId, modifiers, value);
    }

    /**
     *
     * @param childModuleName
     * @param initData
     * @param onReady
     * @returns {*}
     */
    makeChild(childModuleName, initData = {}, onReady = _.noop) {
        // Если слот умер - ничего инитить нет смысла, потому что слот умирает вместе с родительским модулем
        if (this._stage & STAGE_NOT_ALIVE) {
            return null;
        }

        var instance = this._loadModule({type: childModuleName, data: initData});

        instance.init(initData, function(err) {
            if (err) {
                instance.dispose();
            } else if (instance._stage & STAGE_INITED) { // На случай, если суицид модуля
                this._modules[this._moduleName] = this._modules[this._moduleName] || [];
                this._modules[this._moduleName].push(instance);
            }
            onReady(err, instance);
        });

        return instance;
    }

    // App proxies

    /**
     *
     * @param data
     * @returns {Module}
     * @private
     */
    _loadModule(data) {
        return this._app.loadModule(data);
    }

    /**
     *
     * @param messageName
     * @param params
     * @returns {*}
     */
    notify(messageName, ...params) {
        return this._app.notify(this._moduleId, messageName, params);
    }

    /**
     *
     * @param moduleSelector
     * @returns {*}
     */
    broadcast(moduleSelector) {
        return this._app.broadcast(this._moduleId, moduleSelector);
    }
}
