import _ from "lodash";
import $ from "jquery";
import MessageRouter from "./../../lib/messageRouter";
import { modificatorClass, elementClass } from "./../../lib/classNamer";
import { EventEmitter } from "events";
import { initJqueryMod } from "./../../lib/jquery.mod.js";
initJqueryMod($);

var contextRequireFramework = require.context("../../", true, /^.*?(?!\.unit).{5}\.js$/);
var contextRequireApp = require.context("../../../app/src/", true, /^.*?(?!\.unit).{5}\.js$/);

export class Application extends EventEmitter {
    constructor() {
        super();
        this._rootModuleInitialized = false;
        this._ids = {};
        this._moduleDescriptors = {};
        this._components = {};
        this._messageRouter = new MessageRouter(this._moduleDescriptors);
    }

    /**
     *
     * @param componentName
     * @returns {Component}
     */
    getComponent(componentName) {
        if (!this._components[componentName]) {
            var ComponentClass = Application._requireResource('./components/' + componentName + '.js', componentName);
            if (!ComponentClass) {
                throw new TypeError('Component not found: ' + componentName);
            }

            this._components[componentName] = new ComponentClass(this);
            this._components[componentName].init();
        }

        return this._components[componentName];
    }

    getLib(libName) {
        var lib = Application._requireResource('./lib/' + libName + '.js');
        if (!lib) {
            throw new TypeError('Library not found: ' + libName);
        }

        return lib;
    }

    _moduleIdPrefix() {
        return '';
    }

    _nextModuleId(parentId) {
        var key = this._moduleIdPrefix() + (parentId || 'root');
        if (!(key in this._ids)) {
            this._ids[key] = 1;
        }
        var nextId = this._ids[key]++;
        return _.compact([parentId, nextId]).join('-');
    }

    _getModuleDescriptorById(moduleId) {
        var descriptor = this._moduleDescriptors[moduleId];

        if (!descriptor) {
            throw new Error('[slot getModuleDescriptorById] No module with moduleId ' + moduleId + ' found.');
        }

        return descriptor;
    }

    static requireModule(moduleName, fileName = moduleName) {
        var ModuleClass = Application._requireResource('./modules/' + moduleName + '/' + fileName + '.js', moduleName);
        if (!ModuleClass) {
            throw new TypeError('Module not found: ' + moduleName);
        }

        return ModuleClass;
    }

    static _requireResource(path, moduleName = null) {
        var resource = null;

        try {
            resource = contextRequireApp(path);
        } catch (e) {
            try {
                resource = contextRequireFramework(path);
            } catch (e2) {}
        }

        if (!resource) {
            return null;
        }

        if (resource && _.isEmpty(resource)) {
            throw new SyntaxError('Required resource ' + path + ' returned empty object. Forgot to add "export"?');
        }

        if (!moduleName) {
            return resource;
        }

        return resource[_.capitalize(moduleName)];
    }

    loadRootModule(moduleName) {
        if (this._rootModuleInitialized) {
            return null;
        }

        this._rootModuleInitialized = true;
        return this.loadModule({
            parentId: 0,
            type: moduleName
        });
    }

    /**
     *
     * @param data
     * @returns {Module}
     */
    loadModule(data) {
        if (!this._rootModuleInitialized) {
            throw new ReferenceError('Must initialize root module before other modules invokation, see .loadRootModule');
        }

        var parentId = data.parentId,
            moduleId = data.id || this._nextModuleId(parentId),
            moduleName = data.type;

        var ModuleClass = Application.requireModule(moduleName);
        if (!_.isFunction(ModuleClass)) {
            // todo: если возвращает не функцию — ругаемся, проверить будет ли
            // _.isFunction так же работать с нативными классами
            throw new Error('Bad moduleClass: ' + moduleName);
        }

        var moduleInstance = new ModuleClass(this, moduleId, moduleName);
        moduleInstance.uniqueId = moduleId;
        moduleInstance.type = moduleName;

        var moduleDescriptor = {
            'id': moduleId,
            'moduleInstance': moduleInstance,
            'type': moduleName,
            'parentId': parentId,
            'children': data.children || [],
            'container': data.container,
            'mods': data.mods || {}, // модификаторы блока
            'elementsMods': {} // модификаторы элементов
        };

        this._moduleDescriptors[moduleId] = moduleDescriptor;

        if (parentId) {
            this._moduleDescriptors[parentId].children.push(moduleId);
        }

        // Кастомный блок для модуля
        if (moduleInstance.block) {
            moduleInstance.mod({'module': moduleInstance.type});
        }

        this.emit('moduleLoaded', moduleDescriptor);
        return moduleInstance;
    }

    notify(moduleId, messageName, params) {
        var notifier = this._moduleDescriptors[moduleId]; // Модуль, пославший нотифай

        if (!notifier) {
            throw new Error("app.notify: module with id " + moduleId + " doesn't exist, message: " + messageName);
        }

        var currentModuleId = notifier.parentId,
            needStop = false,
            retValue;

        var event = {
            'messageName': messageName,
            'sender': notifier,
            'stop': function () {
                needStop = true;
            }
        };

        var currentDescriptor;
        while (currentModuleId) {
            currentDescriptor = this._moduleDescriptors[currentModuleId]; // Текущий модуль, у которого будем искать диспетчеры

            if (!currentDescriptor.isProxied) {
                var dispatcher = currentDescriptor.moduleInstance.dispatcher;
                if (dispatcher) {
                    var actions = _.flatten(_.compact([dispatcher['*:*'], dispatcher['*:' + messageName], dispatcher[notifier.type + ':' + messageName]]));

                    _.each(actions, function (action) { // Выполняем действия диспетчера
                        var result = action(event, ...params);

                        if (retValue === undefined) {
                            retValue = result;
                        }
                    });
                }
            }

            if (needStop) {
                break;
            }

            currentModuleId = currentDescriptor.parentId; // Ползём вверх по иерархии модулей
        }

        return retValue;
    }

    processModules(moduleId, selector, handler, inclusive) {
        var moduleDescriptors = this._messageRouter.queryModules(moduleId, selector, inclusive);

        _.each(moduleDescriptors, function(moduleDescriptor) {
            handler(moduleDescriptor.moduleInstance, moduleDescriptor);
        });
    }

    broadcast(moduleId, message, ...args) {
        var lastIndexOfDelim = message.lastIndexOf(':'),
            selector = message.substr(0, lastIndexOfDelim),
            action = message.substr(lastIndexOfDelim + 1);

        this.processModules(moduleId, selector, function(moduleInstance) {
            if (moduleInstance.interface && moduleInstance.interface[action]) {
                moduleInstance.interface[action](...args);
            }
        });
    }

    // BEM related

    _moduleBlockId(moduleId) {
        return '#module-' + moduleId;
    }

    _singleModifier(moduleId, descriptor, modName, value) {
        if (typeof value != 'undefined') { // setter
            return this._multipleModifiers(moduleId, descriptor, {
                [modName]: value
            });
        }

        // else: getter
        return descriptor.mods[modName];
    }

    _multipleModifiers(moduleId, descriptor, modifiersList) {
        var oldMods = _.clone(descriptor.mods),
            newMods = _.clone(modifiersList),
            block;

        _.extend(descriptor.mods, newMods);

        // Навешиваем классы
        _.each(newMods, (val, key) => {
            var oldModVal = oldMods[key];

            if (oldModVal !== val) {
                block = this.block(moduleId);

                var oldModClass = modificatorClass(key, oldModVal);
                if (oldModClass) {
                    block.removeClass(oldModClass);
                }

                var newModClass = modificatorClass(key, val);
                if (newModClass) {
                    block.addClass(newModClass);
                }
            }
        });

        // Запускаем хендлеры
        _.each(newMods, (val, key) => {
            var oldModVal = oldMods[key];

            if (oldModVal !== val) {
                var handlers = descriptor.moduleInstance.modHandlers || {};
                if (_.isFunction(handlers[key])) { // Вызов обработчиков установки или удаления модификатора
                    handlers[key].call(descriptor.moduleInstance, val);
                }
            }
        });

        return descriptor.mods;
    }

    mod(moduleId, modifiers, value) {
        var descriptor = this._getModuleDescriptorById(moduleId);

        if (_.isString(modifiers)) { // jQuery-like -> true way
            return this._singleModifier(moduleId, descriptor, modifiers, value);
        }

        if (_.isObject(modifiers)) {
            return this._multipleModifiers(moduleId, descriptor, modifiers);
        }
    }

    element(moduleId, elementName) {
        var descriptor = this._getModuleDescriptorById(moduleId),
            elementDeclaration = descriptor.moduleInstance.elements && descriptor.moduleInstance.elements[elementName],
            blockName = descriptor.moduleInstance.block || descriptor.type;

        // Кастомный селектор для элемента, относительно корневого элемента модуля
        var selector = elementDeclaration && elementDeclaration.selector || '.' + elementClass(blockName, elementName);

        return $(selector, this._moduleBlockId(moduleId)); // Возвращаемые элементы (jQuery объект)
    };

    block(moduleId) {
        var containerId = this._moduleBlockId(moduleId);
        return $(containerId);
    };
}
