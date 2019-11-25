import { IocDesignAction, DesignActionContext, lang } from '@tsdi/ioc';
import { MiddlewareRegister, IMiddleware, MiddlewareClass } from '../middlewares';
import { MiddlewareMetadata } from '../metadata';


export class MiddlewareRegisterAction extends IocDesignAction {
    execute(ctx: DesignActionContext, next: () => void): void {
        let metas = ctx.reflects.getMetadata<MiddlewareMetadata>(ctx.currDecoractor, ctx.targetType);
        let meta = metas.find(meta => !!meta.before || !!meta.after) || lang.first(metas);

        if (meta.scope === 'global') {
            let mType = ctx.targetType as MiddlewareClass<IMiddleware>;
            mType.middleName = meta ? meta.name : lang.getClassName(mType)
            this.container.resolve(MiddlewareRegister)
                .set(mType, meta)
        }
        next();
    }
}
