import { Application } from '../Application';
import { IConfiguration } from '../../IConfiguration';
import { Middleware } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent, Token, Inject } from '@ts-ioc/core';
import { MvcSymbols } from '../../util/index';
import { Router } from '../router';
import { NonePointcut } from '@ts-ioc/aop';

@Middleware(MvcSymbols.CorsMiddleware)
export class DefaultCorsMiddleware implements IMiddleware {

    @Inject(MvcSymbols.Application)
    private app: Application;

    @Inject(MvcSymbols.IConfiguration)
    private config: IConfiguration;

    @Inject(MvcSymbols.RouterMiddleware)
    private router: Router;

    constructor() {

    }
    setup() {
        this.app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && this.config.isRouteUrl(ctx.url)) {
                return this.router.getRoot().options(this.app.container, ctx, next);
            }
        });
    }

}
