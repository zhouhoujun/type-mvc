import { createClassDecorator, Type } from '@tsdi/ioc';
import { MiddlewareMetadata } from '../metadata';
import { IMiddleware } from '../middlewares/IMiddleware';

export type MiddlewareDecorator = <TFunction extends Type<IMiddleware>>(target: TFunction) => TFunction | void;

/**
 * Middleware decorator, define the class as mvc Middleware.
 * @Middleware
 *
 * @export
 * @interface IMiddlewareDecorator
 * @template T
 */
export interface IMiddlewareDecorator<T extends MiddlewareMetadata> {
    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     * @param {T} middleware middleware name singed for mvc.
     */
    (middleware: T): MiddlewareDecorator;
}

/**
 * Middleware Decorator, definde class as mvc middleware.
 *
 * @Middleware
 */
export const Middleware: IMiddlewareDecorator<MiddlewareMetadata> = createClassDecorator<MiddlewareMetadata>('Middleware',
    null,
    (metadata) => {
        metadata.singleton = true;
        if (metadata.name) {
            metadata.provide = metadata.name;
        }
        if (!metadata.scope) {
            metadata.scope = 'global';
        }
    }) as IMiddlewareDecorator<MiddlewareMetadata>;
