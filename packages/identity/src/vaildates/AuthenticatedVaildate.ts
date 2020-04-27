import { Inject, isFunction } from '@tsdi/ioc';
import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, UnauthorizedError, AuthorizationPointcut, IContext } from '@mvx/mvc'

@Aspect()
export class AuthenticatedVaildate {

    @Before(AuthorizationPointcut, 'authAnnotation')
    vaildate(@Inject(ContextToken) ctx: IContext, authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        if (!isFunction(ctx.isAuthenticated)) {
            return;
        }
        console.log(ctx.URL.href, ctx.isAuthenticated())
        if (!ctx.isAuthenticated()) {
            throw new UnauthorizedError();
        }
    }
}
