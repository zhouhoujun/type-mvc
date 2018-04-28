import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator, isClassMetadata, isString } from '@ts-ioc/core';


export interface AuthorizationMetadata extends TypeMetadata {
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
}


/**
 * Authorization decorator, define class or method need auth check.
 *
 * @Authorization
 */
export const Authorization: IAuthorizationDecorator<AuthorizationMetadata> = createClassMethodDecorator<AuthorizationMetadata>('Authorization',
    adapter => {
        adapter.next<AuthorizationMetadata>({
            isMetadata: (arg) => isClassMetadata(arg, ['role']),
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.role = arg;
            }
        });
    }) as IAuthorizationDecorator<AuthorizationMetadata>;
