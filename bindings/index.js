"use strict";
exports.__esModule = true;
var core_1 = require("./core");
var helpers_1 = require("./helpers");
var compile_1 = require("./compile");
function setupBindings(solJson) {
    var coreBindings = (0, core_1.setupCore)(solJson);
    var compileBindings = (0, compile_1.setupCompile)(solJson, coreBindings);
    var methodFlags = (0, helpers_1.getSupportedMethods)(solJson);
    return {
        methodFlags: methodFlags,
        coreBindings: coreBindings,
        compileBindings: compileBindings
    };
}
exports["default"] = setupBindings;
