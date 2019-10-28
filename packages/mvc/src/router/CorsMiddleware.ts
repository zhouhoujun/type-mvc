import { Singleton } from '@tsdi/ioc';
import { MvcMiddleware, IMiddleware, MiddlewareTypes } from '../middlewares';
import { Router } from './Router';
import { IContext } from '../IContext';


@Singleton
export class CorsMiddleware extends MvcMiddleware implements IMiddleware {

    static middleName = MiddlewareTypes.Cors;

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx._corsCheck = true;
        return this.container.get(Router).execute(ctx, next);
    }
}
