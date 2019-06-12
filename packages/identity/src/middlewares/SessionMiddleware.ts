import { MvcMiddleware, Middleware, MiddlewareTypes, IContext, MvcContext, MiddlewareFunc } from '@mvx/mvc';
const session = require('koa-session');
import { Application } from 'koa';

@Middleware({
    name: MiddlewareTypes.Session,
    before: MiddlewareTypes.BodyParser
})
export class SessionMiddleware extends MvcMiddleware {

    private middleware: MiddlewareFunc;
    getMiddleware(context: MvcContext, koa: Application) {
        if (!this.middleware) {
            this.middleware = session(Object.assign({
                key: 'typemvc:sess', /** (string) cookie key (default is koa:sess) */
                /** (number || 'session') maxAge in ms (default is 1 days) */
                /** 'session' will result in a cookie that expires when session/browser is closed */
                /** Warning: If a session cookie is stolen, this cookie will never expire */
                maxAge: 86400000,
                overwrite: true, /** (boolean) can overwrite or not (default true) */
                httpOnly: true, /** (boolean) httpOnly or not (default true) */
                signed: true, /** (boolean) signed or not (default true) */
                rolling: false/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
            }, context.configuration.session), koa);
        }
        return this.middleware;
    }

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        return this.getMiddleware(ctx.mvcContext, ctx.app)(ctx, next);
    }
}
