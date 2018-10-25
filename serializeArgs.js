function serializeArgs(data) {
    return Object.assign({}, data, {
        operations: data.operations.map(o => Object.assign({}, o, {
            args: o.args.map(a => typeof a === 'function' ? {val: a.toString(), type: 'function'} : 3)
        }))
    });
}

module.exports = serializeArgs;