import _ from 'lodash';

export default function module(moduleName, { fn, data: { root } }) {
    var childId = root._childs[moduleName];
    var { moduleInstance: moduleInstance } = root._app._getModuleDescriptorById(childId);
    var rendered = moduleInstance.render();

    if (!moduleInstance) {
        throw new TypeError(`Module ${moduleName} are not child`);
    }

    return fn(rendered);
}
