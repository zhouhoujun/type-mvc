"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.NOT_FOUND = new Object();
/**
 * injector container.
 */
var Injector = (function () {
    function Injector() {
    }
    return Injector;
}());
Injector.notFound = exports.NOT_FOUND;
Injector.NULL = new NullInjector();
exports.Injector = Injector;
var InjectionToken = (function () {
    function InjectionToken(desc) {
        this.desc = desc;
    }
    InjectionToken.prototype.toString = function () {
        return "InjectionToken " + this.desc;
    };
    return InjectionToken;
}());
exports.InjectionToken = InjectionToken;
var NullInjector = (function () {
    function NullInjector() {
    }
    NullInjector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = exports.NOT_FOUND; }
        if (notFoundValue === exports.NOT_FOUND) {
            throw new Error("No provider for " + JSON.stringify(token) + "!");
        }
        return notFoundValue;
    };
    return NullInjector;
}());

//# sourceMappingURL=../sourcemaps/di/Injector.js.map
