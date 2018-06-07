import { Aspect, Pointcut } from '@ts-ioc/aop';

/**
 * Auth aspect. pointcut method with @Authorization decorator, to check your custom auth validation.
 *
 * @export
 * @class AuthAspect
 */
@Aspect
export class AuthAspect {
    // pointcut for method has @Authorization decorator.
    @Pointcut('@annotation(Authorization)')
    auth() {

    }

}
