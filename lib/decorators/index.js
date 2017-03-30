"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decoratorFactories_1 = require("./decoratorFactories");
/**
 * Injectable decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Injectable = decoratorFactories_1.makeDecorator('Injectable', []);
/**
 * Controller decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Controller = decoratorFactories_1.makeDecorator('Controller', []);
/**
 * Input decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Input = decoratorFactories_1.makePropDecorator('Input', [['bindingPropertyName', undefined]]);
/**
 * Output decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Output = decoratorFactories_1.makePropDecorator('Output', [['bindingPropertyName', undefined]]);

//# sourceMappingURL=../sourcemaps/decorators/index.js.map
