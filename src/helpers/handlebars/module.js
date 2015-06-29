import _ from 'lodash'
import Handlebars from 'handlebars/runtime'

/**
 * Handlebars helper for inline inner modules templates
 *
 * block mode: {{#module 'moduleName'}} <div>{{{this}}}</div> {{/module}}
 * one line mode: {{module 'moduleName}}
 *
 * @param {string|Module} name - inner module name or instance for inline
 * @param {undefined|function} fn - if function mean block mode
 * @param {Module} module - which template execute helper
 * @returns {string} html
 */
export default function moduleHelper(name, { fn, data: { module } }) {
    // var context = this; // result of module.context() bind in this
    let moduleInstance;

    if (_.isString(name)) {
        moduleInstance = _.find(module._modules, instance => _.eq(instance.type, name));
    } else {
        moduleInstance = name;
    }

    if (!moduleInstance) {
        throw new TypeError(`Module ${name} not found`);
    }

    let html = new Handlebars.SafeString(moduleInstance.render());

    if (fn) {
        html = fn(html);
    }

    return html;
}
