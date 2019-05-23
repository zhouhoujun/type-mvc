// import { isRegExp } from '@tsdi/core';
// import { Aspect, Around, Joinpoint, Before } from '@tsdi/aop';


// @Aspect
// export class DebugLog {

//     @Before(/\w+Controller.\w+/)
//     // @Before('execution(*)')
//     beforlog(joinPoint: Joinpoint) {
//         console.log('aspect Before log:', joinPoint.fullName);
//     }

//     @Around('execution(*.*)')
//     log(joinPoint: Joinpoint) {
//         console.log('aspect Around log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' Args:', joinPoint.args, ' returning:', joinPoint.returningValue, ' throwing:', joinPoint.throwing);
//     }
// }
