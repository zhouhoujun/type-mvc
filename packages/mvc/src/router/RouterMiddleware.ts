import { Singleton } from '@tsdi/ioc';
import { IMiddleware, MiddlewareTypes } from '../middlewares/IMiddleware';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { Router } from './Router';
import { IContext } from '../IContext';


@Singleton()
export class RouterMiddleware extends MvcMiddleware implements IMiddleware {
    static ρNPT = true;
    static middleName = MiddlewareTypes.Router;

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx._corsCheck = false;
        return this.getInjector().get(Router).execute(ctx, next);
    }
}
