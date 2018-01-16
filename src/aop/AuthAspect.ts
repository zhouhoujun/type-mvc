import { Aspect, Pointcut, Joinpoint } from 'tsioc';


@Aspect
export class AuthAspect {
    // pointcut for method has @Authorization decorator.
    @Pointcut('@annotation(Authorization)')
    auth() {

    }

}
