import { DesignActionContext } from '@tsdi/ioc';
import { ControllerMetadata } from '../metadata';
import { Router } from '../router/Router';
import { ControllerRoute, RouteControllerArgToken, RouteControllerMiddlewaresToken } from '../router/ControllerRoute';
import { RouteUrlArgToken } from '../router/Route';

const prefixEnd = /^\//;

export const ControllerRegisterAction = (ctx: DesignActionContext, next: () => void) => {

    let ctrlmetadatas = ctx.reflects.getMetadata<ControllerMetadata>(ctx.currDecoractor, ctx.type);
    let router = ctx.injector.getInstance(Router);
    ctrlmetadatas.forEach(ctlmeta => {
        if (!ctlmeta) {
            return;
        }
        let prefix = ctlmeta.routePrefix;
        if (prefix && !prefixEnd.test(prefix)) {
            prefix = '/' + prefix;
        }
        let middlewares = ctlmeta.middlewares;
        router.routes(ctx.injector.getInstance(ControllerRoute,
            { provide: RouteUrlArgToken, useValue: prefix },
            { provide: RouteControllerArgToken, useValue: ctx.type },
            { provide: RouteControllerMiddlewaresToken, useValue: middlewares }))
    });

    next();
}

