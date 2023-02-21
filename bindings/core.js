"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.setupCore = void 0;
var helpers_1 = require("./helpers");
var translate_1 = require("../translate");
var semver = require("semver");
var helpers_2 = require("../common/helpers");
function setupCore(solJson) {
    var core = {
        alloc: bindAlloc(solJson),
        license: bindLicense(solJson),
        version: bindVersion(solJson),
        reset: bindReset(solJson)
    };
    var helpers = {
        addFunction: unboundAddFunction.bind(this, solJson),
        removeFunction: unboundRemoveFunction.bind(this, solJson),
        copyFromCString: unboundCopyFromCString.bind(this, solJson),
        copyToCString: unboundCopyToCString.bind(this, solJson, core.alloc),
        // @ts-ignore
        versionToSemver: versionToSemver(core.version())
    };
    return __assign(__assign(__assign({}, core), helpers), { isVersion6OrNewer: semver.gt(helpers.versionToSemver(), '0.5.99') });
}
exports.setupCore = setupCore;
/**********************
 * Core Functions
 **********************/
/**
 * Returns a binding to the solidity_alloc function.
 *
 * @param solJson The Emscripten compiled Solidity object.
 */
function bindAlloc(solJson) {
    var allocBinding = (0, helpers_1.bindSolcMethod)(solJson, 'solidity_alloc', 'number', ['number'], null);
    // the fallback malloc is not a cwrap function and should just be returned
    // directly in-case the alloc binding could not happen.
    if ((0, helpers_2.isNil)(allocBinding)) {
        return solJson._malloc;
    }
    return allocBinding;
}
/**
 * Returns a binding to the solidity_version method.
 *
 * @param solJson The Emscripten compiled Solidity object.
 */
function bindVersion(solJson) {
    return (0, helpers_1.bindSolcMethodWithFallbackFunc)(solJson, 'solidity_version', 'string', [], 'version');
}
function versionToSemver(version) {
    return translate_1["default"].versionToSemver.bind(this, version);
}
/**
 * Returns a binding to the solidity_license method.
 *
 * If the current solJson version < 0.4.14 then this will bind an empty function.
 *
 * @param solJson The Emscripten compiled Solidity object.
 */
function bindLicense(solJson) {
    return (0, helpers_1.bindSolcMethodWithFallbackFunc)(solJson, 'solidity_license', 'string', [], 'license', function () {
    });
}
/**
 * Returns a binding to the solidity_reset method.
 *
 * @param solJson The Emscripten compiled Solidity object.
 */
function bindReset(solJson) {
    return (0, helpers_1.bindSolcMethod)(solJson, 'solidity_reset', null, [], null);
}
/**********************
 * Helpers Functions
 **********************/
/**
 * Copy to a C string.
 *
 * Allocates memory using solc's allocator.
 *
 * Before 0.6.0:
 *   Assuming copyToCString is only used in the context of wrapCallback, solc will free these pointers.
 *   See https://github.com/ethereum/solidity/blob/v0.5.13/libsolc/libsolc.h#L37-L40
 *
 * After 0.6.0:
 *   The duty is on solc-js to free these pointers. We accomplish that by calling `reset` at the end.
 *
 * @param solJson The Emscripten compiled Solidity object.
 * @param alloc The memory allocation function.
 * @param str The source string being copied to a C string.
 * @param ptr The pointer location where the C string will be set.
 */
function unboundCopyToCString(solJson, alloc, str, ptr) {
    var length = solJson.lengthBytesUTF8(str);
    var buffer = alloc(length + 1);
    solJson.stringToUTF8(str, buffer, length + 1);
    solJson.setValue(ptr, buffer, '*');
}
/**
 * Wrapper over Emscripten's C String copying function (which can be different
 * on different versions).
 *
 * @param solJson The Emscripten compiled Solidity object.
 * @param ptr The pointer location where the C string will be referenced.
 */
function unboundCopyFromCString(solJson, ptr) {
    var copyFromCString = solJson.UTF8ToString || solJson.Pointer_stringify;
    return copyFromCString(ptr);
}
function unboundAddFunction(solJson, func, signature) {
    return (solJson.addFunction || solJson.Runtime.addFunction)(func, signature);
}
function unboundRemoveFunction(solJson, ptr) {
    return (solJson.removeFunction || solJson.Runtime.removeFunction)(ptr);
}
