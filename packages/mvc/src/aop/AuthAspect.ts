import { Aspect, Pointcut } from '@tsdi/aop';
import { Controller } from '../decorators';

/**
 * Auth aspect pointcut. pointcut for method has @Authorization decorator, to dynamic check your custom auth validation.
 *
 * @export
 * @class AuthAspect
 */
@Aspect({
    annotation: Controller
})
export class AuthAspect {
    // pointcut for method has @Authorization decorator.
    @Pointcut('@annotation(Authorization)')
    auth() {
        console.log('AuthAspect...')
    }
}
