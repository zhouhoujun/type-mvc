import {
    TypeMetadata, IClassMethodDecorator, createClassMethodDecorator,
    ClassMethodDecorator, isClassMetadata, isString, isArray
} from '@tsdi/ioc';
import { MiddlewareType } from '../middlewares';

/**
 * authorization metadata.
 */
export interface AuthorizationMetadata extends TypeMetadata {
    /**
     * middleware to auth.
     *
     * @type {MiddlewareType[]}
     * @memberof AuthorizationMetadata
     */
    middlewares?: MiddlewareType[];
    /**
     * role
     *
     * @type {string}
     * @memberof AuthorizationMetadata
     */
    role?: string;
}

/**
 * Authorization decorator, define class or method need auth check.
 *
 * @Authorization
 *
 * @export
 * @interface IAuthorizationDecorator
 * @extends {IClassMethodDecorator<T>}
 * @template T
 */
export interface IAuthorizationDecorator<T extends AuthorizationMetadata> extends IClassMethodDecorator<T> {
    /**
     * Authorization decorator, define class or method need auth check.
     *
     * @Authorization
     *
     * @param {string} [role] auth role.
     */
    (role?: string): ClassMethodDecorator;

    /**
     * Authorization decorator, define class or method need auth check.
     *
     * @Authorization
     *
     * @param {MvcMiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [role] auth role.
     */
    (middlewares: MiddlewareType[], role?: string): ClassMethodDecorator;
}


/**
 * Authorization decorator, define class or method need auth check.
 *
 * @Authorization
 */
export const Authorization: IAuthorizationDecorator<AuthorizationMetadata> = createClassMethodDecorator<AuthorizationMetadata>('Authorization',
    [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isArray(arg)) {
                ctx.metadata.middlewares = arg;
                ctx.next(next);
            } else {
                ctx.metadata.role = arg;
                ctx.next(next);
            }
        },
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isString(arg)) {
                ctx.metadata.role = arg;
            }
        }
    ]) as IAuthorizationDecorator<AuthorizationMetadata>;
