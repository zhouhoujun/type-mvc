import { Singleton } from '@tsdi/ioc';
import { MvcMiddleware, IMiddleware, MiddlewareTypes } from '../middlewares';
import { Router } from './Router';
import { IContext } from '../IContext';


@Singleton
export class RouterMiddleware extends MvcMiddleware implements IMiddleware {

    static middleName = MiddlewareTypes.Router;

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx._corsCheck = false;
        return this.container.get(Router).execute(ctx, next);
    }
}
