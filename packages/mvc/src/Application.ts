import { IContainer, Inject, ContainerToken, lang, Type, isClass, MapSet, InstanceFactory, hasOwnClassMetadata, Injectable } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IApplication, ApplicationToken } from './IApplication';
import { IMvcServer, MvcServerToken } from './IMvcServer';
import { IContext } from './IContext';
import { Next } from './util';
import { MiddlewareChainToken, IMiddlewareChain } from './middlewares';
import { Boot, RunOptions, IConfigureManager, RunnableOptions, RunnableOptionsToken } from '@ts-ioc/bootstrap';
import { Controller, Middleware } from './decorators';
import { MvcHostBuilder } from './MvcHostBuilder';

/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
@Injectable(ApplicationToken)
export class Application extends Boot<IMvcServer> implements IApplication {
    name?: string;

    protected config: IConfiguration;
    private _loggerMgr: ILoggerManager;

    @Inject(ContainerToken)
    container: IContainer;

    getConfig(): IConfiguration {
        return this.config as IConfiguration;
    }

    protected controllers: MapSet<Type<any>, InstanceFactory<any>>;
    protected middlewares: MapSet<Type<any>, InstanceFactory<any>>;

    @Inject(MiddlewareChainToken)
    middlewareChain: IMiddlewareChain;

    private configMgr: IConfigureManager<IConfiguration>;

    constructor(@Inject(RunnableOptionsToken) options: RunnableOptions<IMvcServer>) {
        super(options);
        this.controllers = new MapSet();
        this.middlewares = new MapSet();
        // this.aops = new MapSet();
    }

    async onInit(options: RunOptions<IMvcServer>) {
        this.configMgr = options.configManager;
        let gcfg = await this.configMgr.getConfig();
        this.config = lang.assign({
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
        }, gcfg, this.config);

        let builder = options.bootBuilder as MvcHostBuilder;

        builder.getPools().iterator(c => {
            c.forEach((tk, fac) => {
                if (isClass(tk)) {
                    if (hasOwnClassMetadata(Controller, tk)) {
                        this.controllers.set(tk, fac);
                    } else if (hasOwnClassMetadata(Middleware, tk)) {
                        this.middlewares.set(tk, fac);
                    }
                }
            })
        });

        await this.getMiddleChain()
            .use(...[...this.getMiddlewares(), ...builder.middlewares])
            .setup(this);

    }

    getConfigureManager(): IConfigureManager<IConfiguration> {
        return this.configMgr;
    }

    getControllers(): Type<any>[] {
        return this.controllers.keys();
    }

    getMiddlewares(): Type<any>[] {
        return this.middlewares.keys();
    }

    getMiddleChain(): IMiddlewareChain {
        return this.container.resolve(MiddlewareChainToken);
    }

    getServer(): IMvcServer {
        return this.options.instance;
    }

    getLoggerManger(): ILoggerManager {
        if (!this._loggerMgr) {
            let cfg = this.getConfig();
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(ConfigureLoggerManagerToken, { config: cfg.logConfig })
        }
        return this._loggerMgr;
    }


    getLogger(name?: string): ILogger {
        return this.getLoggerManger().getLogger(name);
    }

    use(middleware: (context: IContext, next?: Next) => any) {
        this.getServer().use(middleware);
    }

    async start() {
        this.getServer().start(this.config);
    }

    async stop() {
        this.getServer().stop();
    }

}
