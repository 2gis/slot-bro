import _ from 'lodash'
import Handlebars from 'handlebars/runtime'

/**
 * Handlebars helper for inline inner modules templates
 *
 * block mode: {{#module 'moduleName'}} <div>{{{this}}}</div> {{/module}}
 * one line mode: {{module 'moduleName}}
 *
 * @param moduleName - inner module name for inline
 * @param {undefined|function} fn - if function mean block mode
 * @param {Module} module - which template execute helper
 * @returns {string} html
 */
export default function moduleHelper(moduleName, { fn, data: { module } }) {
    // var context = this; // result of module.context() bind in this

    let moduleInstance = _.find(module._modules, instance => _.eq(instance.type, moduleName));

    if (!moduleInstance) {
        throw new TypeError(`Module ${moduleName} are not child`);
    }

    let html = new Handlebars.SafeString(moduleInstance.render());

    if (fn) {
        html = fn(html);
    }

    return html;
}
