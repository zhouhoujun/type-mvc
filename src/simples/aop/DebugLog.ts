// import { isRegExp } from '@ts-ioc/core';
// import { Aspect, Around, Joinpoint, Before } from '@ts-ioc/aop';


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
