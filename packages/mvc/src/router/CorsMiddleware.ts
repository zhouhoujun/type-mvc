import { Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { IMiddleware, MiddlewareTypes } from '../middlewares/IMiddleware';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { Router } from './Router';

@Singleton()
export class CorsMiddleware extends MvcMiddleware implements IMiddleware {
    static ρNPT = true;
    static middleName = MiddlewareTypes.Cors;

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        return ctx.getInjector().getInstance(Router).options(ctx, next);
    }
}
