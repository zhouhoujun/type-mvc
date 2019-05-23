import { DIModule, DefaultConfigureToken } from '@tsdi/boot';
import { AopModule } from '@tsdi/aop';
import { LogModule } from '@tsdi/logs';
import * as middlewares from './middlewares';
import * as routers from './router';
import { ModelModule } from '@mvx/model';
import { MvcConfigureRegister } from './MvcConfigureRegister';
import { MvcCoreModule } from './CoreModule';


@DIModule({
    imports: [
        MvcCoreModule,
        AopModule,
        LogModule,
        routers,
        middlewares,
        ModelModule,
        MvcConfigureRegister
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
    ]
})
export class MvcModule {

}
