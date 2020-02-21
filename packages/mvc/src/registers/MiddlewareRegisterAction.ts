import { DesignActionContext, lang } from '@tsdi/ioc';
import { MiddlewareMetadata } from '../metadata';
import { MiddlewareClass, IMiddleware } from '../middlewares/IMiddleware';
import { MiddlewareRegister } from '../middlewares/MiddlewareRegister';


export const MiddlewareRegisterAction = (ctx: DesignActionContext, next: () => void) => {
    let metas = ctx.reflects.getMetadata<MiddlewareMetadata>(ctx.currDecoractor, ctx.type);
    let meta = metas.find(meta => !!meta.before || !!meta.after) || lang.first(metas);

    if (meta.scope === 'global') {
        let mType = ctx.type as MiddlewareClass<IMiddleware>;
        mType.middleName = meta ? meta.name : lang.getClassName(mType)
        this.container.resolve(MiddlewareRegister)
            .set(mType, meta)
    }
    next();
}

