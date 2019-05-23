import { InjectToken } from '@tsdi/ioc';

/**
 * Authorization
 */
export interface IAuthorization {
    /**
     * is auth or not.
     *
     * @returns {boolean}
     * @memberof IAuthorization
     */
    isAuth(): boolean;
}

/**
 * Authorization token.
 */
export const AuthorizationToken = new InjectToken<IAuthorization>('_MVC_Authorization');
