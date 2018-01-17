import { Application } from '../Application';
import { Configuration } from '../../Configuration';
import { Middleware } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent, Token, NonePointcut } from 'tsioc';
import { mvcSymbols } from '../../util';
import { Router } from '../router';

@NonePointcut
@Middleware(mvcSymbols.CorsMiddleware)
export class DefaultCorsMiddleware implements IMiddleware {

    constructor(private app: Application, private router: Router, private config: Configuration) {

    }
    setup() {
        this.app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && this.config.isRouteUrl(ctx.url)) {
                return this.router.getRoot().options(this.app.container, ctx, next);
            }
        });
    }

}
