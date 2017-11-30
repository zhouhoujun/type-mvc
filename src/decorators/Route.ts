import { createMethodDecorator, IMethodDecorator, MethodMetadata, MetadataExtends, isClassMetadata } from 'tsioc';
import { RequestMethod } from '../RequestMethod';
import { RouteMetadata } from './metadata';
import { isString, isNumber } from 'util';


/**
 * route decorator type define.
 *
 * @export
 * @interface IRouteDecorator
 * @template T
 */
export interface IRouteDecorator<T extends RouteMetadata> extends IMethodDecorator<T> {
    (route: string): MethodDecorator;
}

/**
 * custom define Request method. route decorator type define.
 *
 * @export
 * @interface IRouteMethodDecorator
 * @template T
 */
export interface IRouteMethodDecorator<T extends RouteMetadata> extends IMethodDecorator<T> {
    (route: string, method?: RequestMethod): MethodDecorator;
}

/**
 * create route decorator.
 *
 * @export
 * @template T
 * @param {string} name
 * @param {RequestMethod} [method]
 * @param { MetadataExtends<T>} [metaExtends]
 */
export function createRouteDecorator<T extends RouteMetadata>(name: string, method?: RequestMethod, metaExtends?: MetadataExtends<T>): IRouteDecorator<T> {
    return createMethodDecorator<RouteMetadata>('Route',
        args => {
            args.next<RouteMetadata>({
                isMetadata: (arg) => isClassMetadata(arg, ['route', 'method']),
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.route = arg;
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
                metadata = metaExtends(metadata as T);
            }
            metadata.method = method || RequestMethod.Get;
            return metadata;
        }) as IRouteDecorator<T>;
}

export const Route: IRouteMethodDecorator<RouteMetadata> = createRouteDecorator<RouteMetadata>('Route') as IRouteMethodDecorator<RouteMetadata>;
