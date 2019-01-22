import { createClassDecorator, ITypeDecorator, Token, isString, isToken, Registration } from '@ts-ioc/core';
import { MiddlewareMetadata } from '../metadata';
import { IMiddleware, InjectMiddlewareToken } from '../middlewares/IMiddleware';


/**
 * Middleware decorator, define the class as mvc Middleware.
 * @Middleware
 *
 * @export
 * @interface IMiddlewareDecorator
 * @template T
 */
export interface IMiddlewareDecorator<T extends MiddlewareMetadata> extends ITypeDecorator<T> {
    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     *
     * @param {(string | Registration<IMiddleware>)} name middleware name singed for mvc.
     * @param {Token<IMiddleware>} [before] define middleware setup before one middleware.
     * @param {Token<IMiddleware>} [after] define middleware setup after one middleware.
     * @param {(Registration<any> | symbol | string)} [provide] define this Middleware provider for provide.
     */
    (name: string | Registration<IMiddleware>, before?: Token<IMiddleware>, after?: Token<IMiddleware>, provide?: Token<any>): ClassDecorator;
    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     * @param {T} middleware middleware name singed for mvc.
     */
    (middleware?: T): ClassDecorator;
    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     */
    (target: Function): void;
}

/**
 * Middleware Decorator, definde class as mvc middleware.
 *
 * @Middleware
 */
export const Middleware: IMiddlewareDecorator<MiddlewareMetadata> = createClassDecorator<MiddlewareMetadata>('Middleware',
    (args) => {
        args.next<MiddlewareMetadata>({
            match: (arg) => isString(arg) || (arg instanceof Registration),
            setMetadata: (metadata, arg) => {
                if (isString(arg)) {
                    metadata.name = arg;
                } else if (arg instanceof Registration) {
                    metadata.provide = arg;
                    metadata.name = metadata.provide.getDesc();
                }
            }
        });
        args.next<MiddlewareMetadata>({
            match: (arg) => isToken(arg),
            setMetadata: (metadata, arg) => {
                metadata.before = arg;
            }
        });
        args.next<MiddlewareMetadata>({
            match: (arg) => isToken(arg),
            setMetadata: (metadata, arg) => {
                metadata.after = arg;
            }
        });
    },

    (metadata) => {
        metadata.singleton = true;
        if (metadata.name && !metadata.provide) {
            metadata.provide = new InjectMiddlewareToken(metadata.name).toString();
        }
        return metadata;
    }) as IMiddlewareDecorator<MiddlewareMetadata>;
