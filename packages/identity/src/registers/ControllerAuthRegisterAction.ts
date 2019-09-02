import { IocDesignAction, DesignActionContext, hasOwnClassMetadata, getTypeMetadata, InjectToken, hasMethodMetadata } from '@tsdi/ioc';
import { Authorization, ControllerMetadata, Controller } from '@mvx/mvc';

/**
 *  the routes need to auth.
 */
export const AuthRoutesToken = new InjectToken<Set<string>>('identify_auth_routes');

export class ControllerAuthRegisterAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void): void {
        if (hasOwnClassMetadata(Authorization, ctx.targetType) || hasMethodMetadata(Authorization, ctx.targetType)) {
            let ctrlmetadatas = getTypeMetadata<ControllerMetadata>(Controller, ctx.targetType);
            let routers = this.container.get(AuthRoutesToken);
            ctrlmetadatas.forEach(ctlmeta => {
                if (!ctlmeta) {
                    return;
                }
                let prefix = ctlmeta.routePrefix;
                if (prefix && !/^\//.test(prefix)) {
                    prefix = '/' + prefix;
                }
                routers.add(prefix);
            });
        }
        next();
    }
}
