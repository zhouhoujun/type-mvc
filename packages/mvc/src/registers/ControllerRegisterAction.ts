import { IocDesignAction, DesignActionContext, getTypeMetadata } from '@tsdi/ioc';
import { Controller } from '../decorators';
import { ControllerMetadata } from '../metadata';
import { Router, ControllerRoute, RouteUrlArgToken, RouteControllerArgToken, RouteControllerMiddlewaresToken } from '../router';

export class ControllerRegisterAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void): void {

        let ctrlmetadatas = getTypeMetadata<ControllerMetadata>(Controller, ctx.targetType);
        let router = this.container.get(Router);
        ctrlmetadatas.forEach(ctlmeta => {
            if (!ctlmeta) {
                return;
            }
            let prefix = ctlmeta.routePrefix;
            if (prefix && !/^\//.test(prefix)) {
                prefix = '/' + prefix;
            }
            let middlewares = ctlmeta.middlewares;
            router.routes(prefix, this.container.get(ControllerRoute,
                { provide: RouteUrlArgToken, useValue: prefix },
                { provide: RouteControllerArgToken, useValue: ctx.targetType },
                { provide: RouteControllerMiddlewaresToken, useValue: middlewares }))
        });

        next();
    }
}
