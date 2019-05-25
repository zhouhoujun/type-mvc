// import { Middleware } from '../decorators';
// import { Middlewares } from '../IMiddleware';
// import { MvcMiddleware } from './MvcMiddleware';
// import { IContext } from '../IContext';
// import { Router } from '../router';
// import { Inject } from '@tsdi/ioc';



// @Middleware(Middlewares.Cors)
// export class CorsMiddleware extends MvcMiddleware {

//     @Inject()
//     private router: Router;

//     async execute(ctx: IContext, next: () => Promise<void>) {
//         if ((!ctx.status || ctx.status === 404) && this.router.isRouteUrl(ctx.url)) {
//             return this.router.options(ctx, next);
//         }
//     }
// }
