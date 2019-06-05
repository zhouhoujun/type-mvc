import { IocDesignAction, DesignActionContext, getOwnTypeMetadata } from '@tsdi/ioc';
import { MiddlewareRegister } from '../middlewares';
import { MiddlewareMetadata } from '../metadata';


export class MiddlewareRegisterAction extends IocDesignAction {
    execute(ctx: DesignActionContext, next: () => void): void {
        let metas = getOwnTypeMetadata<MiddlewareMetadata>(ctx.currDecoractor, ctx.targetType);
        let meta = metas.find(meta => !!meta.before || !!meta.after);

        this.container.resolve(MiddlewareRegister)
            .set(ctx.targetType, meta)

        next();
    }
}
