import { Aspect, Pointcut } from '@tsdi/aop';
import { Controller } from '../decorators';

/**
 * Auth aspect. pointcut method with @Authorization decorator, to check your custom auth validation.
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

    }
}
