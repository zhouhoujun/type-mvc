import { Aspect, Joinpoint, Before } from '@tsdi/aop';
import { AuthorizationMetadata, ContextToken, UnauthorizedError } from '@mvx/mvc'
import { IContainer, ContainerToken } from '@tsdi/core';
import { Inject } from '@tsdi/ioc';

@Aspect
export class TokenVaildate {

    @Inject(ContainerToken)
    private container: IContainer;

    @Before('execution(AuthAspect.auth)', 'authAnnotation')
    sessionCheck(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        let currContext = this.container.get(ContextToken);
        if (!currContext.header.token) {
            throw new UnauthorizedError();
        }
        authAnnotation.forEach(ann => {
            if (ann.role) {
                // todo: check role.
            }
        });
    }
}
