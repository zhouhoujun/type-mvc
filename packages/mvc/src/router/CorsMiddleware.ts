import { Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { IMiddleware, MiddlewareTypes } from '../middlewares/IMiddleware';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { Router } from './Router';

@Singleton()
export class CorsMiddleware extends MvcMiddleware implements IMiddleware {
    static ρNPT = true;
    static middleName = MiddlewareTypes.Cors;

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx._isCors = true;
        return await ctx.getInjector().getInstance(Router).execute(ctx, next);
    }
}
