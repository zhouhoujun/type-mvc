import { Abstract } from '@tsdi/ioc';
import { MvcMiddlewares } from '../middlewares';
import { MvcContext } from '../MvcContext';

@Abstract()
export abstract class BeforeMidddlewareStartupService {

    /**
     * to startup service before middlewares setup.
     *
     * @abstract
     * @param {MvcContext} ctx
     * @param {MvcMiddlewares} [middlewares]
     * @returns {Promise<void>}
     * @memberof BeforeMidddlewareSetup
     */
    abstract startup(ctx: MvcContext, middlewares?: MvcMiddlewares): Promise<void>;
}
