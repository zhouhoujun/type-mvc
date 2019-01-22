import { Singleton, IContainer, Inject, ContainerToken, isFunction, Token, lang, Type } from '@ts-ioc/core';
import * as http from 'http';
import * as https from 'https';
import { IConfiguration } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IMvcServer, CoreServerToken, ApplicationToken, IApplication } from './IApplication';
import { IContext } from './IContext';
import { Next } from './util';
import { ServerListenerToken } from './IListener';
import { MiddlewareChainToken, IMiddlewareChain } from './middlewares';
import { Boot, RunOptions, IConfigureManager } from '@ts-ioc/bootstrap';

/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
@Singleton(ApplicationToken)
export class Application extends Boot<IMvcServer> implements IApplication {
    name?: string;

    protected config: IConfiguration;
    private httpServer: http.Server | https.Server;
    private _loggerMgr: ILoggerManager;

    @Inject(ContainerToken)
    container: IContainer;

    getConfig(): IConfiguration {
        return this.config as IConfiguration;
    }

    protected controllers: Type<any>[];
    protected middlewares: Type<any>[];
    protected aops: Type<any>[];

    @Inject(MiddlewareChainToken)
    middlewareChain: IMiddlewareChain;

    private configMgr: IConfigureManager<IConfiguration>;

    constructor(token?: Token<IMvcServer>, instance?: IMvcServer, config?: IConfiguration) {
        super(token, instance, config);
        this.controllers = [];
        this.middlewares = [];
        this.aops = [];
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
        }, this.config, gcfg);

        // options.bootBuilder.getPools().iterator()
        // this.controllers = await this.container.loadModule(this.config.controllers);
        // this.middlewares = await this.container.loadModule(this.config.middlewares);
        // this.aops = await this.container.loadModule(this.config.aop);
    }

    getConfigureManager(): IConfigureManager<IConfiguration> {
        return this.configMgr;
    }

    getControllers(): Type<any>[] {
        return this.controllers;
    }

    getMiddlewares(): Type<any>[] {
        return this.middlewares;
    }

    getAops(): Type<any>[] {
        return this.aops;
    }

    getMiddleChain(): IMiddlewareChain {
        return this.container.resolve(MiddlewareChainToken);
    }

    private mvcService: IMvcServer;
    getServer(): IMvcServer {
        if (!this.mvcService) {
            this.mvcService = this.container.resolve(CoreServerToken);
        }
        return this.mvcService;
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

    getHttpServer() {
        if (!this.httpServer) {
            let cfg = this.getConfig();
            if (cfg.httpsOptions) {
                this.httpServer = https.createServer(cfg.httpsOptions, this.getServer().callback());
            } else {
                this.httpServer = http.createServer(this.getServer().callback());
            }
        }
        return this.httpServer;
    }

    use(middleware: (context: IContext, next?: Next) => any) {
        this.getServer().use(middleware);
    }

    async start() {
        let config = this.getConfig();
        let listener = this.container.has(ServerListenerToken) ? this.container.get(ServerListenerToken) : null;
        let func;
        if (isFunction(listener)) {
            func = listener;
        } else if (listener) {
            let ls = listener;
            func = (...args: any[]) => ls.listener(...args);
        }

        let server = this.getHttpServer();
        let port = config.port || parseInt(process.env.PORT || '0');
        if (config.hostname) {
            server.listen(port, config.hostname, func);
        } else {
            server.listen(port, func);
        }
        console.log('service listen on port: ', port);
    }

    async stop() {
        let server = this.getHttpServer();
        server.removeAllListeners();
        server.close();
    }

}
