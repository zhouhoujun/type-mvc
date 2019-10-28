import { Singleton } from '@tsdi/ioc';
import { CompositeMiddleware } from './MvcMiddleware';
import { IContext, ContextToken } from '../IContext';
import { MvcContext } from '../MvcContext';


/**
 * mvc middlewares.
 *
 * @export
 * @class MvcMiddlewares
 * @extends {CompositeMiddleware}
 */
@Singleton
export class MvcMiddlewares extends CompositeMiddleware {

    /**
     * setup root in koa.
     *
     * @param {MvcContext} mvcContext
     * @memberof MvcMiddlewares
     */
    setup(mvcContext: MvcContext) {
        mvcContext.getKoa().use(async (ctx: IContext, next) => {
            ctx.mvcContext = mvcContext;
            mvcContext.app = ctx.app as any;
            mvcContext.getRaiseContainer().bindProvider(ContextToken, ctx);
            ctx.getRaiseContainer = () => mvcContext.getRaiseContainer();
            await this.execute(ctx);
            return await next();
        });
    }
}

