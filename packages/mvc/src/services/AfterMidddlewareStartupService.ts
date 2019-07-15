import { Abstract } from '@tsdi/ioc';
import { MvcMiddlewares } from '../middlewares';
import { MvcContext } from '../MvcContext';

@Abstract()
export abstract class AfterMidddlewareStartupService {

    /**
     *  to startup service after middlewares setup.
     *
     * @abstract
     * @param {MvcContext} ctx
     * @param {MvcMiddlewares} [middlewares]
     * @returns {Promise<void>}
     * @memberof AfterMidddlewareSetup
     */
    abstract startup(ctx: MvcContext, middlewares?: MvcMiddlewares): Promise<void>;
}
