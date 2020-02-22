import { Singleton } from '@tsdi/ioc';
import { IMiddleware, MiddlewareTypes } from '../middlewares/IMiddleware';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { Router } from './Router';
import { IContext } from '../IContext';


@Singleton
export class CorsMiddleware extends MvcMiddleware implements IMiddleware {

    static middleName = MiddlewareTypes.Cors;

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx._corsCheck = true;
        return ctx.getInjector().getInstance(Router).execute(ctx, next);
    }
}
