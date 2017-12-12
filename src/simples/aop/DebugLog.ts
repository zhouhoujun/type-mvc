import { Aspect, Around, Joinpoint, Before } from 'tsioc';
import { isRegExp } from 'util';


@Aspect
export class DebugLog {

    // @Before(/\w+Controller.\w+/)
    @Before('execution(*)')
    beforlog(joinPoint: Joinpoint) {
        console.log('aspect Before log:', joinPoint.fullName);
    }

    @Around('execution(*Controller.*)')
    log(joinPoint: Joinpoint) {
        console.log('aspect Around log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' Args:', joinPoint.args, ' returning:', joinPoint.returning, ' throwing:', joinPoint.throwing);
    }
}
