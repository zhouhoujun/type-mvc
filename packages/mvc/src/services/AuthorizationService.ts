import { Abstract, Type } from '@tsdi/ioc';
import { MiddlewareType } from '../middlewares';
import { IContext } from '../IContext';

@Abstract()
export abstract class AuthorizationService {
    /**
     * get auth middlewares of controller.
     *
     * @abstract
     * @param {IContext} ctx
     * @param {Type} controller
     * @returns {MiddlewareType[]}
     * @memberof AuthorizationService
     */
    abstract getAuthMiddlewares(ctx: IContext, controller: Type): MiddlewareType[];
    /**
     * get auth middlewares of controller action.
     *
     * @abstract
     * @param {IContext} ctx
     * @param {Type} controller
     * @param {string} propertyKey
     * @returns {MiddlewareType[]}
     * @memberof AuthorizationService
     */
    abstract getAuthMiddlewares(ctx: IContext, controller: Type, propertyKey: string): MiddlewareType[];
}
