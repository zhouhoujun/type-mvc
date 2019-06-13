import { Aspect, Pointcut } from '@tsdi/aop';
import { Controller } from '../decorators';

export const AuthorizationPointcut = 'execution(AuthorizationAspect.authProcess)'

/**
 * Auth aspect pointcut. pointcut for method has @Authorization decorator, to dynamic check your custom auth validation.
 *
 * @export
 * @class AuthAspect
 */
@Aspect({
    annotation: Controller
})
export class AuthorizationAspect {
    // pointcut for method has @Authorization decorator.
    @Pointcut('@annotation(Authorization)')
    authProcess() {
        // todo: pointcut for custom auth.
    }

}
