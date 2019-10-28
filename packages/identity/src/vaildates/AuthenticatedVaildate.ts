import { Inject, isFunction } from '@tsdi/ioc';
import { IContainer, ContainerToken } from '@tsdi/core';
import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, UnauthorizedError, AuthorizationPointcut } from '@mvx/mvc'

@Aspect({
    singleton: true
})
export class AuthenticatedVaildate {

    @Inject(ContainerToken)
    private container: IContainer;

    @Before(AuthorizationPointcut, 'authAnnotation')
    vaildate(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        let ctx = this.container.resolve(ContextToken);
        if (!isFunction(ctx.isAuthenticated)) {
            return;
        }
        if (!ctx.isAuthenticated()) {
            throw new UnauthorizedError();
        }
    }
}
