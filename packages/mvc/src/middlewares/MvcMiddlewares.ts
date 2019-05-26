import { CompositeMiddleware } from './MvcMiddleware';
import { Singleton } from '@tsdi/ioc';
import { IContext } from './IContext';
import { MvcContext } from '../MvcContext';


@Singleton
export class MvcMiddlewares extends CompositeMiddleware {

    setup(ctx: IContext, mvcContext: MvcContext) {
        ctx.use((ctx, next) => {
            ctx.mvcContext = mvcContext;
            return this.execute(ctx, next)
        });
    }
}

