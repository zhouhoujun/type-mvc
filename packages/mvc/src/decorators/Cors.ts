import { isArray, isNumber, isString, isUndefined, IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator, MetadataAdapter, MetadataExtends } from '@ts-ioc/core';
import { CorsMetadata } from '../metadata';
import { RequestMethod } from '../RequestMethod';

/**
 * Cors Decorator, define controller class or controller method support cors request.
 * @Cors
 *
 * @export
 * @interface ICorsDecorator
 * @extends {IClassMethodDecorator<T>}
 * @template T
 */
export interface ICorsDecorator<T extends CorsMetadata> extends IClassMethodDecorator<T> {
    /**
     * Cors Decorator, define controller class or controller method support cors.
     * @Cors
     *
     * @param {(string | string[] | RequestMethod[])} [allowMethods] allow request methods cors, 'Access-Control-Expose-Headers'.
     * @param {number} [maxAge] set cors cache max age,  Access-Control-Max-Age.
     * @param {(string | string[])} [allowHeaders] allow cors request headers, 'Access-Control-Request-Headers'.
     */
    (allowMethods?: string | string[] | RequestMethod[], maxAge?: number, allowHeaders?: string | string[]): ClassMethodDecorator;

    /**
     * Cors Decorator, define controller class or controller method support cors.
     * @Cors
     *
     * @param {T} [metadata] define metadata.
     */
    (metadata: T): ClassMethodDecorator;
}

/**
 * Cors Decorator, define controller class or controller method support cors.
 * @Cors
 * @param name
 * @param adapter
 * @param metadataExtends
 */
export function createCorsDecorator<T extends CorsMetadata>(name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): ICorsDecorator<T> {
    return createClassMethodDecorator<CorsMetadata>(name,
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<CorsMetadata>({
                match: (arg) => isArray(arg) || isString(arg),
                setMetadata: (metatdata, arg) => {
                    if (isString(arg)) {
                        metatdata.allowMethods = arg;
                    } else {
                        let allowMethods = arg as any[];
                        metatdata.allowMethods = allowMethods.filter(m => !isUndefined(m) && m !== null);
                    }
                }
            });
            args.next<CorsMetadata>({
                match: (arg) => isNumber(arg),
                setMetadata: (metatdata, arg) => {
                    metatdata.maxAge = arg;
                }
            });
            args.next<CorsMetadata>({
                match: (arg) => isArray(arg),
                setMetadata: (metatdata, arg) => {
                    let allowHeaders = arg as string[];
                    metatdata.allowHeaders = allowHeaders.filter(h => !!h);
                }
            });
        }, metadataExtends) as ICorsDecorator<T>

}

/**
 * Cors Decorator, define controller class or controller method support cors.
 * @Cors
 */
export const Cors: ICorsDecorator<CorsMetadata> = createCorsDecorator('Cors');
