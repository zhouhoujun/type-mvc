import { Aspect, Around, Joinpoint, Before } from 'tsioc';


@Aspect
export class DebugLog {
    @Around('execution(*Controller.*)')
    log(joinPoint: Joinpoint) {
        console.log('aspect append log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' Args:', joinPoint.args ,  ' returning:', joinPoint.returning, ' throwing:', joinPoint.throwing);
    }

    @Before(/Controller.\*$/)
    Beforlog(joinPoint: Joinpoint) {
        console.log('aspect Befor log:', joinPoint.fullName);
    }
}
