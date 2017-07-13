/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/angular/index.js'");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/css-loader/lib/css-base.js'");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/style-loader/lib/addStyles.js'");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/angular-aria/index.js'");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/angular-animate/index.js'");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(6);
__webpack_require__(0);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(10);
__webpack_require__(12);
__webpack_require__(14);

__webpack_require__(17);
__webpack_require__(20);
__webpack_require__(22);

var app = angular.module('app', ['ngAria', 'ngAnimate', 'ngMaterial', 'duScroll']);

__webpack_require__(24)(app);
__webpack_require__(25)(app);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/jquery/dist/jquery.js'");

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/angular-material/index.js'");

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/prismjs/prism.js'");

/***/ }),
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/angular-scroll/index.js'");

/***/ }),
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!../autoprefixer-loader/index.js!./angular-material.css", function() {
			var newContent = require("!!../css-loader/index.js!../autoprefixer-loader/index.js!./angular-material.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/angular-material/angular-material.css'");

/***/ }),
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!../../autoprefixer-loader/index.js!./prism.css", function() {
			var newContent = require("!!../../css-loader/index.js!../../autoprefixer-loader/index.js!./prism.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/akash/Documents/github/server-helper/node_modules/prismjs/themes/prism.css'");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/autoprefixer-loader/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/autoprefixer-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "html {\n    padding: 0;\n    margin: 0;\n}\n\n.scroll {\n    overflow: auto;\n}\n\n.cursor {\n    cursor: pointer;\n}\n\n.sidenav-list {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n\n.sidenav-list.root>li {\n    margin-bottom: 0.3rem;\n    padding-left: 1rem;\n}\n\n.sidenav-list li {\n    cursor: pointer;\n    padding: 0.2rem 0.2rem 0.2rem 0.5rem;\n}\n\n\n.sidenav-list.root {\n    \n}\n\n.sidenav-list.sub-module-list  {\n    box-shadow: 2px 3px 10px -3px gray;\n}\n\n.sidenav-list.method-list {\n    background-color: rgba(224, 213, 213, 0.5);\n}\n\n/*Main Module heading*/\n.sidenav-list.root>li>span {\n    font-size: 130%;\n    font-weight: 500;\n    margin: 0.5rem 0;\n    display: inline-block;\n}\n\n/*Sub-Module Heading*/\n.sidenav-list.sub-module-list>li>span {\n    font-size: 120%;\n    font-weight: 500;\n    margin: 0;\n}\n\n.sidenav-list.method-list>li {\n    font-size: 90%;\n    font-style: italic;\n    color: darkslategrey;\n    font-weight: 400;\n}\n\n.sidenav-list li>span:hover {\n    text-decoration: underline;\n}\n\n.sidenav-list .leaf:hover {\n    background-color: black;\n    color: white;\n}\n\n.module-details {\n    padding: 0 1rem;\n    /*margin: 0 auto;*/\n}\n.module-details .initial {}\n.module-details .initial .desc {}\n\n.method {\n    margin: 1rem 0;\n    padding: 0 1rem;\n    /*margin: 0 auto;*/\n}\n\n.method .name {\n    font-size: 110%;\n    padding: 0.5rem;\n    margin-top: 0;\n}\n.method .desc {\n    font-size: 90%;\n    color: rgb(58, 61, 66);\n}\n\n.method .param-list {\n    background-color: rgba(180, 182, 186, 0.3);\n}\n\n.method .param-list .param {}\n\n.method .param-list .param .name {\n    font-size: 90%;\n    font-style: italic;\n}\n.method .param-list .param .desc {}\n\n.method .return {\n    font-size: 90%;\n}\n\n.method .return .type{\n    font-style: italic;\n}\n.method .return .desc{}\n\n.method .example {\n    margin-top: 1rem;\n}\n\n.method .example .heading {\n    /*margin-top: 1rem;*/\n    font-weight: 500;\n    font-style: italic;\n}\n\n\n.param-list {\n    \n}", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (app) {
    app.service('contentService', [function () {
        this.content = {
            "Helper": {
                desc: "Commonly used functions for input validations, salthash etc",
                initialCode: "\nvar Helper = require(\"server-helper\").Helper;\nvar helper = new Helper();                    \n                    ",
                methods: [{
                    id: 'filterKeysInObj',
                    name: 'filterKeysInObj(obj: string, filter: string[], sameObj?: boolean)  => object',
                    nav: 'filterKeysInObj',
                    returns: {
                        type: 'object',
                        desc: 'An object that would not include the keys specified in the filter'
                    },
                    params: [{
                        name: 'obj',
                        desc: 'Input object'
                    }, {
                        name: 'filter',
                        desc: 'Array of keys to be removed'
                    }, {
                        name: 'sameObj',
                        desc: 'If the filter operation has to be applied on the same obj or a copy of it. Defaults to false'
                    }],
                    desc: "Filters out/removes the keys for the given object",
                    example: "\nvar obj = {a: 1, b: 1, c: 1},\n    filter = [\"a\", \"b\"];\n\nconsole.log(helper.filterKeysInObj(obj, filter, false)) // {c: 1}\n// obj = {a: 1, b: 1, c: 1}\n\n\nconsole.log(helper.filterKeysInObj(obj, filter, true)) // {c: 1}\nconsole.log(obj) // {c: 1}\n                    "
                }, {
                    id: 'retainKeysInObj',
                    name: 'retainKeysInObj(obj: string, retain: string[], sameObj?: boolean)',
                    nav: 'retainKeysInObj',
                    return: {
                        type: 'object',
                        desc: 'An Object whose keys would include only the ones specified'
                    },
                    params: [{
                        name: 'obj',
                        desc: 'Input object'
                    }, {
                        name: 'retain',
                        desc: 'Array of keys to be retained'
                    }, {
                        name: 'sameObj',
                        desc: 'If the filter operation has to be applied on the same obj or a copy of it. Defaults to false'
                    }],
                    desc: "Retains only the given keys in the object",
                    example: "\nvar obj = {a: 1, b: 1, c: 1},\n    retain = [\"a\", \"b\"];\n\nconsole.log(helper.retainKeysInObj(obj, filter, false)) // {a: 1, b: 1}\n// obj = {a: 1, b: 1, c: 1}\n\n\nconsole.log(helper.retainKeysInObj(obj, filter, true)) // {a: 1, b: 1}\nconsole.log(obj) // {a: 1, b: 1}\n                    "
                }, {
                    id: 'weakPwd',
                    name: 'weakPwd(password: string, config: object) => string',
                    nav: 'weakPassword',
                    return: {
                        type: 'string',
                        desc: 'Returns error, if the given string does not satisfy the conditions specified in the config object'
                    },
                    params: [{
                        name: 'password',
                        desc: 'String to check for weak password'
                    }, {
                        name: 'config',
                        desc: "{\n                                    minLen?: number;\n                                    maxLen?: number;\n                                    upperCase?: boolean;\n                                    lowerCase?: boolean;\n                                    specialChars?: string[];\n                                }"
                    }],
                    desc: "Checks if the given string is a weak password",
                    example: ["\nvar password = \"Test123\"\nconsole.log(helper.weakPwd(password, {minLen: 3, maxLen: 5}))\n// Please choose a password length of atmost 5 characters\n                    "]
                }, {
                    id: 'prefixToQueryObject',
                    name: 'prefixToQueryObject(prefix: string, obj: object) => object',
                    nav: 'prefixToQueryObject',
                    return: {
                        type: 'object',
                        desc: 'Object with prefixed keys'
                    },
                    params: [{
                        name: 'prefix',
                        desc: 'String to be prefixed to each key'
                    }, {
                        name: 'obj',
                        desc: "Object whose keys has to be prefixed"
                    }],
                    desc: "Prefix the given key to each string in the object",
                    example: ["\nvar obj = {a: 1, b: 1};\nvar prefix = \"test\"\nconsole.log(helper.prefixToQueryObject(prefix, obj))\n// {\"test.a\" : 1, \"test.b\": 1}\n                    "]
                }, {
                    id: 'validateFieldsCb',
                    name: 'validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void;',
                    nav: 'validateFieldsCb',
                    params: [{
                        name: 'obj',
                        desc: 'Object to be validated'
                    }, {
                        name: 'fieldSpecs',
                        desc: "[{\n                                    name: string;\n                                    type: any;\n                                    required?: boolean;\n                                    preTransform?: IPreTransform;\n                                    preTransformArgs?: any[];\n                                    validate?: IValidationFn | IValidationFn[];\n                                    validateArgs?: any[];\n                                    validateErrMsg: string | string[];\n                                    transform: ITransformFn | ITransformFn[];\n                                    transformArgs: any[];\n                                    unique?: boolean;\n                                    errMsg: string;\n                                }]"
                    }, {
                        name: 'strict',
                        desc: 'If this is true'
                    }],
                    desc: "Prefix the given key to each string in the object",
                    example: ["\nvar obj = {a: 1, b: 1};\nvar prefix = \"test\"\nconsole.log(helper.prefixToQueryObject(prefix, obj))\n// {\"test.a\" : 1, \"test.b\": 1}\n                    "]
                }]
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
                    params: [{
                        name: 'password',
                        desc: 'String to check for weak password'
                    }, {
                        name: 'config',
                        desc: 'Object'
                    }, {
                        name: 'sameObj',
                        optional: true,
                        desc: ''
                    }],
                    desc: "Checks if the given string is a weak password",
                    example: ["\nvar Helper = require(\"server-helper\").Helper\n                    ", "\nvar helper = another.line;                    \n                    "]
                }]
            },
            "Session-Cookie": {
                methods: [{
                    name: 'Test1',
                    id: 'session.jwt.test1',
                    nav: 'test1'
                }]
            }
        };
    }]);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (app) {
    app.value('duScrollDuration', 2000).value('duScrollOffset', 30);

    app.controller("appCtrl", ["$mdSidenav", "$mdMedia", "$scope", "$document", "$timeout", "contentService", function ($mdSidenav, $mdMedia, $scope, $document, $timeout, contentService) {
        var vm = this;

        vm.content = contentService.content;

        vm.showSidenav = $mdMedia("gt-sm");

        vm.isString = function (data) {
            return typeof data == 'string';
        };

        vm.toggleSidenav = function () {
            vm.showSidenav = !vm.showSidenav;
        };

        vm.changeContent = function (heading) {
            vm.currHeading = heading;
            vm.currContent = vm.content[vm.currHeading];
        };

        vm.navigateTo = function (location) {
            console.log('navigating to:', location);
            $timeout(function () {
                var navEl = angular.element(document.getElementById(location));

                $document.duScrollToElement(navEl, 30, 1000);
                // $document.scrollToElementAnimated(navEl);
            }, 10);
        };

        $scope.$watch(function () {
            return !$mdMedia("gt-sm");
        }, function (newVal) {
            if (newVal) {
                vm.showSidenav = false;
            } else {
                vm.showSidenav = true;
            }
        });

        vm.changeContent("Helper");
    }]);
};

/***/ })
/******/ ]);