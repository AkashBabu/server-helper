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
                            desc: 'Returns error, if the given string does not satisfy the conditions specified in the config object'
                        },
                        params: [
                            {
                                name: 'password',
                                desc: 'String to check for weak password'
                            }, {
                                name: 'config',
                                desc: `{
                                    minLen?: number;
                                    maxLen?: number;
                                    upperCase?: boolean;
                                    lowerCase?: boolean;
                                    specialChars?: string[];
                                }`
                            }
                        ],
                        desc: `Checks if the given string is a weak password`,
                        example: [`
var password = "Test123"
console.log(helper.weakPwd(password, {minLen: 3, maxLen: 5}))
// Please choose a password length of atmost 5 characters
                    `
                        ]
                    },
                    {
                        id: 'prefixToQueryObject',
                        name: 'prefixToQueryObject(prefix: string, obj: object) => object',
                        nav: 'prefixToQueryObject',
                        return: {
                            type: 'object',
                            desc: 'Object with prefixed keys'
                        },
                        params: [
                            {
                                name: 'prefix',
                                desc: 'String to be prefixed to each key'
                            }, {
                                name: 'obj',
                                desc: `Object whose keys has to be prefixed`
                            }
                        ],
                        desc: `Prefix the given key to each string in the object`,
                        example: [`
var obj = {a: 1, b: 1};
var prefix = "test"
console.log(helper.prefixToQueryObject(prefix, obj))
// {"test.a" : 1, "test.b": 1}
                    `
                        ]
                    },
                    {
                        id: 'validateFieldsCb',
                        name: 'validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void;',
                        nav: 'validateFieldsCb',
                        params: [
                            {
                                name: 'obj',
                                desc: 'Object to be validated'
                            }, {
                                name: 'fieldSpecs',
                                desc: `[{
                                    name: string;
                                    type: any;
                                    required?: boolean;
                                    preTransform?: IPreTransform;
                                    preTransformArgs?: any[];
                                    validate?: IValidationFn | IValidationFn[];
                                    validateArgs?: any[];
                                    validateErrMsg: string | string[];
                                    transform: ITransformFn | ITransformFn[];
                                    transformArgs: any[];
                                    unique?: boolean;
                                    errMsg: string;
                                }]`
                            }, {
                                name: 'strict',
                                desc: 'If this is true'
                            }
                        ],
                        desc: `Prefix the given key to each string in the object`,
                        example: [`
var obj = {a: 1, b: 1};
var prefix = "test"
console.log(helper.prefixToQueryObject(prefix, obj))
// {"test.a" : 1, "test.b": 1}
                    `
                        ]
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