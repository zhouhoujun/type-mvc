import { Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { IMiddleware, MiddlewareTypes } from '../middlewares/IMiddleware';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { Router } from './Router';


@Singleton()
export class RouterMiddleware extends MvcMiddleware implements IMiddleware {
    static ρNPT = true;
    static middleName = MiddlewareTypes.Router;

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        return this.getInjector().get(Router).navigate(ctx, next);
    }
}
