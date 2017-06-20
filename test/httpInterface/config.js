module.exports = {
    db: {
        url: "sh_httpInterface"
    },
    collections: [{
        name: 'test',
        // operations: ['create', 'get', 'list', 'update', 'remove']
    }, {
        name: 'test2',
        // operations: ['create', 'get', 'list', 'update', 'remove']
    }, {
        name: 'test3',
        // operations: ['create', 'get', 'list', 'update', 'remove']
    }, {
        name: 'test4',
        // operations: ['create', 'get', 'list', 'update', 'remove']
    }, {
        name: 'test5',
        // operations: ['create', 'get', 'list', 'update', 'remove']
    }, {
        name: 'test6',
        // operations: ['create', 'get', 'list', 'update', 'remove']
    }, {
        name: 'test7',
        operations: [{
            method: "POST",
            api: '/'
        }]
    }]
}