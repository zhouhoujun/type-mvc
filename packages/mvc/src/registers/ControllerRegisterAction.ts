import { IocDesignAction, DesignActionContext, hasClassMetadata, getTypeMetadata } from '@tsdi/ioc';
import { Controller } from '../decorators';
import { ControllerMetadata } from '../metadata';
import { Router, ControllerRoute, RouteUrlArgToken, RouteControllerArgToekn } from '../router';

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
            router.routes(prefix, this.container.get(ControllerRoute,
                { provide: RouteUrlArgToken, useValue: prefix },
                { provide: RouteControllerArgToekn, useValue: ctx.targetType }))
        });

        next();
    }
}
