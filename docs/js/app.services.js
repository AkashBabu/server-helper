module.exports = function (app) {
    app.service('contentService', [function () {
        this.content = {
            "Helper": {
                desc: "Commonly used functions for input validations, salthash etc",
                initialCode: `
var Helper = require("server-helper").Helper;
var helper = new Helper();                    
                    `,
                methods: [
                    {
                        id: 'filterKeysInObj',
                        name: 'filterKeysInObj(obj: string, filter: string[], sameObj?: boolean)  => object',
                        nav: 'filterKeysInObj',
                        returns: {
                            type: 'object',
                            desc: 'An object that would not include the keys specified in the filter'
                        },
                        params: [
                            {
                                name: 'obj',
                                desc: 'Input object'
                            }, {
                                name: 'filter',
                                desc: 'Array of keys to be removed'
                            }, {
                                name: 'sameObj',
                                desc: 'If the filter operation has to be applied on the same obj or a copy of it. Defaults to false'
                            }
                        ],
                        desc: "Filters out/removes the keys for the given object",
                        example: `
var obj = {a: 1, b: 1, c: 1},
    filter = ["a", "b"];

console.log(helper.filterKeysInObj(obj, filter, false)) // {c: 1}
// obj = {a: 1, b: 1, c: 1}


console.log(helper.filterKeysInObj(obj, filter, true)) // {c: 1}
console.log(obj) // {c: 1}
                    `
                    },
                    {
                        id: 'retainKeysInObj',
                        name: 'retainKeysInObj(obj: string, retain: string[], sameObj?: boolean)',
                        nav: 'retainKeysInObj',
                        return: {
                            type: 'object',
                            desc: 'An Object whose keys would include only the ones specified'
                        },
                        params: [
                            {
                                name: 'obj',
                                desc: 'Input object'
                            }, {
                                name: 'retain',
                                desc: 'Array of keys to be retained'
                            }, {
                                name: 'sameObj',
                                desc: 'If the filter operation has to be applied on the same obj or a copy of it. Defaults to false'
                            }
                        ],
                        desc: "Retains only the given keys in the object",
                        example: `
var obj = {a: 1, b: 1, c: 1},
    retain = ["a", "b"];

console.log(helper.retainKeysInObj(obj, filter, false)) // {a: 1, b: 1}
// obj = {a: 1, b: 1, c: 1}


console.log(helper.retainKeysInObj(obj, filter, true)) // {a: 1, b: 1}
console.log(obj) // {a: 1, b: 1}
                    `
                    },
                    {
                        id: 'weakPwd',
                        name: 'weakPwd(password: string, config: object) => string',
                        nav: 'weakPassword',
                        return: {
                            type: 'string',
                            desc: 'Returns if the given string does not satisfy the conditions specified in the config object'
                        },
                        params: [
                            {
                                name: 'password',
                                desc: 'String to check for weak password'
                            }, {
                                name: 'config',
                                desc: 'Object'
                            }, {
                                name: 'sameObj',
                                optional: true,
                                desc: ''
                            }
                        ],
                        desc: `Checks if the given string is a weak password`,
                        example: [`
var Helper = require("server-helper").Helper
                    `, `
var helper = another.line;                    
                    `]
                    },
                ]
            },
            "Session-JWT": {
                methods: [{
                        id: 'login',
                        name: 'login(password: string, config: object) => string',
                        nav: 'login',
                        return: {
                            type: 'string',
                            desc: 'Returns if the given string does not satisfy the conditions specified in the config object'
                        },
                        params: [
                            {
                                name: 'password',
                                desc: 'String to check for weak password'
                            }, {
                                name: 'config',
                                desc: 'Object'
                            }, {
                                name: 'sameObj',
                                optional: true,
                                desc: ''
                            }
                        ],
                        desc: `Checks if the given string is a weak password`,
                        example: [`
var Helper = require("server-helper").Helper
                    `, `
var helper = another.line;                    
                    `]
                    },]
            },
            "Session-Cookie": {
                methods: [{
                    name: 'Test1',
                    id: 'session.jwt.test1',
                    nav: 'test1'
                }]
            }
        }
    }])
}