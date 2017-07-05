"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUndefined(data) {
    return data == undefined || data == null;
}
exports.isUndefined = isUndefined;
function deprecated(message = "Function {name} is deprecated.") {
    return (instance, name, descriptor) => {
        let original = descriptor.value;
        let localMessage = message.replace("{name}", name);
        descriptor.value = function () {
            console.warn(localMessage);
            return original.apply(instance, arguments);
        };
        return descriptor;
    };
}
exports.deprecated = deprecated;
