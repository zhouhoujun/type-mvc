import { DIModule, DefaultConfigureToken } from '@ts-ioc/bootstrap';
import { AopModule } from '@ts-ioc/aop';
import { LogModule } from '@ts-ioc/logs';
import * as injectors from './injectors';
import * as modles from './model';
import * as middlewares from './middlewares';
import * as routers from './router';
import { MvcConfigureRegister } from './MvcConfigureRegister';
import { Application } from './Application';

@DIModule({
    imports: [
        Application,
        MvcConfigureRegister,
        AopModule,
        LogModule,
        injectors,
        routers,
        middlewares,
        modles
    ],
    providers: [
        {
            provide: DefaultConfigureToken,
            useValue: {
                assertUrlRegExp: /\/((\w|%|\.))+\.\w+$/,
                hostname: '',
                port: 3000,
                routePrefix: '',
                setting: {},
                connections: {},
                middlewares: ['./middlewares/**/*{.js,.ts}', '!./**/*.d.ts'],
                controllers: ['./controllers/**/*{.js,.ts}', '!./**/*.d.ts'],
                aop: ['./aop/**/*{.js,.ts}', '!./**/*.d.ts'],
                views: './views',
                viewsOptions: {
                    extension: 'ejs',
                    map: { html: 'nunjucks' }
                },
                models: ['./models/**/*{.js,.ts}', '!./**/*.d.ts'],
                debug: false,
                session: {
                    key: 'typemvc:sess', /** (string) cookie key (default is koa:sess) */
                    /** (number || 'session') maxAge in ms (default is 1 days) */
                    /** 'session' will result in a cookie that expires when session/browser is closed */
                    /** Warning: If a session cookie is stolen, this cookie will never expire */
                    maxAge: 86400000,
                    overwrite: true, /** (boolean) can overwrite or not (default true) */
                    httpOnly: true, /** (boolean) httpOnly or not (default true) */
                    signed: true, /** (boolean) signed or not (default true) */
                    rolling: false/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
                },
                contents: ['./public'],
                isRouteUrl(ctxUrl: string): boolean {
                    let flag = !this.assertUrlRegExp.test(ctxUrl);
                    if (flag && this.routeUrlRegExp) {
                        return this.routeUrlRegExp.test(ctxUrl);
                    }
                    return flag;
                }
            }
        }
    ],
    exports: [
        AopModule,
        LogModule,
        injectors,
        routers,
        middlewares,
        Application,
        MvcConfigureRegister,
        modles
    ]
})
export class MvcModule {

}
