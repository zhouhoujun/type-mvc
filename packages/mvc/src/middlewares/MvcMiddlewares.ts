import { Singleton } from '@tsdi/ioc';
import { CompositeMiddleware } from './MvcMiddleware';
import { MvcContext } from '../MvcContext';
import { IContext } from './IContext';



@Singleton
export class MvcMiddlewares extends CompositeMiddleware {

    setup(mvcContext: MvcContext) {
        mvcContext.getKoa().use((ctx: IContext, next) => {
            ctx.mvcContext = mvcContext;
            return this.execute(ctx, next)
        });
    }
}

