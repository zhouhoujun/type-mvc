import { IocDesignAction, DesignActionContext, hasClassMetadata, getTypeMetadata } from '@tsdi/ioc';
import { Controller } from '../decorators';
import { ControllerMetadata } from '../metadata';
import { Router, ControllerRoute } from '../router';

export class ControllerRegisterAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void): void {
        if (hasClassMetadata(Controller, ctx.targetType)) {
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
                router.routes(prefix, new ControllerRoute(prefix, ctx.targetType))
            });
        }
        next();
    }
}
