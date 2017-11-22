import { createMethodDecorator, IMethodDecorator, MethodMetadata, MetadataExtends } from 'type-autofac';
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
    let routeAdapter = (...args: any[]) => {
        let metadata;
        if (args.length > 0 && args[0]) {
            if (isString(args[0])) {
                metadata = {
                    route: args[0],
                    method: isNumber(args[1]) ? args[1] : RequestMethod.Get
                } as T;
            }
        }
        return metadata;
    };

    return createMethodDecorator<RouteMetadata>('Route',
        args => {
            args.next<RouteMetadata>({
                isMetadata: (arg) => {
                    return arg && isString(arg.route)
                },
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
