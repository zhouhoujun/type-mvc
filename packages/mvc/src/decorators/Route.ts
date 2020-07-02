import {
    createMethodDecorator, IMethodDecorator, MetadataExtends,
    ArgsIteratorAction, isString, isNumber, isArray
} from '@tsdi/ioc';
import { RequestMethod } from '../RequestMethod';
import { RouteMetadata } from '../metadata';
import { MiddlewareType } from '../middlewares/IMiddleware';
import { routeSart } from '../exps';


/**
 * custom define Request method. route decorator type define.
 *
 * @export
 * @interface IRouteMethodDecorator
 * @template T
 */
export interface IRouteMethodDecorator<T extends RouteMetadata> extends IMethodDecorator<T> {
    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     */
    (route: string): MethodDecorator;
    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, method: RequestMethod): MethodDecorator;
    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, contentType: string, method?: RequestMethod): MethodDecorator;

    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string, method?: RequestMethod): MethodDecorator;
}

/**
 * create route decorator.
 *
 * @export
 * @template T
 * @param {RequestMethod} [method]
 * @param { MetadataExtends<T>} [metaExtends]
 */
export function createRouteDecorator<T extends RouteMetadata>(
    method?: RequestMethod,
    actions?: ArgsIteratorAction<T>[],
    metaExtends?: MetadataExtends<T>): IRouteMethodDecorator<T> {
    return createMethodDecorator<RouteMetadata>('Route',
        [
            ...(actions || []),
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.route = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isArray(arg)) {
                    ctx.metadata.middlewares = arg;
                    ctx.next(next);
                } else if (isString(arg)) {
                    ctx.metadata.contentType = arg;
                    ctx.next(next);
                } else if (isNumber(arg)) {
                    ctx.metadata.method = arg;
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isNumber(arg)) {
                    ctx.metadata.method = arg;
                } else {
                    ctx.metadata.contentType = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isNumber(arg)) {
                    ctx.metadata.method = arg;
                }
            }
        ],
        metadata => {
            if (metaExtends) {
                metaExtends(metadata as T);
            }
            if(!routeSart.test(metadata.route)){
                metadata.route = '/' + metadata.route;
            }
            if (method) {
                metadata.method = method;
            } else if (!metadata.method) {
                metadata.method = RequestMethod.Get;
            }
            return metadata;
        }) as IRouteMethodDecorator<T>;
}

/**
 * route decorator. define the controller method as an route.
 *
 * @Route
 */
export const Route: IRouteMethodDecorator<RouteMetadata> = createRouteDecorator<RouteMetadata>() as IRouteMethodDecorator<RouteMetadata>;
