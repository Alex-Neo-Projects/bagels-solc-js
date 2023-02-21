"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getInstalledVersions = exports.getInstalledValidVersion = exports.downloadValidSolcVersion = exports.SOLC_INSTALLATION_DIRECTORY = void 0;
var downloadSpecificVersion_1 = require("./downloadSpecificVersion");
var wrapper_1 = require("./wrapper");
var os_1 = require("os");
var fs_1 = require("fs");
var path_1 = require("path");
var semver = require("semver");
exports.SOLC_INSTALLATION_DIRECTORY = os_1["default"].homedir() + '/.bagels';
// Important to note: 
// contractSolVersion can be any semver type of string
// Examples: >0.5.1, =0.5.5, etc, etc
function specificSolVersion(contractSolVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var soljson, validInstalledSolVersion, soljson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!contractSolVersion) {
                        soljson = require('./soljson.js');
                        return [2 /*return*/, (0, wrapper_1["default"])(soljson)];
                    }
                    validInstalledSolVersion = getInstalledValidVersion(contractSolVersion);
                    if (!validInstalledSolVersion) return [3 /*break*/, 1];
                    try {
                        soljson = require(validInstalledSolVersion);
                        return [2 /*return*/, (0, wrapper_1["default"])(soljson)];
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return [3 /*break*/, 3];
                case 1:
                    console.log('b4 valid solc');
                    return [4 /*yield*/, downloadValidSolcVersion(contractSolVersion)];
                case 2:
                    _a.sent();
                    console.log('after');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = specificSolVersion;
function downloadValidSolcVersion(contractSolVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var list, parsedList, releases, validSolcVersionToDownload, key, output, soljson, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, (0, downloadSpecificVersion_1.getVersionList)()];
                            case 1:
                                list = _a.sent();
                                parsedList = JSON.parse(list);
                                releases = parsedList['releases'];
                                validSolcVersionToDownload = void 0;
                                for (key in releases) {
                                    if (isValidVersion(key, contractSolVersion)) {
                                        validSolcVersionToDownload = key;
                                        break;
                                    }
                                }
                                if (!validSolcVersionToDownload) {
                                    throw new Error("Couldn't find a valid solc version to download. Is the pragma solidity line valid?");
                                }
                                console.log("downloading solc-js v".concat(validSolcVersionToDownload, "..."));
                                console.time('download finished');
                                return [4 /*yield*/, (0, downloadSpecificVersion_1.downloadSpecificVersion)(validSolcVersionToDownload)];
                            case 2:
                                output = _a.sent();
                                console.timeEnd('download finished');
                                soljson = require(output);
                                resolve((0, wrapper_1["default"])(soljson));
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.log('error compiling: ', e_1);
                                reject(e_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.downloadValidSolcVersion = downloadValidSolcVersion;
function getInstalledValidVersion(contractPragmaVersion) {
    try {
        var validVersionAlreadyInstalled = void 0;
        var installedVersions = getInstalledVersions();
        for (var index = 0; index < Object.keys(installedVersions).length; index++) {
            var version = Object.keys(installedVersions)[index];
            var versionPath = Object.values(installedVersions)[index];
            // plainInstalledVersion = 0.6.1, contractPragmaVersion = >0.6.0, or something
            var installedVersionIsValid = isValidVersion(version, contractPragmaVersion);
            if (installedVersionIsValid) {
                validVersionAlreadyInstalled = versionPath;
                break;
            }
        }
        return validVersionAlreadyInstalled;
    }
    catch (e) {
        console.log(e);
        throw new Error("Could not pick from the installed solc versions. Did you declare pragma solidity?");
    }
}
exports.getInstalledValidVersion = getInstalledValidVersion;
function getInstalledVersions() {
    if (!fs_1["default"].existsSync(exports.SOLC_INSTALLATION_DIRECTORY)) {
        fs_1["default"].mkdirSync(exports.SOLC_INSTALLATION_DIRECTORY);
    }
    var files = fs_1["default"].readdirSync(exports.SOLC_INSTALLATION_DIRECTORY);
    var solVersions = files.filter(function (file) { return file.startsWith('soljson-'); });
    var versionMappings = {};
    // Get things into this format: { 0.5.17': '/Users/hack/.bagels/soljson-0.5.17.js }
    solVersions.map(function (solVersion) {
        var version = path_1["default"].join(exports.SOLC_INSTALLATION_DIRECTORY, solVersion);
        var plainInstalledVersionNumber = solVersion.substring('soljson-'.length).replace('.js', "");
        versionMappings[plainInstalledVersionNumber] = version;
    });
    return versionMappings;
}
exports.getInstalledVersions = getInstalledVersions;
function isValidVersion(version, contractPragmaVersion) {
    var satisfied = semver.satisfies(version, contractPragmaVersion);
    // Need to figure out if the major + minor versions are the same b/c minor version upgrades 0.x.1 can include breaking changes
    var strippedPragma = stripSemver(contractPragmaVersion);
    var minorRange = semver.minor(version) === semver.minor(strippedPragma);
    var majorRange = semver.major(version) === semver.major(strippedPragma);
    if (satisfied && minorRange && majorRange) {
        return true;
    }
    else {
        return false;
    }
}
// ^0.1.2 --> 0.1.2
// >=1.2.1 --> 1.2.1
// etc, etc. For hopefully all types of pragma solidity results
function stripSemver(semverString) {
    return semverString.replace(/[=>^<~]/g, '');
}
