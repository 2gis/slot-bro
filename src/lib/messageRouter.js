"use strict";
import _ from "lodash";

/**
 * Конструктор функции для дескрипторов модулей приложения.
 *
 * @constructs slot.ModulesQuering
 *
 * @param {Array} moduleDescriptors - Дескрипторы модулей в приложении.
 * @returns {Function} Функция `queryModules`, которая умеет запрашивать модули по селектору.
 */
export default class MessageRouter {
    constructor(descriptorsList) {
        /**
         * Типы предикатов.
         *
         * @private
         *
         * @readonly
         * @enum {int}
         */
        this._predicateTypes = {
            'MOD': 1, // online[active]
            'ATOM': 2, // miniCard[:first]
            'METHOD': 4 // searchBar[::valueIs(544)]
        };

        // элемент каскада
        this._ruleRe = /([\w\*]+)((?:\[[^\]]+\])*)/;
        // один аргумент в конструкции [::foo(1, 'arg2', "arg3')]
        this._argsRe = /(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|[^"'\s\,]+)+/g;
        // регулярка на все аргументы вместе со скобками, сами аргументы могут отсутствовать
        this._argsGroupRe = /(\w+)\(([^\)]*)\)/;
        // триминг кавычек строчек
        this._trimRe = /^['"]+|['"]+$/g;
        // предикат
        this._predRe = /\[([^\]]+?)\]/g;

        this._moduleDescriptors = descriptorsList;
    }

    /**
     * Проверяет подходит ли предикат к заданному модулю.
     *
     * @private
     *
     * @param {Object} moduleConf - Конфиг модуля.
     * @param {Object} moduleDesc - Дескриптор модуля.
     * @param {Object[]} predicates - Массив распарсенных объектов предикатов, см. метод parsePredicate.
     * @param {int} index - Позиция модуля относительно родителя.
     * @param {Array} all - Все родительские модули.
     * @returns {boolean}
     */
    _matchPredicates(moduleConf, moduleDesc, predicates, index, all) {
        return _.every(predicates, (predicate) => {
            if (predicate.type & this._predicateTypes.METHOD) {
                if (!moduleConf.interface || !_.isFunction(moduleConf.interface[predicate.name])) {
                    return false;
                }
                var ref = predicate.ref || true;

                return moduleConf.interface[predicate.name].apply(moduleConf, predicate.args) == ref;
            } else if (predicate.type & this._predicateTypes.MOD) {
                var mods = moduleDesc.slot.mod();
                var value = mods[predicate.name];

                if (!predicate.ref) {
                    return value === true;
                } else if (predicate.ref == '*') {
                    return !!value;
                }
                return value == predicate.ref;
            } else if (predicate.type & this._predicateTypes.ATOM) {
                switch (predicate.name) {
                    case 'first-child':
                        return index == 0;
                    case 'last-child':
                        return index == all.length - 1;
                    case 'first':
                    case 'last':
                        return true;
                    default:
                        return false;
                }
            }
        });
    }

    /**
     * Фильтруем модули по уже распарсенному предикату.
     *
     * @private
     *
     * @param {string} fromId - С какого модуля фильтруем.
     * @param {string} name - Тип модулей который нужен, если равен * то любой тип подходит.
     * @param {Object[]} predicates - Массив распарсенных объектов предикатов, см. метод parsePredicate.
     * @param {boolean} [inclusive=false] - Включать ли начальный модуль в выборку.
     *
     * @returns {Array<string>} Список отфильтрованных айдишников.
     */
    _filterModules(fromId, name, predicates, inclusive) {
        var currModuleDesc = this._moduleDescriptors[fromId],
            result = [];

        function matchType(type) {
            return name == '*' || name == type;
        }

        /**
         * Рекурсивно накапливает в `result` модули которые удовлетворяют типу и предикату.
         *
         * @private
         *
         * @param {string} id - Модуль который будем тестировать, его дети рекурсивно тоже будут обработаны.
         * @param {int} index - Позиция модуля относительно родителя.
         * @param {Array} all - Все родительские модули.
         */
        var accumulate = (id, index, all) => {
            var moduleDescriptor = this._moduleDescriptors[id];

            if (matchType(moduleDescriptor.type) && this._matchPredicates(moduleDescriptor.moduleConf, moduleDescriptor, predicates, index, all)) {
                result.push(id);
            }

            _.each(moduleDescriptor.children, accumulate);
        };

        if (inclusive) {
            accumulate(fromId, 0, []);
        } else {
            _.each(currModuleDesc.children, accumulate);
        }

        // если последний предикат — :first или :last, возвращаем первый или последний модуль из выборки
        var lastPredicate = _.last(predicates);
        if (result.length && lastPredicate && lastPredicate.type & this._predicateTypes.ATOM) {
            switch (lastPredicate.name) {
                case 'first':
                    return result.slice(0, 1);
                case 'last':
                    return result.slice(-1);
                default:
                    return false;
            }
        }
        return result;
    }

    /**
     * Парсит предикат вида [:name(args)=ref] в соответствующую структуру.
     *
     * Предикаты бывают трех типов:
     * 1. [active] предикат по модификатору, равен predicateTypes.MOD
     * 2. [:first] предикат по заранее определенному поведению, равен predicateTypes.ATOM
     * 3. [::isDone(4,6)] предикат по интерфейсному методу, метод должен вернуть true либо значение ref если он указан, равен predicateTypes.METHOD
     *
     * @private
     *
     * @param {string} str - Тело предиката.
     * @returns {{ name: string, ref: *, type: _predicateTypes, args: Array }}
     */
    _parsePredicate(str) {
        var name = str,
            type = this._predicateTypes.MOD; // см predicateTypes

        if (str.charAt(0) == ':') {
            type = this._predicateTypes.ATOM;
            name = str.substr(1);
            if (str.charAt(1) == ':') {
                type = this._predicateTypes.METHOD;
                name = name.substr(1);
            }
        }

        var indexOfEq = name.indexOf('=');
        var ref = null; // то что стоит после равно

        if (indexOfEq != -1) {
            ref = name.substr(indexOfEq + 1);
            name = name.substr(0, indexOfEq);
        }

        var args = [],
            argGroupMatch = name.match(this._argsGroupRe);

        if ((type & this._predicateTypes.METHOD) && argGroupMatch) {
            name = argGroupMatch[1];
            args = argGroupMatch[2].match(this._argsRe) || [];
            args = args.map(function(s) {
                return s.replace(this._trimRe, '');
            });
        }

        return {name, ref, type, args};
    }

    /**
     * Возвращает дескрипторы модулей по заданному селектору.
     *
     * @param {string} fromId - Рутовый модуль откуда начинаем выборку.
     * @param {string} selector - Селектор запроса.
     * @param {boolean} [inclusive=false] - Начинать ли выборку с рутового модуля.
     * @returns {Array<Module>}
     */
    queryModules(fromId, selector, inclusive) {
        var sel = selector.split(/\s+/);
        var ids = [fromId];

        // итерация по элементам каскада, каждый раз выборка уточняется
        for (var i = 0, len = sel.length; i < len; i++) {
            var rule = this._ruleRe.exec(sel[i]);

            if (!rule) {
                throw new Error("Invalid selector " + selector);
            }

            var name = rule[1];
            var predicatesString = rule[2];

            var predicates = [],
                predicateMatch;

            while (predicateMatch = this._predRe.exec(predicatesString)) {
                predicates.push(this._parsePredicate(predicateMatch[1]));
            }

            var newIds = [];

            for (var k = 0, kLen = ids.length; k < kLen; k++) {
                var id = ids[k];
                newIds = newIds.concat(this._filterModules(id, name, predicates, inclusive));
            }

            inclusive = false; // далее inclusive должен быть равен false для корректной выборки в каскаде

            ids = newIds.slice();

            if (!ids.length) {
                break;
            }
        }

        return _.at(this._moduleDescriptors, ids);
    }
}
