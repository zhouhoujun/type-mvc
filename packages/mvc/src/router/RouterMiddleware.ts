import { Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { IMiddleware, MiddlewareTypes } from '../middlewares/IMiddleware';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { Router } from './Router';


@Singleton()
export class RouterMiddleware extends MvcMiddleware implements IMiddleware {
    static ρNPT = true;
    static middleName = MiddlewareTypes.Router;

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx._isCors = false;
        return await this.getInjector().get(Router).execute(ctx, next);
    }
}
