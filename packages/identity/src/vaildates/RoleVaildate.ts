import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, ForbiddenError } from '@mvx/mvc'
import { IContainer, ContainerToken } from '@tsdi/core';
import { Inject, isFunction } from '@tsdi/ioc';

@Aspect({
    singleton: true
})
export class RoleVaildate {

    @Inject(ContainerToken)
    private container: IContainer;

    @Before('execution(AuthAspect.auth)', 'authAnnotation')
    vaildate(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        let ctx = this.container.resolve(ContextToken);
        if (isFunction(ctx.hasRole) && authAnnotation && authAnnotation.length) {
            if (ctx.hasRole(...authAnnotation.map(a => a.role).filter(a => a))) {
                throw new ForbiddenError();
            }
        }
    }
}
