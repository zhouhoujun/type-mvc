import {
    isArray, isNumber, isString, isUndefined, IClassMethodDecorator,
    createClassMethodDecorator, ClassMethodDecorator, MetadataExtends, ArgsIteratorAction
} from '@tsdi/ioc';
import { CorsMetadata } from '../metadata';
import { RequestMethodType } from '../RequestMethod';

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
     * @param {(RequestMethodType | RequestMethodType[])} [allowMethods] allow request methods cors, 'Access-Control-Expose-Headers'.
     * @param {number} [maxAge] set cors cache max age,  Access-Control-Max-Age.
     * @param {(string | string[])} [allowHeaders] allow cors request headers, 'Access-Control-Request-Headers'.
     */
    (allowMethods?: RequestMethodType | RequestMethodType[], maxAge?: number, allowHeaders?: string | string[]): ClassMethodDecorator;

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
 * @param actions
 * @param metadataExtends
 */
export function createCorsDecorator<T extends CorsMetadata>(name: string,
    actions?: ArgsIteratorAction<T>[],
    metadataExtends?: MetadataExtends<T>): ICorsDecorator<T> {
    return createClassMethodDecorator<T>(name,
        [
            ...(actions || []),
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.allowMethods = arg;
                    ctx.next(next);
                } else if (isArray(arg)) {
                    let allowMethods = arg as any[];
                    ctx.metadata.allowMethods = allowMethods.filter(m => !isUndefined(m) && m !== null);
                    ctx.next(next);
                }
            },
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isNumber(arg)) {
                    ctx.metadata.maxAge = arg;
                    ctx.next(next);
                }
            },
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isArray(arg)) {
                    let allowHeaders = arg as string[];
                    ctx.metadata.allowHeaders = allowHeaders.filter(h => !!h);
                    ctx.next(next);
                }
            }
        ], metadataExtends) as ICorsDecorator<T>

}

/**
 * Cors Decorator, define controller class or controller method support cors.
 * @Cors
 */
export const Cors: ICorsDecorator<CorsMetadata> = createCorsDecorator('Cors');
