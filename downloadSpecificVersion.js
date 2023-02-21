#!/usr/bin/env node
"use strict";
// This is used to download the correct binary version
// as part of the prepublish step.
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
exports.downloadSpecificVersion = exports.getVersionList = void 0;
var fs = require("fs");
var follow_redirects_1 = require("follow-redirects");
var memorystream_1 = require("memorystream");
var js_sha3_1 = require("js-sha3");
var os_1 = require("os");
var path_1 = require("path");
function getVersionList() {
    return new Promise(function (resolve, reject) {
        var mem = new memorystream_1["default"](null, { readable: false });
        follow_redirects_1.https.get('https://binaries.soliditylang.org/bin/list.json', function (response) {
            if (response.statusCode !== 200) {
                reject('Error downloading file: ' + response.statusCode);
                process.exit(1);
            }
            response.pipe(mem);
            response.on('end', function () {
                resolve(mem.toString());
            });
        });
    });
}
exports.getVersionList = getVersionList;
function downloadBinary(outputName, version, expectedHash) {
    return new Promise(function (resolve, reject) {
        // Remove if existing
        if (fs.existsSync(outputName)) {
            fs.unlinkSync(outputName);
        }
        process.on('SIGINT', function () {
            console.log('Interrupted, removing file.');
            fs.unlinkSync(outputName);
            reject('Interrupted');
        });
        var dirPath = path_1["default"].dirname(outputName);
        // Create the folder if it doesn't already exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        var file = fs.createWriteStream(outputName, { encoding: 'binary' });
        follow_redirects_1.https.get('https://binaries.soliditylang.org/bin/' + version, function (response) {
            if (response.statusCode !== 200) {
                console.log('Error downloading file: ' + response.statusCode);
                reject('error downloading file');
            }
            response.pipe(file);
            file.on('finish', function () {
                file.close(function () {
                    var hash = '0x' + (0, js_sha3_1.keccak256)(fs.readFileSync(outputName, { encoding: 'binary' }));
                    if (expectedHash !== hash) {
                        reject('Hash mismatch: ' + expectedHash + ' vs ' + hash);
                    }
                    resolve('Done');
                });
            });
        });
    });
}
function downloadSpecificVersion(versionWanted) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var list, releaseFileName_1, expectedFile, expectedHash, userHomedir, fullPath, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getVersionList()];
                case 1:
                    list = _a.sent();
                    if (!list) {
                        throw new Error('Couldnt retrieve solc-js version list');
                    }
                    list = JSON.parse(list);
                    releaseFileName_1 = list.releases[versionWanted];
                    expectedFile = list.builds.filter(function (entry) { return entry.path === releaseFileName_1; })[0];
                    if (!expectedFile) {
                        console.log('Version list is invalid or corrupted?');
                        process.exit(1);
                    }
                    expectedHash = expectedFile.keccak256;
                    userHomedir = (0, os_1.homedir)();
                    fullPath = path_1["default"].join(userHomedir, ".bagels/soljson-".concat(versionWanted, ".js"));
                    return [4 /*yield*/, downloadBinary(fullPath, releaseFileName_1, expectedHash)];
                case 2:
                    _a.sent();
                    resolve(fullPath);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    reject(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
exports.downloadSpecificVersion = downloadSpecificVersion;
