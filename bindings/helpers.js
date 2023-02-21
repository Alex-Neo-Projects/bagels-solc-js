"use strict";
exports.__esModule = true;
exports.getSupportedMethods = exports.bindSolcMethodWithFallbackFunc = exports.bindSolcMethod = void 0;
var helpers_1 = require("../common/helpers");
function bindSolcMethod(solJson, method, returnType, args, defaultValue) {
    if ((0, helpers_1.isNil)(solJson["_".concat(method)]) && defaultValue !== undefined) {
        return defaultValue;
    }
    return solJson.cwrap(method, returnType, args);
}
exports.bindSolcMethod = bindSolcMethod;
function bindSolcMethodWithFallbackFunc(solJson, method, returnType, args, fallbackMethod, finalFallback) {
    if (finalFallback === void 0) { finalFallback = undefined; }
    var methodFunc = bindSolcMethod(solJson, method, returnType, args, null);
    if (!(0, helpers_1.isNil)(methodFunc)) {
        return methodFunc;
    }
    return bindSolcMethod(solJson, fallbackMethod, returnType, args, finalFallback);
}
exports.bindSolcMethodWithFallbackFunc = bindSolcMethodWithFallbackFunc;
function getSupportedMethods(solJson) {
    return {
        licenseSupported: anyMethodExists(solJson, 'solidity_license'),
        versionSupported: anyMethodExists(solJson, 'solidity_version'),
        allocSupported: anyMethodExists(solJson, 'solidity_alloc'),
        resetSupported: anyMethodExists(solJson, 'solidity_reset'),
        compileJsonSupported: anyMethodExists(solJson, 'compileJSON'),
        compileJsonMultiSupported: anyMethodExists(solJson, 'compileJSONMulti'),
        compileJsonCallbackSuppported: anyMethodExists(solJson, 'compileJSONCallback'),
        compileJsonStandardSupported: anyMethodExists(solJson, 'compileStandard', 'solidity_compile')
    };
}
exports.getSupportedMethods = getSupportedMethods;
function anyMethodExists(solJson) {
    var names = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        names[_i - 1] = arguments[_i];
    }
    return names.some(function (name) { return !(0, helpers_1.isNil)(solJson["_".concat(name)]); });
}
