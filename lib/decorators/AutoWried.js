"use strict";
function AutoWired(target) {
    var existingInjectedParameters = Reflect.getOwnMetadata("params_inject", target) || [];
    var newConstructor;
    if (existingInjectedParameters.length > 0) {
        existingInjectedParameters.reverse();
        var paramTypes_1 = Reflect.getMetadata("design:paramtypes", target);
        newConstructor = InjectorHanlder.decorateConstructor(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            IoCContainer.assertInstantiable(target);
            var newArgs = args ? args.concat() : new Array();
            for (var _a = 0, existingInjectedParameters_1 = existingInjectedParameters; _a < existingInjectedParameters_1.length; _a++) {
                var index = existingInjectedParameters_1[_a];
                if (index >= newArgs.length) {
                    newArgs.push(IoCContainer.get(paramTypes_1[index]));
                }
            }
            target.apply(this, newArgs);
            IoCContainer.applyInjections(this, target);
        }, target);
    }
    else {
        newConstructor = InjectorHanlder.decorateConstructor(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            IoCContainer.assertInstantiable(target);
            target.apply(this, args);
            IoCContainer.applyInjections(this, target);
        }, target);
    }
    var config = IoCContainer.bind(target);
    config.toConstructor(newConstructor);
    return newConstructor;
}
exports.AutoWired = AutoWired;

//# sourceMappingURL=../sourcemaps/decorators/AutoWried.js.map
