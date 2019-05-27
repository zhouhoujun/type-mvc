import { IocResolveServiceAction, ResolveServiceContext } from '@tsdi/core';
import { isClassType, getOwnTypeMetadata, lang, InjectReference } from '@tsdi/ioc';
import { MvcModuleMetadata } from '../metadata';
import { BootContext, Runnable } from '@tsdi/boot';
import { MvcContext } from '../MvcContext';
import { MvcServer } from '../MvcServer';


export class MvcModuleDecoratorServiceAction extends IocResolveServiceAction {
    execute(ctx: ResolveServiceContext<any>, next: () => void): void {
        if (!isClassType(ctx.currTargetType)) {
            return next();
        }

        let stype = this.container.getTokenProvider(ctx.currToken || ctx.token);

        if (!ctx.instance) {
            if (lang.isExtendsClass(stype, BootContext)) {
                let metas = getOwnTypeMetadata<MvcModuleMetadata>(ctx.currDecorator, ctx.currTargetType);
                metas.some(m => {
                    if (m && lang.isExtendsClass(m.contextType, stype)) {
                        ctx.instance = this.container.get(m.contextType, ...ctx.providers);
                    }
                    return !!ctx.instance;
                });
                if (!ctx.instance) {
                    let ref = new InjectReference(BootContext, ctx.currDecorator);
                    if (this.container.has(ref)) {
                        this.resolve(ctx, ref);
                    } else {
                        this.resolve(ctx, MvcContext);
                    }
                }
            }
            if (lang.isExtendsClass(stype, Runnable)) {
                this.resolve(ctx, MvcServer);
            }
        }
        if (!ctx.instance) {
            next();
        }
    }
}