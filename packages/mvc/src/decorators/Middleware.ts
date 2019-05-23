import { createClassDecorator, ITypeDecorator, Token, isString, isToken } from '@tsdi/ioc';
import { MiddlewareMetadata } from '../metadata';
import { IMiddleware } from '../middlewares/IMiddleware';


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
     * @param {string} name middleware name singed for mvc.
     * @param {Token<IMiddleware>} [before] define middleware setup before one middleware.
     * @param {Token<IMiddleware>} [after] define middleware setup after one middleware.
     * @param {(Registration<any> | symbol | string)} [provide] define this Middleware provider for provide.
     */
    (name: string, before?: Token<IMiddleware>, after?: Token<IMiddleware>, provide?: Token<any>): ClassDecorator;
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
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                if (isString(arg)) {
                    metadata.provide = arg;
                    metadata.name = arg;
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
    }) as IMiddlewareDecorator<MiddlewareMetadata>;
