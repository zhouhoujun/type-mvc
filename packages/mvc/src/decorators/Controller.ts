import { createClassDecorator, ITypeDecorator, isString, Registration, ArgsIterator, isArray } from '@tsdi/ioc';
import { ControllerMetadata } from '../metadata';
import { MiddlewareType } from '../middlewares';

/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 *
 * @export
 * @interface IControllerDecorator
 * @template T
 */
export interface IControllerDecorator<T extends ControllerMetadata> extends ITypeDecorator<T> {
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     *
     * @param {string} routePrefix route prefix of this controller.
     * @param {(Registration | symbol | string)} provide define this controller provider for provide.
     * @param {string} [alias] define this controller provider with alias for provide.
     */
    (routePrefix: string, provide?: Registration | symbol | string, alias?: string): ClassDecorator;
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     *
     * @param {string} routePrefix route prefix of this controller.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {(Registration | symbol | string)} provide define this controller provider for provide.
     * @param {string} [alias] define this controller provider with alias for provide.
     */
    (routePrefix: string, middlewares: MiddlewareType[], provide?: Registration | symbol | string, alias?: string): ClassDecorator;
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     */
    (target: Function): void;
}

/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 */
export const Controller: IControllerDecorator<ControllerMetadata> =
    createClassDecorator<ControllerMetadata>('Controller', [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isString(arg)) {
                ctx.metadata.routePrefix = arg;
                ctx.next(next);
            }
        },
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isArray(arg)) {
                ctx.metadata.middlewares = arg;
                ctx.next(next);
            } else {
                ctx.next(next, false);
            }
        }
    ]) as IControllerDecorator<ControllerMetadata>;

