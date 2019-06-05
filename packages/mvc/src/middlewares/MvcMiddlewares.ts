import { Singleton } from '@tsdi/ioc';
import { CompositeMiddleware } from './MvcMiddleware';
import { MvcContext } from '../MvcContext';
import { IContext, ContextToken } from './IContext';



@Singleton
export class MvcMiddlewares extends CompositeMiddleware {

    /**
     * setup root in koa.
     *
     * @param {MvcContext} mvcContext
     * @memberof MvcMiddlewares
     */
    setup(mvcContext: MvcContext) {
        mvcContext.getKoa().use((ctx: IContext, next) => {
            ctx.mvcContext = mvcContext;
            mvcContext.getRaiseContainer().bindProvider(ContextToken, ctx);
            return this.execute(ctx, next)
        });
    }
}

