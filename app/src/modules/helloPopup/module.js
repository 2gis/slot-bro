import _ from 'lodash';

export default function moduleHelper(moduleName, { fn, data: { root } }) {
    var moduleInstance = _.find(root._modules, module => module.type == moduleName);

    var rendered = moduleInstance.render();

    if (!moduleInstance) {
        throw new TypeError(`Module ${moduleName} are not child`);
    }

    return fn(rendered);
}
