import { Aspect, Pointcut, Joinpoint } from '@ts-ioc/aop';


@Aspect
export class AuthAspect {
    // pointcut for method has @Authorization decorator.
    @Pointcut('@annotation(Authorization)')
    auth() {

    }

}
