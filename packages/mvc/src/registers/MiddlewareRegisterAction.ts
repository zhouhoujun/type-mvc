import { IocDesignAction, DesignActionContext, hasClassMetadata } from '@tsdi/ioc';
import { Middleware } from '../decorators';
import { MiddlewareRegisterer } from '../middlewares';

export class MiddlewareRegisterAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void): void {
        if (hasClassMetadata(Middleware, ctx.targetType)) {
            this.container.get(MiddlewareRegisterer)
                .add(ctx.targetType);
        }
        next();
    }
}
