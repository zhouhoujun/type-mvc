import { Abstract } from '@tsdi/ioc';
import { MvcMiddleware, Middleware, MiddlewareTypes, IContext, MvcContext, MiddlewareFunc } from '@mvx/mvc';
const session = require('koa-session');
import { stores, Session } from 'koa-session';

/**
 * Session storage.
 */
@Abstract()
export abstract class SessionStorage implements stores {

    constructor() {

    }

    abstract get(key: string, maxAge: number | 'session', data: { rolling: boolean; });

    abstract set(key: string, sess: Partial<Session> & { _expire?: number; _maxAge?: number; }, maxAge: number | 'session', data: { changed: boolean; rolling: boolean; });

    abstract destroy(key: string);
}

/**
 * session middleware.
 *
 * @export
 * @class SessionMiddleware
 * @extends {MvcMiddleware}
 */
@Middleware({
    name: MiddlewareTypes.Session,
    before: MiddlewareTypes.BodyParser
})
export class SessionMiddleware extends MvcMiddleware {

    private middleware: MiddlewareFunc;
    private hasInit = false;
    getMiddleware(context: MvcContext, koa: any) {
        if (!this.hasInit && !this.middleware) {
            let sessCfg = context.getConfiguration().session;
            this.hasInit = true;
            if (sessCfg) {
                sessCfg = Object.assign({
                    key: 'typemvc:sess', /** (string) cookie key (default is koa:sess) */
                    /** (number || 'session') maxAge in ms (default is 1 days) */
                    /** 'session' will result in a cookie that expires when session/browser is closed */
                    /** Warning: If a session cookie is stolen, this cookie will never expire */
                    maxAge: 36000000,
                    overwrite: true, /** (boolean) can overwrite or not (default true) */
                    httpOnly: true, /** (boolean) httpOnly or not (default true) */
                    signed: true, /** (boolean) signed or not (default true) */
                    rolling: false/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
                }, sessCfg);
                if (!sessCfg.store) {
                    let storage = context.getContainer().getService(SessionStorage);
                    if (storage) {
                        sessCfg.store = storage;
                    }
                }

                this.middleware = session(sessCfg, koa);
            } else {
                this.middleware = session(koa);
            }
        }
        return this.middleware;
    }

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        let middleware = this.getMiddleware(ctx.mvcContext, ctx.app);
        return middleware(ctx, next);
    }
}
