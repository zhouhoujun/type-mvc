import { DesignContext, hasOwnClassMetadata, getTypeMetadata, InjectToken, hasMethodMetadata } from '@tsdi/ioc';
import { Authorization, ControllerMetadata, Controller } from '@mvx/mvc';

/**
 *  the routes need to auth.
 */
export const AuthRoutesToken = new InjectToken<Set<string>>('identify_auth_routes');

export const ControllerAuthRegisterAction = (ctx: DesignContext, next: () => void) => {
    if (hasOwnClassMetadata(Authorization, ctx.type) || hasMethodMetadata(Authorization, ctx.type)) {
        let ctrlmetadatas = getTypeMetadata<ControllerMetadata>(Controller, ctx.type);
        let routers = ctx.injector.get(AuthRoutesToken);
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
