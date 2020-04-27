import { Inject, isFunction } from '@tsdi/ioc';
import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, ForbiddenError, AuthorizationPointcut, IContext } from '@mvx/mvc';

@Aspect()
export class RoleVaildate {

    @Before(AuthorizationPointcut, 'authAnnotation')
    vaildate(@Inject(ContextToken) ctx: IContext, authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        if (isFunction(ctx.hasRole) && authAnnotation && authAnnotation.length) {
            if (!ctx.hasRole(...authAnnotation.map(a => a.role).filter(a => a))) {
                throw new ForbiddenError();
            }
        }
    }
}
