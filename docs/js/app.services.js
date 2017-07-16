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
                                desc: '[object] Input object'
                            }, {
                                name: 'filter',
                                desc: '[string[]] Array of keys to be removed'
                            }, {
                                name: 'sameObj (optional)',
                                desc: '[boolean] If the filter operation has to be applied on the same obj or a copy of it.',
                                default: "false"
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
                                desc: '[object] Input object'
                            }, {
                                name: 'retain',
                                desc: '[string[]] Array of keys to be retained'
                            }, {
                                name: 'sameObj (optional)',
                                desc: '[boolean] If the filter operation has to be applied on the same obj or a copy of it.',
                                default: "false"
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
                            desc: 'Error, if the given string does not satisfy the conditions specified in the config object'
                        },
                        params: [
                            {
                                name: 'password',
                                desc: '[string] String to check for weak password'
                            }, {
                                name: 'config',
                                desc: '[object] Weak password Options'
                            }, {
                                name: '-> config.minLen (optional)',
                                desc: '[boolean] Minimum length of password expected'
                            }, {
                                name: '-> config.maxLen (optional)',
                                desc: '[boolean] Maximum length of password expected'
                            }, {
                                name: '-> config.upperCase (optional)',
                                desc: '[boolean] If password should contain an UpperCase letter'
                            }, {
                                name: '-> config.lowerCase (optional)',
                                desc: '[boolean] If password should contain an LowerCase letter'
                            }, {
                                name: '-> config.specialChars (optional)',
                                desc: '[string[]] If password must contain atleast one special character from the given list'
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
                                desc: '[string] String to be prefixed to each key'
                            }, {
                                name: 'obj',
                                desc: `[object] Object whose keys has to be prefixed`
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
                                desc: '[object] Object to be validated'
                            }, {
                                name: 'fieldSpecs',
                                desc: "[object[]] Field Validation Options",
                            }, {
                                name: '-> fieldSpec.name',
                                desc: `[string] Name of the field`
                            }, {
                                name: '-> fieldSpec.type',
                                desc: `[string] Expected type of the field`
                            }, {
                                name: '-> fieldSpec.required (optional)',
                                desc: `[boolean] If the field is required to be present`
                            }, {
                                name: '-> fieldSpec.preTransform',
                                desc: `[Function : (data, ...preTransformArgs) => any]. Returned Data would be futher used for validation`
                            }, {
                                name: '-> fieldSpec.preTransformArgs',
                                desc: `[any[]] Arguments to be passed to fieldSpec.preTranform function`
                            }, {
                                name: '-> fieldSpec.validate',
                                desc: `[Function| Function[] : (data, ...validateArgs[index], done?: (err, isValid: boolean))]. Validation Function/s. If the number of args(data + validateArgs) > function.arguments.length then the last param is considered as a callback and the same is passed to the validation function`
                            }, {
                                name: '-> fieldSpec.validateArgs',
                                desc: `[any[]] Arguments to be passed to fieldSpec.validate function`
                            }, {
                                name: '-> fieldSpec.validateErrMsg',
                                desc: `[string | string[]] Error Messages to be returned on validation failure`
                            }, {
                                name: '-> fieldSpec.transform',
                                desc: `[Function | Function[] : (data, ...transformArgs, done?: (err, transformedData) => void)]: any. Transform Function/s. If the number of args(data + transformArgs) > function.arguments.length then the last param is considered as a callback and the same is passed to the transform function`
                            }, {
                                name: '-> fieldSpec.transformArgs',
                                desc: `[any | any[]] Arguments to be passed to fieldSpec.transform function`
                            }, {
                                name: '-> fieldSpec.errMsg',
                                desc: `This will be return when fieldName is not present/type mismatch is found/validation errMsg is not specified`
                            }, {
                                name: 'strict',
                                desc: 'If this is true, then the fields that are not specified in fieldSpecs will be removed'
                            }
                        ],
                        desc: `Asynchronous form validations`,
                        example: [`
var obj = {a: 1, b: "asdf", c: [], d: {}, e: '2'};
var validations = [
    {
        name: 'a',
        type: "number",
        errMsg: "'a' is a required field and must be a number"
    }, {
        name: 'b',
        type: 'string',
        validate: (data, len) => data.length > len,
        validateArgs: 2,
        validateErrMsg: "'b' must have a atleast 2 characters",
        errMsg: "'b' is a required field"
    }, {
        name: 'c',
        type: 'array',
        errMsg: "'c' must be an array"
    }, {
        name: 'd',
        type: 'object',
        errMsg: "'d' must be an object"
    }, {
        name: 'e',
        type: ['string', 'number'],
        preTransform: (data) => parseInt(data),
        validate: (data, minVal) => data > minVal,
        validateArgs: 2
    }, {
        name: 'f',
        type: 'string',
        required: false,
        errMsg: "'f' must be a string"
    }
]

helper.validateFieldsCb(obj, validations, false, (err) => console.log(err))
// null
                    `
                        ]
                    },
                    {
                        id: 'validateFields',
                        name: 'validateFields(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;',
                        return: {
                            type: 'boolean',
                            desc: 'true - if all the fields are valid'
                        },
                        nav: 'validateFields',
                        desc: `(Recommend to use validateFieldsCb) Synchronous form validations. Params are same as validateFieldsCb except that validateFns and transformFns are all synchronous functions`,
                        params: [
                            {
                                name: 'obj',
                                desc: '[object] object to be validated'
                            }, {
                                name: 'fieldSpecs',
                                desc: '[object] Field Validation options'
                            }, {
                                name: '-> fieldSpec.name',
                                desc: '[string] Name of field'
                            }, {
                                name: '-> fieldSpec.type',
                                desc: '[string | string[]] Expected type of the field'
                            }, {
                                name: '-> fieldSpec.preTransform',
                                desc: '[(data, ...preTransformArgs) => any] Pre-Transform function'
                            }, {
                                name: '-> fieldSpec.preTransformArgs',
                                desc: '[any[]] Arguments for preTransform function'
                            }, {
                                name: '-> fieldSpec.validate',
                                desc: '[Function | Function[] : (data, ...validateArgs) => boolean] Validation function/s '
                            }, {
                                name: '-> fieldSpec.validateArgs',
                                desc: '[any[]] Arguments for validate function/s'
                            }, {
                                name: '-> fieldSpec.transform',
                                desc: '[(data, ...transformArgs) => any] Transform function'
                            }, {
                                name: '-> fieldSpec.transformArgs',
                                desc: '[any[]] Arguments for tranform function'
                            }
                        ],
                        example: [`
var obj = {a: 1, b: "asdf", c: [], d: {}, e: '2'};
var validations = [
    {
        name: 'a',
        type: "number",
    }, {
        name: 'b',
        type: 'string',
        validate: (data, len) => data.length > len,
        validateArgs: 2,
    }, {
        name: 'c',
        type: 'array',
    }, {
        name: 'd',
        type: 'object',
    }, {
        name: 'e',
        type: ['string', 'number'],
        preTransform: (data) => parseInt(data),
        validate:  [ minValueCheck, maxValueCheck ],
        validateArgs: 2
    }, {
        name: 'f',
        type: 'string',
        required: false,
    }
]

if(helper.validateFields(obj, validations, false)) {
    // All Fields are valid
}
                    `
                        ]
                    }, {
                        id: 'saltHash',
                        name: 'saltHashsaltHash(pwd: string, saltLength?: number) => string',
                        nav: 'saltHash',
                        return: {
                            type: 'string',
                            desc: 'Salted and hashed password'
                        },
                        params: [
                            {
                                name: 'pwd',
                                desc: '[string] String to be salted and hashed'
                            }, {
                                name: 'saltLength (optional)',
                                desc: `[number] Length of salt to be Prefixed`,
                                default: '16'
                            }
                        ],
                        desc: `Adds a salt and hashes the password`,
                        example: [`
var password = "password";
console.log(helper.saltHash(password, 10));
// 567981784abc67f9678fa760bc679e67879a7c - this is just an indicative password
                    `
                        ]
                    }, {
                        id: 'verifySaltHash',
                        name: 'verifySaltHash(salted: string, pwd: string, saltLength?: number) => boolean',
                        nav: 'verifySaltHash',
                        return: {
                            type: 'boolean',
                            desc: 'true - if the password matches the salted hash'
                        },
                        params: [
                            {
                                name: 'salted',
                                desc: '[string] Salted and hashed password'
                            }, {
                                name: 'pwd',
                                desc: `[string] Password to be validated`
                            }, {
                                name: 'saltLength (optional)',
                                desc: `[number] Length of salt prefix in the salted hash`,
                                default: '16'
                            }
                        ],
                        desc: `Verifies if the salted hash password matches the password`,
                        example: [`
var password = "password"
var salted = "567981784abc67f9678fa760bc679e67879a7c"; // this is just an indicative password
helper.verifySaltHash(salted, password, 10) // returns true
                    `
                        ]
                    },
                ]
            },
            "Response": {
                desc: 'HTTP Response helper implementation',
                initialCode: `
var HelperResp = require("server-helper").HelperResp;
var helperResp = new HelperResp();

// Please note the response format followed in this library is in the form
{
    error: true|false,
    data: {}
}
                `,
                methods: [{
                    id: 'success',
                    name: 'success(res: express.Response, data?: any)',
                    nav: 'success',
                    desc: 'HTTP 200 Success handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'data',
                        desc: '[any] Response data'
                    }],
                    example: [
                        `
// if the request was a success then
helperResp.success(res);
                        `
                    ]
                }, {
                    id: 'failed',
                    name: 'failed(res: express.Response, msg?: string)',
                    nav: 'failed',
                    desc: 'HTTP 400 Success handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'msg',
                        default: 'Failed',
                        desc: '[string] Error Message'
                    }],
                    example: [
                        `
// if the request was a failure
helperResp.failed(res, 'Name missing')
                        `
                    ]
                }, {
                    id: 'post',
                    name: 'post(res: express.Response, data?: any)',
                    nav: 'post',
                    desc: 'CRUD - Create handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'data',
                        desc: '[any] Response data',
                        default: "CREATED"
                    }],
                    example: [`
// If the data was successfully inserted into DB then
db.collection('test').insert(data, (err, result) => {
    if(result) {
        helperResp.post(res, result)
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Creation Failed")
        }
    }
})
                    `]
                }, {
                    id: 'put',
                    name: 'put(res: express.Response, data?: any)',
                    nav: 'put',
                    desc: 'CRUD - Update handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'data',
                        desc: '[any] Response data',
                        default: "UPDATED"
                    }],
                    example: [`
// If the data was successfully updated in DB then
db.collection('test').update({}, {$set: data}, (err, result) => {
    if(result && result.nModified) {
        helperResp.put(res, result)
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Update Failed")
        }
    }
})
                    `]
                }, {
                    id: 'delete',
                    name: 'delete(res: express.Response, data?: any)',
                    nav: 'delete',
                    desc: 'CRUD - Delete Handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'data',
                        desc: '[any] Response data',
                        default: "DELETED"
                    }],
                    example: [`
// If the data was successfully removed from DB then
db.collection('test').remove(data, (err, result) => {
    if(result) {
        helperResp.delete(res, result)
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Delete Failed")
        }
    }
})
                    `]
                }, {
                    id: 'get',
                    name: 'get(res: express.Response, data?: any, list?: boolean)',
                    nav: 'get',
                    desc: 'CRUD - get n list Handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'data',
                        desc: '[any] Response data',
                        default: "[] | {} depending on .list"
                    }, {
                        name: 'list',
                        type: 'boolean',
                        default: 'true',
                        desc: '[boolean] if true then data defaults to [] else {}'
                    }],
                    example: [`
// If the data was successfully obtained from DB then
db.collection('test').find({}, (err, result) => {
    if(result) {
        helperResp.get(res, result, true);
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Failed to get data from DB")
        }
    }
})
                    `]
                }, {
                    id: 'unauth',
                    name: 'unauth(res: express.Response, msg?: string)',
                    nav: 'unatuh',
                    desc: 'HTTP 401 handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'msg',
                        desc: '[string] Response data',
                        default: "UNAUTHORIZED ACCESS"
                    }],
                    example: [`
// If the user is unauthorized
helperResp.unauth(res);
                    `]
                }, {
                    id: 'serverError',
                    name: 'serverError(res: express.Response, msg?: string)',
                    nav: 'serverError',
                    desc: 'HTTP 500 Handler',
                    params: [{
                        name: 'res',
                        desc: 'Express Response object'
                    }, {
                        name: 'msg',
                        desc: '[string] Response data',
                        default: "INTERNAL SERVER ERROR"
                    }],
                    example: [`
// On Internal Server Error                     
helperResp.serverError(res);
                    `]
                }, {
                    id: 'handleResult',
                    name: 'handleResult(res: express.Response) => (err: any, result: any, type: string)',
                    nav: 'handleResult',
                    desc: 'Generic Callback Result handler',
                    params: [
                        {
                            name: 'res',
                            desc: 'Express Response Object'
                        }
                    ]
                }],
                example: [`
// If data is obtained from a callback(err, result), then replace it with handleResult
db.collection('test').find({}, helperResp.handleResult(res));                
                `]
            },
            "Validations": {
                desc: "Includes common validation functions",
                initialCode: `
var HelperValidate = require('server-helper').HelperValidate;
var helperValidate = new HelperValidate()

// These Helper Function are commonly used in form validation along with helper.validateFieldsCb
                `,
                methods: [{
                    id: 'range',
                    name: 'range(data: number, min: number, max: number) => boolean',
                    nav: 'range',
                    desc: "Validates if the given number if within the specified range",
                    params: [{
                        name: 'data',
                        type: 'number',
                        desc: 'Data to be validated'
                    }, {
                        name: 'min',
                        type: 'number',
                        desc: 'Lower Limit'
                    }, {
                        name: 'max',
                        type: 'number',
                        desc: 'Upper Limit'
                    }],
                    example: [`
var data = 10;
helperValidate.range(10, 5, 15) // true                
                    `]
                }, {
                    id: 'length',
                    name: 'length(data: string, min: number, max?: number) => boolean',
                    nav: 'length',
                    desc: "Validates if the length of the array|string is within the limits",
                    params: [{
                        name: 'data',
                        type: 'string|array',
                        desc: 'Data to be validated'

                    }, {
                        name: 'min',
                        type: 'number',
                        desc: 'Lower Limit'
                    }, {
                        name: 'max (optional)',
                        type: 'number',
                        desc: 'Upper Limit. If this param is not provided then only lower limit validation is performed'
                    }],
                    example: [`
var data = "test";
helperValidate.length(data, 2, 6) // true
var arr = [1, 2]
helperValidate.length(data, 3, 5) // false                    
                    `]
                }, {
                    id: 'isMongoId',
                    name: 'isMongoId(id: string) => boolean',
                    nav: 'isMongoId',
                    desc: "Validates if the given string is a valid MongoId",
                    params: [{
                        name: 'id',
                        type: 'string',
                        desc: 'Id to be validated'
                    }],
                    example: [`
var id = "5968d825f7031236fed9ec5f"
helperValidate.isMongoId(id) // true                    
                    `]
                }, {
                    id: 'in',
                    name: 'in(data: any, arr: any[]) => boolean',
                    nav: 'in',
                    desc: 'Checks if the data is present in the given array',
                    params: [{
                        name: 'data',
                        type: 'string|number|object|array',
                        desc: 'Data to be checked'
                    }, {
                        name: 'arr',
                        type: 'array',
                        desc: 'Array to be searched for Data'
                    }],
                    example: [`
var data = 'a',
    arr = ['a', 'b']

helperValidate.in(data, arr) // true                    
                    `, `
var data = { name: 1, age: 3 }
var data2 = [1, 2]
var arr = [{ name: 2 }, { name: 1, age: 3 }, [1, 2]]
helperValidate.in(data, arr) // true
helperValidate.in(data2, arr) // true
                    `]
                }, {
                    id: 'isName',
                    name: 'isName(name: string) => boolean',
                    nav: 'isName',
                    desc: 'validate if the given string matches the Name format',
                    params: [{
                        name: 'name',
                        type: 'string',
                        desc: 'Data to be checked'
                    }],
                    example: [`
var name = 'isName_123';
helperValidate.isName(name) // true                    
                    `]
                }, {
                    id: 'isEmail',
                    name: 'isEmail(email: string) => boolean',
                    nav: 'isEmail',
                    desc: 'Validate if the given string matches the Eamil format',
                    params: [{
                        name: 'email',
                        type: 'string',
                        desc: 'Data to be checked'
                    }],
                    example: [`
var email = '123_asdf.jkl@co.com';
helperValidate.isEmail(email) // true                    
                    `]
                }, {
                    id: 'isAlpha',
                    name: 'isAlpha(data: string) => boolean',
                    nav: 'isAlpha',
                    desc: 'validate if the given string contains only Alphabets',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'Data to be checked'
                    }],
                    example: [`
var str = 'asdfAASDF';
helperValidate.isAlpha(str) // true                    
                    `]
                }, {
                    id: 'isNumeric',
                    name: 'isNumeric(data: string): boolean',
                    nav: 'isNumeric',
                    desc: 'validate if the given string contains only numbers',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'Data to be checked'
                    }],
                    example: [`
var str = '2345678';
helperValidate.isNumeric(str) // true                    
                    `]
                }, {
                    id: 'isAlphaNumeric',
                    name: 'isAlphaNumeric(data: string) => boolean',
                    nav: 'isAlphaNumeric',
                    desc: 'validate if the given string is Alphabets and numbers',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'Data to be checked'
                    }],
                    example: [`
var str = 'isName123';
helperValidate.isAlphaNumeric(str) // true                    
                    `]
                }, {
                    id: 'isDate',
                    name: 'isDate(dateStr: string, format?: string) => boolean',
                    nav: 'isDate',
                    desc: 'Validate if the given string is in Data format',
                    params: [{
                        name: 'dateStr',
                        type: 'string',
                        desc: 'Data to be checked'
                    }, {
                        name: 'format (optional)',
                        type: 'string',
                        desc: 'Moment Date format'
                    }],
                    example: [`
var dateStr = '12-07-1993';
helperValidate.isDate(dateStr, 'DD-MM-YYYY') // true                    
                    `]
                }, {
                    id: 'isRegex',
                    name: 'isRegex(data: string, regexStr: string) => boolean',
                    nav: 'isRegex',
                    desc: 'Check if the data matches the regexStr pattern',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'Data to be checked'
                    }, {
                        name: 'regexStr',
                        type: 'string',
                        desc: 'regex pattern to be used for validation'
                    }],
                    example: [`
var name = 'asdfASD_09';
helperValidate.isRegex(name, '^[a-fA-F09]+$') // true                    
                    `]
                }]
            },
            "Transformations": {
                desc: "Common data transformation functions",
                initialCode: `
var HelperTransform = require('server-helper').HelperTransform;
var helperTransform = new HelperTransform();

// These function are typically used for transformation in helper.validateFieldsCb
                `,
                methods: [{
                    id: 'toLowerCase',
                    name: 'toLowerCase(data: string) => string',
                    nav: 'toLowerCase',
                    desc: 'Transforms the given string to Lower Case',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'Data to be transformed',
                    }],
                    example: [`
var str = "asdfASDF";
helperTransform.toLowerCase(str) // asdfasdf
                   `]
                }, {
                    id: 'toUpperCase',
                    name: 'toUpperCase(data: string) => string',
                    nav: 'toUpperCase',
                    desc: 'Transforms the given string to Upper Case',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'Data to be transformed',
                    }],
                    example: [`
var str = "asdfASDF";
helperTransform.toUpperCase(str) // ASDFASDF
                   `]
                }, {
                    id: 'toMongoId',
                    name: 'toMongoId(id: string) => object',
                    nav: 'toMongoId',
                    desc: 'Transforms mongo id to Mongo Object id',
                    params: [{
                        name: 'id',
                        type: 'string',
                        desc: 'Mongo document id as string',
                    }],
                    example: [`
var id = "5968d825f7031236fed9ec5f";
helperTransform.toMongoId(id) // ObjectId("5968d825f7031236fed9ec5f")
                   `]
                }, {
                    id: 'toDate',
                    name: 'toDate(dateStr: string) => Date',
                    nav: 'toDate',
                    desc: 'Transforms the given string to Date Object',
                    params: [{
                        name: 'dateStr',
                        type: 'string',
                        desc: 'Date string',
                    }],
                    example: [`
var dateStr = "1993-07-12T00:00:00.000Z"
helperTransform.toDate(dateStr) // Date()
                   `]
                }, {
                    id: 'toMoment',
                    name: 'toMoment(dateStr: string) => object',
                    nav: 'toMoment',
                    desc: 'Transforms the given string to moment object',
                    params: [{
                        name: 'dateStr',
                        type: 'string',
                        desc: 'Date String',
                    }],
                    example: [`
var dateStr = "1993-07-12"
helperTransform.toMoment(dateStr) // moment()
                   `]
                }, {
                    id: 'toInt',
                    name: 'toInt(data: string) => number',
                    nav: 'toInt',
                    desc: 'Parse string to number',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'number in string',
                    }],
                    example: [`
var data = "2"
helperTransform.toInt(data) // 2
                   `]
                }, {
                    id: 'toFloat',
                    name: 'toFloat(data: string, decPoints?: number) => number',
                    nav: 'toFloat',
                    desc: 'Parse string to float',
                    params: [{
                        name: 'data',
                        type: 'string',
                        desc: 'number in string',
                    }, {
                        name: 'decPoints (optional)',
                        type: 'number',
                        desc: "Decimal points to be included in float",
                        default: "5"
                    }],
                    example: [`
var data = "2.1234"
helperTransform.toFloat(data, 2) // 2.12
                   `]
                }, {
                    id: 'toSaltHash',
                    name: 'toSaltHash(pwd: string) => string',
                    nav: 'toSaltHash',
                    desc: 'Adds salt and hashes the given the string',
                    params: [{
                        name: 'pwd',
                        type: 'string',
                        desc: 'password',
                    }],
                    example: [`
var pwd = "asdf";
helperTransform.toSaltHash(pwd) // 5678ab98fe988a98b67c89322efa779
                   `]
                }, {
                    id: 'stripXss',
                    name: 'stripXss(str: string) => string',
                    nav: 'stripXss',
                    desc: 'Removes all the html tags and the data inbetween the tags',
                    params: [{
                        name: 'str',
                        type: 'string',
                        desc: '',
                    }],
                    example: [`
var str = "hello <script>World</script>";
helperTransform.stripXss(str) // hello 
                   `]
                }]
            },
            "MongoDB": {
                desc: "Common MongoDb operation for CRUD",
                initialCode: `
var HelperMongo = require('server-helper').HelperMongo;
var helperMongo = new HelperMongo(connStr);
                `,
                methods: [{
                    id: 'validateExistence',
                    name: 'validateExistence(collName: string, validate: any, cb: Function)',
                    nav: 'validateExistence',
                    desc: 'Validates if there is any document matching the given query',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'validate',
                        type: 'object',
                        desc: 'Mongo find() query object',
                    }, {
                        name: 'cb',
                        type: '(err, result) => void',
                        desc: 'Callback',
                    }],
                    example: [`
var data = {
    name: "test"
}
db.collection("validateExistenceColl").insert(data, (err, result) => {
    if (result) {
        helperMongo.validateExistence("validateExistenceColl", { name: "test" }, (err, result) => {
            console.log(result)
        })
    } else {
        console.warn("Unable to insert data to test validateExistence")
    }
})
                   `]
                }, {
                    id: 'validateNonExistence',
                    name: 'validateNonExistence(collName: string, validations: object | object[], cb: ICallback)',
                    nav: 'validateNonExistence',
                    desc: 'Validate no document matches for all the given validations(queries)',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'validations',
                        type: 'object | object[]',
                        desc: 'Validations for document',
                    }, {
                        name: '-> validation.query',
                        type: 'object',
                        desc: 'Mongo find() query object',
                    }, {
                        name: '-> validation.errMsg',
                        type: 'object | object[]',
                        desc: 'Validations for document',
                    }],
                    example: [`
var data1 = {
    name: 'test1',
    checking: 'validations',
    type: "multi"
}
var data2 = {
    name: 'test2',
    checking: 'validations',
    type: "multi"
}

db.collection('validateNonExistence').insert([data1, data2], (err, result) => {
    if (!err) {
        let validations = [
            {
                query: {
                    name: 'test3'
                },
                errMsg: "Duplicate Name"
            }, {
                query: {
                    checking: 'validations',
                    type: 'multi'
                },
                errMsg: 'Duplicate Methods'
            }
        ]
        helperMongo.validateNonExistence('validateNonExistence', validations, (err, result) => {
            should.exist(err);
            should.not.exist(result);
            err.should.be.eql("Duplicate Methods")

            done()
        })
    }
})
                   `]
                }, {
                    id: 'validateNonExistenceOnUpdate',
                    name: 'validateNonExistenceOnUpdate(collName: string, obj: IMongoDoc, validations: object | object[], cb: Function)',
                    nav: 'validateNonExistenceOnUpdate',
                    desc: 'Validates that the updated document does not collide with unique fields in the collection',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'obj',
                        type: 'object',
                        desc: 'Updated object that has to updated in mongoDB',
                    }, {
                        name: 'validations',
                        type: 'object',
                        desc: 'Set of validations to avoid collision of unique field on update'
                    }, {
                        name: '-> validation.name',
                        type: 'string',
                        desc: 'Document field name'
                    }, {
                        name: '-> validation.query',
                        type: 'object',
                        desc: 'Mongo find() query object'
                    }, {
                        name: '-> validation.errMsg',
                        type: 'string',
                        desc: 'Error message to return on validation failure'
                    }, {
                        name: 'cb',
                        type: '(err, result) => void',
                        desc: 'Callback`'
                    }],
                    example: [`
var data1 = {
    name: "test1",
    checking: 'validateNonExistenceOnUpdate'
}
var data2 = {
    name: "test2",
    checking: 'validateNonExistenceOnUpdate'
}
db.collection("validateNonExistenceOnUpdate2").insert([data1, data2], (err, result) => {
    if (!err) {
        var validations = [
            {
                name: "name"
            }
        ]
        result[0].name = 'test2'
        helperMongo.validateNonExistenceOnUpdate('validateNonExistenceOnUpdate2', result[0], validations, (err, result) => {
            should.exist(err);
            err.should.be.eql("Duplicate name");
            result.should.be.eql(1)

            done()
        })

    }
})
                   `]
                }, {
                    id: 'getById',
                    name: 'getById(collName: string, id: string, cb: ICallback)',
                    nav: 'getById',
                    desc: 'Get a document that matches the given id',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'id',
                        type: 'string',
                        desc: 'Mongo Document id',
                    }, {
                        name: 'cb',
                        type: "(err, document) => void",
                        desc: 'Callback'
                    }],
                    example: [`
 var data = {
    name: 'test'
}
db.collection("getById2").insert(data, (err, result) => {
    if (!err) {
        helperMongo.getById("getById2", result._id, (err, result1) => {
            should.not.exist(err);
            result1._id.should.be.eql(result._id);
            result1.name.should.be.eql(result.name);

            done();
        })
    }
})
                   `]
                }, {
                    id: 'getNextSeqNo',
                    name: 'getNextSeqNo(collName: string, obj: IMaxValue, cb: Function)',
                    nav: 'getNextSeqNo',
                    desc: 'Get the next sequence number of a numerical field in a collection',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'obj',
                        type: 'object',
                        desc: 'Options',
                    }, {
                        name: '-> obj.key',
                        type: 'string',
                        desc: 'Key for which max value has to be found. Make sure that this field is of type number else erroneous output would be expected'
                    }, {
                        name: "-> obj.query",
                        type: 'object',
                        desc: 'MongoDB $match query object'
                    }, {
                        name: '-> obj.unwind',
                        type: 'object',
                        desc: 'if the max value has to be found within an array in a document, then specify the key',
                        default: 'null'
                    }, {
                        name: '-> obj.maxValue (optional)',
                        default: 'infinite',
                        type: 'number',
                        desc: 'Maximum allowed sequence number'
                    }, {
                        name: '-> obj.minValue (optional)',
                        default: '0',
                        type: 'number',
                        desc: 'Minimum allowed sequence number'
                    }, {
                        name: '-> obj.errMsg (optional)',
                        default: 'Could not Get Next Sequence Number',
                        type: 'string',
                        desc: "Error Message to return when a sequence number could not be found"
                    }],
                    example: [`
var data = [
    {
        num: 1
    }, {
        num: 2
    }, {
        num: 10
    },
]
db.collection("getNextSeqNo1").insert(data, (err) => {
    if (!err) {
        var nextSeqQuery = {
            // query: {},
            key: 'num'
        }
        helperMongo.getNextSeqNo('getNextSeqNo1', nextSeqQuery, (err, result) => {
            should.not.exist(err);
            result.should.be.eql(11);

            done()
        })
    }
})
                   `]
                }, {
                    id: 'update',
                    name: 'update(collName: string, obj: object, exclude?: string[], cb?: Function)',
                    nav: 'update',
                    desc: 'Updates the document excluding the specified fields from the object ',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'obj',
                        type: 'object',
                        desc: 'Mongo document',
                    }, {
                        name: 'exclude (optional)',
                        default: '[]',
                        type: 'string[]',
                        desc: 'fields to excluded while updating the document'
                    }, {
                        name: 'cb',
                        type: '(err, result) => void',
                        desc: "Callback"
                    }],
                    example: [`
var data = {
    name: 'test',
    field2: 'should Not Be Updated'
}
db.collection('update4').insert(data, (err, result) => {
    if (!err) {
        result.field2 = "updated data";
        result.name = "updated name";

        helperMongo.update('update4', result, ["field2"], (err, result1) => {
            should.not.exist(err);
            result1.should.be.an("object");
            result1.n.should.be.eql(1);

            db.collection("update4").findOne({ _id: result._id }, (err, result2) => {
                should.not.exist(err);
                result2.should.be.an("object");
                result2.field2.should.be.eql("should Not Be Updated")
                result2.name.should.be.eql("updated name")

                done()
            })
        })
    }
})
                   `]
                }, {
                    id: 'getList',
                    name: 'getList(collName: string, obj: object, cb: Function)',
                    nav: 'getList',
                    desc: 'Get a list of documents in a collection - can be used for CRUD - list apis',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'obj',
                        type: 'object',
                        desc: 'options',
                    }, {
                        name: '-> obj.pageNo (optional)',
                        default: '1',
                        type: 'number',
                        desc: 'Page number for pagination'
                    }, {
                        name: '-> obj.recordsPerPage (optional)',
                        default: 'all',
                        type: 'number',
                        desc: 'Number of records per page'
                    }, {
                        name: '-> obj.query (optional)',
                        default: '{}',
                        type: 'object',
                        desc: 'Mongo query filter for the list'
                    }, {
                        name: '-> obj.project (optional)',
                        default: '{}',
                        type: 'object',
                        desc: 'Mongo find() project object'
                    }, {
                        name: '-> obj.search (optional)',
                        type: 'string',
                        desc: 'Search Text'
                    }, {
                        name: "-> obj.searchField (optional)",
                        sdefault: 'name',
                        type: 'string',
                        desc: 'Field on which search text must be filtered'
                    }, {
                        name: '-> obj.sort (optional)',
                        default: '{}',
                        type: 'object',
                        desc: 'Order in which the documents must be sorted ex: -name| name'
                    }],
                    example: [`
 var data = [
    {
        name: 'test1'
    }, {
        name: 'test2'
    }, {
        name: 'test3'
    }
]
db.collection('getList8').insert(data, (err, result) => {
    if (!err) {
        helperMongo.getList("getList8", {
            project: { name: 1, _id: 0 },
            sort: '-name'
        }, (err, result1) => {
            should.not.exist(err);
            result1.should.be.an("object");
            result1.count.should.be.eql(3);
            result1.list.length.should.be.eql(3);
            result1.list[0].name.should.be.eql("test3")
            result1.list[1].name.should.be.eql("test2")
            result1.list[2].name.should.be.eql("test1")

            done();
        })
    }
})
                   `]
                }, {
                    id: 'remove',
                    name: 'remove(collName: string, id: string, removeDoc?: boolean, cb: Function)',
                    nav: 'remove',
                    desc: 'Remove a document',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'id',
                        type: 'string',
                        desc: 'Mongo Document Id',
                    }, {
                        name: 'removeDoc (optional)',
                        default: 'true',
                        type: 'boolean',
                        desc: 'if true would remove the document else would set isDeleted flag and delTime(Deleted time) on the document. Please note that if isDeleted flag is set, then the corresponding query should be maintained while fetching the documents that are not deleted. This can be used only when a history is crucial'
                    }],
                    example: [`
var data = {
    name: 'test'
}
db.collection('remove3').insert(data, (err, result) => {
    if (!err) {
        helperMongo.remove("remove3", result._id, false, (err, result1) => {
            should.not.exist(err);

            db.collection('remove3').findOne({ _id: result._id }, (err, result2) => {
                should.not.exist(err);
                result2.should.be.an("object");
                result2.isDeleted.should.be.ok;
                should.exist(result2.deltime)

                done();
            })
        })
    }
})
                   `]
                }, {
                    id: 'splitTimeThenGrp',
                    name: 'splitTimeThenGrp(collName: string, obj: object, cb: Function)',
                    nav: 'splitTimeThenGrp',
                    desc: 'Splits the selected range of documents by time and then groups them based on grouping logic',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'obj',
                        type: 'object',
                        desc: 'options',
                    }, {
                        name: '-> obj.key',
                        type: 'object',
                        desc: 'Timestamp key Options'
                    }, {
                        name: '---> obj.key.name',
                        type: 'string',
                        desc: 'Timestamp field name in the document'
                    }, {
                        name: '---> obj.key.min',
                        type: 'Date',
                        desc: 'Lower limit of query selection for timestamp field'
                    }, {
                        name: '---> obj.key.max',
                        type: 'Date',
                        desc: 'Upper limit of query selection for timestamp field'
                    }, {
                        name: '-> obj.project',
                        type: 'string[]',
                        desc: 'Fields to included in the final result'
                    }, {
                        name: '-> obj.groupBy',
                        type: 'string',
                        desc: 'Grouping interval. Possible values are : year, month, day, hour, minute, second, millisecond'
                    }, {
                        name: '-> obj.groupLogic',
                        type: 'string',
                        desc: 'Mongo Aggregation Group logic ex: $first, $last, $avg, $sum etc'
                    }],
                    example: [`
var data = []
var currTs = moment()
var count = 1000;
var interval = 10;
for (var i = 0; i < count; i++) {
    data.push({
        ts: moment().add(i * interval, "seconds")._d,
        // ts: currTs + i * 10,
        x: i
    })
}
var totalSeconds = count * interval
db.collection("splitTimeThenGroup1").insert(data, (err, result) => {
    if (!err) {
        var option = {
            key: {
                name: "ts",
                min: moment()._d,
                max: moment().add(totalSeconds, "seconds")._d,
            },
            project: ['x'],
            groupBy: 'hour',
            groupLogic: '$first'
        }
        var expectedCount = Math.ceil(totalSeconds / 60 / 60);

        helperMongo.splitTimeThenGrp("splitTimeThenGroup1", option, (err, result1) => {
            result1.should.be.an("array");
            console.log("Result:", result)

            done();
        })
    } else {
        console.error("Failed to insert into splitTimeThenGroup1", err)
    }
})
                   `]
                }, {
                    id: 'selectNinM',
                    name: 'selectNinM(collName: string, obj: object, cb: Function)',
                    nav: 'selectNinM',
                    desc: 'Selects n number of documents from m range of selected documents based on grouping logic',
                    params: [{
                        name: 'collName',
                        type: 'string',
                        desc: 'Collection Name',
                    }, {
                        name: 'obj',
                        type: 'object',
                        desc: 'Options',
                    }, {
                        name: '-> obj.numOfPoints',
                        type: 'number',
                        desc: 'Number of points expected in result (M)'
                    }, {
                        name: '-> obj.query',
                        type: 'object',
                        desc: 'Mongo find() query object'
                    }, {
                        name: '-> obj.project',
                        type: 'object',
                        desc: 'Fields to be projected in final result'
                    }, {
                        name: '-> obj.groupLogic',
                        type: 'string',
                        desc: 'Mongo Aggregation Group logic ex: $first, $last, $avg, $sum etc'
                    }],
                    example: [`
var data = [];
for (var i = 0; i < 100; i++) {
    data.push({
        name: 'test' + i,
        num: i
    })
}

db.collection("selectNinM1").insert(data, (err, result) => {
    if (!err) {
        var obj = {
            numOfPoints: 10,
            groupLogic: '$first',
            project: ['name', 'num'],
            query: {}
        }
        helperMongo.selectNinM('selectNinM1', obj, (err, result1) => {
            should.not.exist(err);
            result1.should.be.an('array');
            result1.length.should.be.eql(10);

            done()
        })
    }
})
                   `]
                }]
            },
            "CRUD": {
                desc: "Create standard CRUD APIs",
                initialCode: `
var CRUD = require('server-helper').Crud;
function create() {
    return (req, res, next) => {
        // Some Operation
    }
}
var user = {
    create: create(),
    get: get(),
    list: list(),
    update: update(),
    remove: remove()
}            

var router = express.Router();

router.use("/user", new CRUD(user));

// The above line would create 5 APIs as follows
// POST /user/ -- user.create
// GET /user/:id -- user.get
// GET /user/ -- user.list
// PUT /user/:id -- user.update
// DELETE /user/:id -- user.remove
                `,
            },
            // "CRUD-Handlers": {
            //     desc: "",
            //     initialCode: ``,
            //     methods: [{
            //         id: '',
            //         name: '',
            //         nav: '',
            //         desc: '',
            //         params: [{
            //             name: '',
            //             type: '',
            //             desc: '',
            //             default: ''
            //         }],
            //         example: [`

            //        `]
            //     }]
            // },
            "Session-JWT": {
                desc: "JWT implementation on express",
                initialCode: `
var JWT = require("server-helper").Session.JWT
var options = {
    collName: "users", // users collection
    connStr: 'jwt_test', // MongoDB connection string
    secret: 'secret',
    validity: 1, // In days
    login?: (body, cb) => { cb(null, user) },
    register?: (body, cb) => { cb(null, user) },
    validate?: (whiteList?: string | string[], cb) => { cb(err, user) }
}
var jwt = new JWT(options, true);

app.post("/login", jwt.login())
app.post("/register", jwt.register())
app.use(jwt.validate())

// all other authenticated routes follow this
                `,
                methods: [{
                    id: 'login',
                    name: 'login() => ExpressMiddleware',
                    nav: 'login',
                    return: {
                        type: 'ExpressMiddleware',
                        desc: 'Middleware that can handle user login'
                    },
                    desc: `Middleware that by default handles user login by fetching an user matching the email and verifying saltHash of the password field and returning JWT token, if a login fn is provided then the same would be used for fetching and validating a user`,
                    example: [`
app.post("/login", jwt.login())
                    `]
                }, {
                    id: 'register',
                    name: "register() => ExpressMiddleware",
                    nav: 'register',
                    return: {
                        type: 'ExpressMiddleware',
                        desc: 'Middleware that can handle user register'
                    },
                    desc: 'Middleware that by default handles user register by checking uniqueness of email and salthashing password field and returning JWT token, if a register fn is provided then the same would be used',
                    example: [
                        `
app.post("/register", jwt.register())
                        `
                    ]
                }, {
                    id: 'validate',
                    name: 'validate() => ExpressMiddleware',
                    nav: 'validate',
                    return: {
                        type: 'ExpressMiddleware',
                        desc: 'Middleware that can handle validation'
                    },
                    desc: 'Middleware that by default handles validation by checking if the token has not been expired and the corresponding id is valid, if a validate fn is provided then the same would be used to fetch the user corresponding to the id',
                    example: [
                        `
// Use it from the point where authentication is expected
app.use(jwt.validate())
                        `
                    ]
                }]
            },
            "Session-Cookie": {
                desc: "Cookie Session implementation in Express",
                initialCode: `
var Cookie = require('server-helper').Session.Cookie;

interface ICookieOptions {
    collName: string;
    connStr: string;
    login: IPassportOptions;
    register: IPassportOptions;
    cookie: Object;
    secret: string;
    redisStore: Object;
    passportSerializer?: (user, cb) => void;
    passportDeserializer?: (userId, cb) => void;
    passportLogin?: (req, email, passport, cb) => void;
    passportRegister?: (req, email, passport, cb) => void;
}

var options: ICookieOptions = {
    collName: 'users', // user collection name
    connStr: 'test', // mongoDB connection string
    login: { // Passport Login options
        successRedirect: '/index.html',
        failureRedirect: '/login.html',
        failureFlash: flash
    },
    register: { // Passport Register options
        successRedirect: '/index.html',
        failureRedirect: '/register.html',
        failureFlash: flash
    },
    cookie: { // express-session cookie options
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true,
    },
    secret: 'secret',
    redisStore: { // Connect-redis connection options
        ttl: 1000 * 60 * 60 * 24,
        host: "localhost",
        port: 6379,
        prefix: "sess:"
    }
}
// if you wish to have custom logic for passport local-strategy then you must specify options.passportSerializer, options.passportDeserializer, options.passportLogin and options.passportRegister functions. These function signature are similar to that of passport functions

var passport = require("passport");
var cookie = new Cookie(options);
var app = express();

// this order has to be maintained
cookie.configurePassport(passport);
cookie.configureSession(app)

app.use(cookie.validate(['/login.html', '/register.html', {method: 'POST', url: '/login'}, '/register'], '/portal/login'))

app.post('/login', cookie.login());
app.post('/register', cookie.register());

app.get("/logout", cookie.logout());
                `,
                methods: [{
                    id: 'login',
                    name: 'login() => Express Middleware',
                    nav: 'login',
                    desc: 'Validates if the user exists and then sets Session Cookie on the express response object',
                }, {
                    id: 'register',
                    name: 'register() => Express Middleware',
                    nav: 'register',
                    desc: 'Will create and insert a User and sets Session Cookies on the express response object',
                }, {
                    id: 'logout',
                    name: 'logout() => Express Middleware',
                    nav: 'logout',
                    desc: 'Will remove cookie session and go to next() router in the middlewares',
                }, {
                    id: 'validate',
                    name: 'validate(whitelist?: (string | IUrl)[], failureRedirect?: string): Express Middleware',
                    nav: 'validate',
                    desc: 'If the url is whitelisted next() middleware is called. If the cookie exists n if the cookie is valid then req.user is set on express request object. If not then the user is redirected to failureRedirectUrl else 401 is sent',
                }]
            }
        }
    }])
}