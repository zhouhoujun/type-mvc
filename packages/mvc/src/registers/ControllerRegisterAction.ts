import { DesignContext } from '@tsdi/ioc';
import { ControllerMetadata } from '../metadata';
import { Router } from '../router/Router';
import { ControllerRoute, RouteControllerArgToken, RouteControllerMiddlewaresToken } from '../router/ControllerRoute';
import { RouteUrlArgToken } from '../router/Route';


export const ControllerRegisterAction = (ctx: DesignContext, next: () => void) => {

    let ctrlmetadatas = ctx.reflects.getMetadata<ControllerMetadata>(ctx.currDecor, ctx.type);
    let router = ctx.injector.getInstance(Router);
    ctrlmetadatas.forEach(ctlmeta => {
        if (!ctlmeta) {
            return;
        }
        let prefix = ctlmeta.routePrefix;
        let middlewares = ctlmeta.middlewares;
        router.routes(ctx.injector.getInstance(ControllerRoute,
            { provide: RouteUrlArgToken, useValue: prefix },
            { provide: RouteControllerArgToken, useValue: ctx.type },
            { provide: RouteControllerMiddlewaresToken, useValue: middlewares }))
    });

    next();
}

