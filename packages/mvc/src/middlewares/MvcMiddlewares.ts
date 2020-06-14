import { Singleton } from '@tsdi/ioc';
import { CompositeMiddleware } from './MvcMiddleware';
import { IContext } from '../IContext';
import { MvcContext } from '../MvcContext';


/**
 * mvc middlewares.
 *
 * @export
 * @class MvcMiddlewares
 * @extends {CompositeMiddleware}
 */
@Singleton()
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
            if (!ctx.getInjector) {
                ctx.getInjector = () => mvcContext.injector
            }
            mvcContext.app = ctx.app as any;
            await this.execute(ctx);
            return await next();
        });
    }
}

