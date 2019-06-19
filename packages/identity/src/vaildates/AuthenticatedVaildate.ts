import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, UnauthorizedError, ForbiddenError, AuthorizationPointcut } from '@mvx/mvc'
import { IContainer, ContainerToken } from '@tsdi/core';
import { Inject, isFunction } from '@tsdi/ioc';

@Aspect({
    singleton: true
})
export class AuthenticatedVaildate {

    @Inject(ContainerToken)
    private container: IContainer;

    @Before(AuthorizationPointcut, 'authAnnotation')
    vaildate(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        let ctx = this.container.resolve(ContextToken);
        if (!ctx.isUnauthenticated) {
            return;
        }
        if (!ctx.isAuthenticated()) {
            throw new UnauthorizedError();
        }
    }
}
