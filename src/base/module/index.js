import _ from "lodash";
import { Application } from "../application/index"

var contextRequireTemplate = require.context("../../../app/src/modules/", true, /^.*?\.hbs$/);

export class Module {
    constructor(application, moduleId, moduleName) {
        /**
         * @type Application
         */
        this._app = application;
        this._moduleId = moduleId;
        this._moduleName = moduleName;
        this._modules = {};
        this.interface = _bindEach(this._parentHandlers(), this);
        this.dispatcher = _bindEach(this._childHandlers(), this);
    }

    init(initData, callback) {
        callback();
    }

    _childHandlers() {
        return {};
    }

    _parentHandlers() {
        return {};
    }

    dispose() {
    }

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
        var instance = this._loadModule({type: childModuleName, data: initData});

        instance.init(initData, (err) => {
            if (err) {
                instance.dispose();
            } else {
                this._modules[instance._moduleId] = instance;
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
        data.parentId = this._moduleId;
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
     * @param params
     * @returns {*}
     */
    broadcast(moduleSelector, ...params) {
        return this._app.broadcast(this._moduleId, moduleSelector, ...params);
    }

    render() {
        var template = Module.requireTemplate(this.type);
        return template(this.context());
    }

    context() {
        return this;
    }

    static requireTemplate(moduleName, fileName = moduleName) {
        var template = contextRequireTemplate(`./${moduleName}/${fileName}.hbs`);

        if (!template) {
            throw new TypeError(`Template not found: ${fileName}.hbs`);
        }

        return template;
    }
}

function _bindEach(handlersList, target) {
    _.each(handlersList, function(val, key) {
        if (!_.isFunction(val)) {
            throw new TypeError('In module ' + target._moduleName + ' handler ' + key + ' is not a function');
        }
        handlersList[key] = _.bind(val, target);
    });
    return handlersList;
}
