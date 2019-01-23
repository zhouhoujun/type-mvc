import { createMethodDecorator, IMethodDecorator, MetadataExtends, isClassMetadata, MetadataAdapter, isString, isNumber } from '@ts-ioc/core';
import { RequestMethod } from '../RequestMethod';
import { RouteMetadata } from '../metadata';


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
     * @param {string} [contentType] set request contentType.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, contentType?: string, method?: RequestMethod): MethodDecorator;
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
    adapter?: MetadataAdapter, metaExtends?: MetadataExtends<T>): IRouteMethodDecorator<T> {
    return createMethodDecorator<RouteMetadata>('Route',
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<RouteMetadata>({
                isMetadata: (arg) => isClassMetadata(arg, ['route', 'method']),
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.route = arg;
                }
            });

            args.next<RouteMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.contentType = arg;
                }
            });

            args.next<RouteMetadata>({
                match: (arg) => isNumber(arg),
                setMetadata: (metadata, arg) => {
                    metadata.method = arg;
                }
            });
        },
        metadata => {
            if (metaExtends) {
                metaExtends(metadata as T);
            }
            metadata.method = method || RequestMethod.Get;
            return metadata;
        }) as IRouteMethodDecorator<T>;
}

/**
 * route decorator. define the controller method as an route.
 *
 * @Route
 */
export const Route: IRouteMethodDecorator<RouteMetadata> = createRouteDecorator<RouteMetadata>() as IRouteMethodDecorator<RouteMetadata>;
