import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, UnauthorizedError, ForbiddenError } from '@mvx/mvc'
import { IContainer, ContainerToken } from '@tsdi/core';
import { Inject, isFunction } from '@tsdi/ioc';
import { RegisterFor, RegFor } from '@tsdi/boot';

@Aspect({
    singleton: true
})
export class AuthenticatedVaildate {

    @Inject(ContainerToken)
    private container: IContainer;

    @Before('execution(AuthAspect.auth)', 'authAnnotation')
    authenticated(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        let ctx = this.container.resolve(ContextToken);
        if (!ctx.isUnauthenticated) {
            return;
        }
        if (!ctx.isAuthenticated()) {
            throw new UnauthorizedError();
        }

        if (isFunction(ctx.hasRole) && authAnnotation && authAnnotation.length) {
            if (ctx.hasRole(...authAnnotation.map(a => a.role).filter(a => a))) {
                throw new ForbiddenError();
            }
        }
    }
}
