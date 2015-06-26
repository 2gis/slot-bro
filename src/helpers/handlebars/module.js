import _ from 'lodash';

export default function moduleHelper(moduleName, { fn }) {
    var moduleInstance = _.find(this._modules, module => _.eq(module.type, moduleName));

    if (!moduleInstance) {
        throw new TypeError(`Module ${moduleName} are not child`);
    }

    var html = moduleInstance.render();

    if (fn) {
        html = fn(html);
    }

    return html;
}
